import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, Role, StandProgress } from '../types';

interface AuthContextType {
  session: UserSession | null;
  login: (name: string, lastName: string, group: string) => void;
  loginSase: (token: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = sessionStorage.getItem('feria_session');
    if (saved) {
      const parsed = JSON.parse(saved) as UserSession;
      if (parsed.expiresAt > Date.now()) {
        return parsed;
      }
      sessionStorage.removeItem('feria_session');
    }
    return null;
  });

  useEffect(() => {
    if (session) {
      sessionStorage.setItem('feria_session', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('feria_session');
    }
  }, [session]);

  const login = (name: string, lastName: string, group: string) => {
    setSession({
      token: Math.random().toString(36).substring(2),
      role: 'student',
      name,
      lastName,
      group,
      expiresAt: Date.now() + 1000 * 60 * 60 * 8 // 8 hours
    });
  };

  const loginSase = (token: string, role: Role) => {
    // In a real app, we validate the token with the backend.
    setSession({
      token,
      role,
      name: 'Docente/Admin',
      lastName: '',
      group: '',
      expiresAt: Date.now() + 1000 * 60 * 60 * 8
    });
  };

  const logout = () => {
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, loginSase, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
