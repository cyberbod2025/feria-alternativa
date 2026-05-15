import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Button } from '../../components/ui/button';
import { ArrowRight, Microscope, Compass, Map as MapIcon, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const { session } = useAuth();

  if (session?.role === 'student') {
    return <Navigate to="/inicio" replace />;
  }
  if (session?.role && ['teacher', 'admin', 'staff'].includes(session.role)) {
    return <Navigate to="/docente" replace />;
  }

  return (
    <div className="min-h-screen bg-circus-night flex flex-col items-center justify-center relative overflow-hidden">
      {/* Circus Tent Peak SVG */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0 opacity-40">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[120px] fill-circus-red">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,38.26,55.49,16.77,114.2,21.14,172.1,14.22,90.73-10.85,153.13-54.41,244.9-54.41,86.26,0,131.5,14,200,43.43V0Z"></path>
        </svg>
      </div>

      {/* Circus Tent Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-circus-red/20 via-circus-night to-circus-night"></div>
      
      {/* Decorative Lights / Garlands */}
      <div className="absolute top-10 left-0 w-full h-24 flex justify-around opacity-40 pointer-events-none z-10">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-[1px] h-8 bg-white/20"></div>
            <div className={`w-3 h-3 rounded-full blur-[2px] animate-pulse shadow-[0_0_10px_white] ${i % 3 === 0 ? 'bg-circus-red shadow-circus-red' : i % 3 === 1 ? 'bg-circus-yellow shadow-circus-yellow' : 'bg-circus-cyan shadow-circus-cyan'}`} style={{ animationDelay: `${i * 0.3}s` }}></div>
          </div>
        ))}
      </div>


      <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          className="w-24 h-24 bg-circus-red/20 rounded-3xl flex items-center justify-center mb-8 border-2 border-circus-yellow/40 backdrop-blur-sm shadow-[0_0_50px_-5px_rgba(239,68,68,0.4)] relative"
        >
          <Microscope className="w-12 h-12 text-circus-yellow" />
          {/* Sparkles */}
          <div className="absolute -top-2 -right-2 w-6 h-6 text-circus-yellow animate-bounce">✨</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-circus-yellow font-black uppercase tracking-[0.3em] text-sm opacity-80">Bienvenidos al</div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-circus-yellow via-white to-circus-yellow mb-6 uppercase tracking-tighter italic">
            Circo <span className="text-circus-red">Científico Escolar</span>
            </h1>
          <div className="absolute -bottom-4 right-0 text-circus-cyan font-bold italic text-2xl rotate-[-5deg]">Edición 2026</div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-circus-ticket/80 mb-12 max-w-2xl font-medium mt-8"
        >
          ¡Pasen y vean los asombrosos descubrimientos de la ciencia! <br className="hidden md:block" />
          Experimenta la magia de la investigación en nuestras carpas temáticas.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md space-y-6"
        >
          <Button asChild size="lg" className="w-full bg-circus-red text-white font-black hover:bg-circus-red/90 border-b-4 border-black/30 py-8 text-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(239,68,68,0.6)] transform active:translate-y-1 transition-all uppercase tracking-widest">
            <Link to="/login">
              Obtener Boleto
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
          </Button>

          <div className="pt-8 border-t border-white/5 flex flex-col items-center">
            <div className="px-4 py-2 bg-circus-night/60 border border-circus-lavender/30 rounded-full mb-4 flex items-center gap-2 shadow-inner">
               <Lock className="w-3 h-3 text-circus-lavender" />
               <span className="text-[10px] font-black text-circus-lavender uppercase tracking-[0.2em]">Acceso Docente Vía SASE</span>
            </div>
            <p className="text-[10px] font-medium text-slate-500 text-center uppercase tracking-wider max-w-[280px]">
              El panel de coordinación institucional requiere autenticación segura de red.
            </p>
          </div>
        </motion.div>
        
        {/* Ticket-style Badges */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
           {[
             { label: 'Stands', value: '28', color: 'border-circus-red' },
             { label: 'Zonas', value: '4', color: 'border-circus-blue' },
             { label: 'Minutos', value: '18', color: 'border-circus-yellow' },
             { label: 'Visitantes', value: '500+', color: 'border-circus-cyan' }
           ].map((badge, idx) => (
             <div key={idx} className={`bg-circus-night border-2 ${badge.color} rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform cursor-default`}>
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-circus-night border-r-2 border-inherit rounded-full"></div>
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-circus-night border-l-2 border-inherit rounded-full"></div>
                <span className="text-3xl font-black text-white mb-1">{badge.value}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{badge.label}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
