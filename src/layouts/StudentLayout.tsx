import React, { useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation, useBlocker } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useFeria } from '../store/FeriaContext';
import { Map, Footprints, Trophy, Home, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { EventTimerDisplay } from '../components/EventTimerDisplay';
import { Button } from '../components/ui/button';

export default function StudentLayout() {
  const { session } = useAuth();
  const { stands, progress } = useFeria();
  const location = useLocation();

  const hasActiveTour = progress.length > 0 && progress.length < stands.length;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasActiveTour) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasActiveTour]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      if (!hasActiveTour) return false;
      const isStudentPath = /^\/(inicio|mapa|recorrido|progreso|stand(\/.*)?)$/.test(nextLocation.pathname);
      return !isStudentPath;
    }
  );

  if (!session || session.role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Inicio', path: '/inicio', icon: Home },
    { name: 'Mapa', path: '/mapa', icon: Map },
    { name: 'Recorrido', path: '/recorrido', icon: Footprints },
    { name: 'Progreso', path: '/progreso', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-20 md:pb-0 md:pt-16">
      <AnimatePresence>
        {blocker.state === 'blocked' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 mb-4 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-center text-white mb-2">
                ¿Abandonar el recorrido?
              </h2>
              <p className="text-center text-slate-400 text-sm mb-6">
                Tienes un recorrido activo y aún no has visitado todos los stands. Si sales, podrías perder tu progreso o interrumpir tu sesión.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/5"
                  onClick={() => blocker.reset?.()}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => blocker.proceed?.()}
                >
                  Salir
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header for Desktop */}
      <header className="hidden md:flex fixed top-0 w-full h-16 bg-slate-900/40 backdrop-blur-xl border-b border-white/10 z-50 items-center justify-between px-6">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xl uppercase tracking-tight">
          Feria de Ciencias
        </div>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 text-sm font-bold transition-colors",
                location.pathname === item.path ? "text-cyan-300" : "text-slate-400 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <EventTimerDisplay />
          <div className="text-xs font-bold bg-white/10 border border-white/10 text-cyan-300 px-3 py-1.5 rounded-xl uppercase tracking-wider">
            {session.name} {session.lastName[0]}. - {session.group}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto md:max-w-5xl p-4 md:p-8 space-y-4">
        {/* Mobile Timer Display */}
        <div className="md:hidden flex justify-between items-center bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 border border-white/10 mb-4">
          <div className="text-sm font-bold text-slate-300 uppercase tracking-widest">{session.group}</div>
          <EventTimerDisplay />
        </div>
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full h-16 bg-slate-950/90 backdrop-blur-md border-t border-white/10 flex justify-around items-center z-50 px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-full h-full text-[10px] font-bold uppercase tracking-wider"
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-x-2 inset-y-1 bg-white/10 rounded-lg z-0"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 mb-1 relative z-10", isActive ? "text-cyan-400" : "text-slate-500")} />
              <span className={cn("relative z-10", isActive ? "text-cyan-400" : "text-slate-500 mt-1")}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}
