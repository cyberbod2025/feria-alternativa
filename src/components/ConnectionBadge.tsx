import React from 'react';
import { useAuth } from '../store/AuthContext';
import { Badge } from './ui/badge';
import { Wifi, WifiOff, Server } from 'lucide-react';

const LABELS: Record<string, { label: string; variant: 'default' | 'neutral' | 'destructive'; icon: React.ReactNode }> = {
  real: {
    label: 'Real',
    variant: 'default',
    icon: <Wifi className="w-3 h-3" />,
  },
  demo: {
    label: 'Demo',
    variant: 'neutral',
    icon: <Server className="w-3 h-3" />,
  },
  offline: {
    label: 'Offline',
    variant: 'destructive',
    icon: <WifiOff className="w-3 h-3" />,
  },
};

export default function ConnectionBadge() {
  const { connectionStatus } = useAuth();
  const cfg = LABELS[connectionStatus];

  return (
    <Badge variant={cfg.variant} className="gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider font-bold">
      {cfg.icon}
      {cfg.label}
    </Badge>
  );
}
