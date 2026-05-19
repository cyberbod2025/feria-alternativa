import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserSession, ConnectionStatus, SessionResponse } from '../types';

const API_BASE = '/api/feria';

interface AuthContextType {
  session: UserSession | null;
  connectionStatus: ConnectionStatus;
  login: (name: string, lastName: string, group: string) => void;
  loginSase: (session: UserSession) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredStudentSession(): UserSession | null {
  const saved = sessionStorage.getItem('feria_session');
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved) as Partial<UserSession>;
    if (
      parsed.role === 'student' &&
      typeof parsed.name === 'string' &&
      typeof parsed.lastName === 'string' &&
      typeof parsed.group === 'string' &&
      typeof parsed.expiresAt === 'number' &&
      parsed.expiresAt > Date.now()
    ) {
      return parsed as UserSession;
    }
  } catch { /* ignore corrupt data */ }
  sessionStorage.removeItem('feria_session');
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('offline');

  // Handoff sessions are trusted only after the backend validates the HttpOnly cookie.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/session`, {
          credentials: 'include',
          signal: AbortSignal.timeout(5000),
        });

        if (cancelled) return;

        if (res.ok) {
          const data: SessionResponse = await res.json();
          if (data.ok && data.session) {
            setSession(data.session);
            setConnectionStatus('real');
            return;
          }
        }

        // Backend explicitly rejects (401/403/invalid) → clear everything
        setSession(null);
        sessionStorage.removeItem('feria_session');
        setConnectionStatus('offline');
      } catch {
        if (cancelled) return;

        // Backend unreachable — fallback to sessionStorage for student only
        const studentSession = readStoredStudentSession();
        if (studentSession) {
          setSession(studentSession);
          setConnectionStatus('offline');
          return;
        }

        setConnectionStatus(
          Boolean(
            (import.meta as any).env?.VITE_SUPABASE_URL &&
            (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
          ) ? 'demo' : 'offline'
        );
      }
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (session?.role === 'student') {
      sessionStorage.setItem('feria_session', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('feria_session');
    }
  }, [session]);

  const login = useCallback((name: string, lastName: string, group: string) => {
    setSession({
      role: 'student',
      name,
      lastName,
      group,
      expiresAt: Date.now() + 1000 * 60 * 60 * 8,
    });
  }, []);

  const loginSase = useCallback((validatedSession: UserSession) => {
    setSession(validatedSession);
  }, []);

  const logout = useCallback(async () => {
    setSession(null);
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch { /* server unreachable, local clear is sufficient */ }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/session`, {
        credentials: 'include',
        signal: AbortSignal.timeout(5000),
      });
      const data: SessionResponse = await res.json();
      if (res.ok && data.ok && data.session) {
        setSession(data.session);
        setConnectionStatus(data.mode === 'real' ? 'real' : 'demo');
      } else {
        setSession((current) => current?.role === 'student' ? current : null);
        setConnectionStatus(data.mode === 'demo' ? 'demo' : 'offline');
      }
    } catch {
      setSession((current) => current?.role === 'student' ? current : null);
      setConnectionStatus(
        Boolean(
          (import.meta as any).env?.VITE_SUPABASE_URL &&
          (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
        ) ? 'demo' : 'offline'
      );
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, connectionStatus, login, loginSase, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
