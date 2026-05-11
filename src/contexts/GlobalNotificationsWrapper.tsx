import React from 'react';
import { useAuth } from '../store/AuthContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';

export const GlobalNotificationsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const role = session ? session.role === 'admin' ? 'teacher' : session.role as any : null;
  
  return (
    <NotificationsProvider role={role}>
      {children}
    </NotificationsProvider>
  );
};
