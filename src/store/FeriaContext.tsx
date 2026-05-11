import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { StandProgress, Stand } from '../types';
import { mockStands } from '../data/mockStands';

interface FeriaContextType {
  stands: Stand[];
  progress: StandProgress[];
  markArrived: (standId: string, qrSlug: string) => boolean;
  markVisited: (standId: string, score: number) => void;
  getSuggestedStand: () => Stand | null;
  getVisitedStands: () => Stand[];
  eventEndTime: number | null;
  totalStudentScore: number;
}

const FeriaContext = createContext<FeriaContextType | undefined>(undefined);

export function FeriaProvider({ children }: { children: React.ReactNode }) {
  // Let's use a dynamic state for stands to simulate capacity updates
  const [stands, setStands] = useState<Stand[]>(mockStands);
  
  const [progress, setProgress] = useState<StandProgress[]>(() => {
    const saved = localStorage.getItem('feria_progress');
    return saved ? JSON.parse(saved) : [];
  });

  const [eventEndTime] = useState<number | null>(() => {
    const savedEndTime = localStorage.getItem('feria_eventEndTime');
    if (savedEndTime) return parseInt(savedEndTime, 10);
    // Start a 2 hour event (for demo, let's just make it 2 hours from now if no time exists)
    const endTime = Date.now() + 2 * 60 * 60 * 1000;
    localStorage.setItem('feria_eventEndTime', endTime.toString());
    return endTime;
  });

  useEffect(() => {
    localStorage.setItem('feria_progress', JSON.stringify(progress));
  }, [progress]);

  const totalStudentScore = useMemo(() => {
    return progress.reduce((acc, curr) => acc + (curr.score || 0), 0);
  }, [progress]);

  const markArrived = (standId: string, qrSlug: string) => {
    const stand = stands.find(s => s.id === standId);
    if (!stand) return false;
    
    if (stand.qrSlug !== qrSlug) return false;
    if (stand.currentVisitors >= 20) return false;

    // Increase capacity virtually
    setStands(prev => prev.map(s => {
      if (s.id === standId) {
        return { ...s, currentVisitors: s.currentVisitors + 1, totalVisitors: s.totalVisitors + 1 };
      }
      return s;
    }));

    setProgress((prev) => {
      const exists = prev.find((p) => p.standId === standId);
      if (exists) return prev;
      return [...prev, { standId, arrivedAt: Date.now() }];
    });

    return true;
  };

  const markVisited = (standId: string, score: number) => {
    const existingProgress = progress.find(p => p.standId === standId);
    if (existingProgress?.visitedAt) return; // Prevent cheating/multiple clicks

    // Decrease capacity virtually and add points to the stand
    setStands(prev => prev.map(s => {
      if (s.id === standId) {
        return { 
          ...s, 
          currentVisitors: Math.max(0, s.currentVisitors - 1),
          totalPoints: (s.totalPoints || 0) + score
        };
      }
      return s;
    }));

    setProgress((prev) => {
      const exists = prev.find((p) => p.standId === standId);
      if (exists) {
        return prev.map(p => p.standId === standId ? { ...p, visitedAt: Date.now(), score } : p);
      }
      return [...prev, { standId, arrivedAt: Date.now() - 60000, visitedAt: Date.now(), score }];
    });
  };

  const getSuggestedStand = () => {
    const unvisitedStands = stands.filter((s) => !progress.some((p) => p.standId === s.id));
    if (unvisitedStands.length === 0) return null;
    
    // Sort by recommendation logic: available > recommended > moderate > saturated. And filter >= 20
    const available = unvisitedStands.filter(s => s.currentVisitors < 20);
    if (available.length === 0) return null;

    return available.sort((a, b) => {
      const rank = { recommended: 1, active: 2, moderate: 3, inactive: 5, saturated: 6 };
      return rank[a.status] - rank[b.status];
    })[0];
  };

  const getVisitedStands = () => {
    return stands.filter((s) => progress.some((p) => p.standId === s.id && p.visitedAt));
  };

  return (
    <FeriaContext.Provider value={{ stands, progress, markArrived, markVisited, getSuggestedStand, getVisitedStands, eventEndTime, totalStudentScore }}>
      {children}
    </FeriaContext.Provider>
  );
}

export const useFeria = () => {
  const context = useContext(FeriaContext);
  if (!context) throw new Error('useFeria must be used within a FeriaProvider');
  return context;
};
