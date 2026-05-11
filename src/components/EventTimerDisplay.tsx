import React, { useEffect, useState } from 'react';
import { useFeria } from '../store/FeriaContext';
import { useAuth } from '../store/AuthContext';
import { Clock } from 'lucide-react';
import { toast } from 'sonner';

export function EventTimerDisplay() {
  const { eventEndTime } = useFeria();
  const { session } = useAuth();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isFinished, setIsFinished] = useState(false);
  // Optional: keep track of last 10m interval to show toast
  const [lastNotifiedMin, setLastNotifiedMin] = useState<number | null>(null);

  useEffect(() => {
    if (!eventEndTime) return;

    const interval = setInterval(() => {
      const remaining = eventEndTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft(0);
        setIsFinished(true);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
        
        // Check for 10 min intervals (modulo)
        const minutesLeft = Math.floor(remaining / 60000);
        const next10minMarker = Math.ceil(minutesLeft / 10) * 10;
        
        // Notify every 10 mins (e.g. at 110, 100, 90... mins left)
        if (minutesLeft > 0 && minutesLeft % 10 === 0 && lastNotifiedMin !== minutesLeft) {
          toast(`⏰ Quedan ${minutesLeft} minutos para que termine la actividad.`, {
            duration: 5000,
            style: { background: '#f59e0b', color: '#fff', border: 'none' }
          });
          setLastNotifiedMin(minutesLeft);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eventEndTime, lastNotifiedMin]);

  useEffect(() => {
    if (isFinished && session) {
      if (session.role === 'student') {
        toast.error('¡Tiempo agotado! Dirígete a tu salón. Procesando resultados...', {
          duration: 10000,
        });
      } else {
        toast.error('¡Tiempo agotado! Instructores: Inicien desmontaje de stands y procesamiento de ganadores.', {
          duration: 10000,
        });
      }
    }
  }, [isFinished, session]);

  if (!eventEndTime || timeLeft <= 0) {
    return (
      <div className="flex items-center gap-2 bg-rose-500 text-white px-3 py-1.5 rounded-xl font-bold uppercase tracking-widest text-xs">
        <Clock className="w-4 h-4" />
        Terminado
      </div>
    );
  }

  const mins = Math.floor(timeLeft / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold uppercase tracking-widest text-xs border ${mins < 15 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 border-white/10 text-cyan-300'}`}>
      <Clock className="w-4 h-4" />
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </div>
  );
}
