import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

interface Notification {
  id: string;
  timestamp: string;
  target: 'teachers' | 'students' | 'all';
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

interface NotificationsContextState {
  socket: Socket | null;
  notifications: Notification[];
  sendNotification: (data: Omit<Notification, 'id' | 'timestamp'>) => void;
}

const NotificationsContext = createContext<NotificationsContextState | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode; role: 'student' | 'teacher' | null }> = ({ children, role }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!role) return;

    // Connect to Socket.io server
    const newSocket = io(window.location.origin);
    
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      newSocket.emit('join', role === 'teacher' ? 'teachers' : 'students');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    newSocket.on('notification', (data: Notification) => {
      setNotifications(prev => [data, ...prev]);
      
      // Show toast
      if (data.type === 'warning') {
        toast.error(data.title, { description: data.message });
      } else if (data.type === 'success') {
        toast.success(data.title, { description: data.message });
      } else {
        toast.info(data.title, { description: data.message });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [role]);

  const sendNotification = (data: Omit<Notification, 'id' | 'timestamp'>) => {
    if (socket) {
      socket.emit('send_notification', data);
    }
  };

  return (
    <NotificationsContext.Provider value={{ socket, notifications, sendNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
