import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserSession, Role, ConnectionStatus } from '../types';

// API base — same origin in dev (Express) or production (serverless/static fallback)
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
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) return 'real';
    return 'demo';
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

  useEffect(() => {
    if (session) {
      sessionStorage.setItem('feria_session', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('feria_session');
    }
  }, [session]);

  const login = useCallback((name: string, lastName: string, group: string) => {
    setSession({
      token: Math.random().toString(36).substring(2),
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
    // Attempt server-side logout if we have a real session token
    const current = session;
    setSession(null);
    if (current && current.token.length > 20) {
      try {
        await fetch(`${API_BASE}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${current.token}` },
        });
      } catch { /* server may be unreachable, local clear is sufficient */ }
    }
  }, [session]);

  const refreshSession = useCallback(async () => {
    const current = session;
    if (!current || current.token.length <= 20) return;

    try {
      const res = await fetch(`${API_BASE}/session`, {
        headers: { Authorization: `Bearer ${current.token}` },
        signal: AbortSignal.timeout(5000),
      });
      const data = await res.json();
      if (data.valid && data.session) {
        setSession(data.session);
        setConnectionStatus('real');
      } else {
        setSession(null);
      }
    } catch {
      setConnectionStatus(
        Boolean(
          (import.meta as any).env?.VITE_SUPABASE_URL &&
          (import.meta as any).env?.VITE_SUPABASE_ANON_KEY
        ) ? 'demo' : 'offline'
      );
    }
  }, [session]);

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
