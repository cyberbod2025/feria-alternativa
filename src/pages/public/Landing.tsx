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
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-900/10 to-transparent"></div>
      <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="relative z-10 max-w-4xl w-full px-6 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-20 h-20 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-8 border border-cyan-400/30 backdrop-blur-sm shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]"
        >
          <Microscope className="w-10 h-10 text-cyan-400" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 mb-6 uppercase tracking-tight"
        >
          Feria de Ciencias 2026
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-indigo-100/80 mb-12 max-w-2xl font-medium"
        >
          Descubre, explora y aprende. Experimenta la magia de la ciencia a través de más de 20 stands interactivos diseñados por nuestros alumnos.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md space-y-4"
        >
          <Button asChild size="lg" className="w-full bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 border-0 py-6 text-lg rounded-xl shadow-[0_0_40px_-5px_rgba(34,211,238,0.5)]">
            <Link to="/login">
              Comenzar recorrido
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          <div className="pt-8 border-t border-white/10 flex flex-col items-center">
            <p className="text-sm font-bold text-slate-400 mb-4 flex items-center uppercase tracking-wider">
              <Lock className="w-4 h-4 mr-2" />
              Acceso Docente
            </p>
            <p className="text-xs font-medium text-slate-500 text-center">
              El panel docente solo está disponible accediendo a través del portal institucional SASE-310.
            </p>
          </div>
        </motion.div>
        
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl opacity-60">
           <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">28</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Stands</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">4</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Zonas</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">18m</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Promedio</span>
           </div>
           <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">500+</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">Visitantes</span>
           </div>
        </div>
      </div>
    </div>
  );
}
