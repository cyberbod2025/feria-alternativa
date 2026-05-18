import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserSession, Role, ConnectionStatus } from '../types';

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

async function checkConnection(): Promise<ConnectionStatus> {
  try {
    const res = await fetch(`${API_BASE}/session`, {
      credentials: 'include',
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) return 'real';
    const data = await res.json();
    return data.mode === 'offline' ? 'offline' : 'demo';
  } catch {
    const hasSupabase = Boolean(
      (import.meta as any).env?.VITE_SUPABASE_URL &&
      (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
    );
    return hasSupabase ? 'demo' : 'offline';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = sessionStorage.getItem('feria_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as UserSession;
        if (parsed.expiresAt > Date.now()) {
          return parsed;
        }
      } catch { /* ignore corrupt data */ }
      sessionStorage.removeItem('feria_session');
    }
    return null;
  });

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('offline');

  useEffect(() => {
    checkConnection().then(setConnectionStatus);
  }, []);

  // Hydrate session from backend on mount if cookie exists
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/session`, {
          credentials: 'include',
          signal: AbortSignal.timeout(5000),
        });
        const data = await res.json();
        if (data.ok && data.session) {
          setSession(data.session);
          setConnectionStatus('real');
        }
      } catch {
        // No backend session — keep local session or show offline
      }
    })();
  }, []);

  useEffect(() => {
    if (session) {
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
      const data = await res.json();
      if (data.ok && data.session) {
        setSession(data.session);
        setConnectionStatus(data.mode === 'real' ? 'real' : 'demo');
      } else {
        setSession(null);
        setConnectionStatus('offline');
      }
    } catch {
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
