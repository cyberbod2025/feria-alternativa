import React, { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { useFeria } from '../../store/FeriaContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Map, Footprints, Play, Trophy, Users, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentHome() {
  const { session } = useAuth();
  const { stands, progress, getSuggestedStand, totalStudentScore } = useFeria();
  const [activeLeaderboard, setActiveLeaderboard] = useState<'groups' | 'students'>('groups');

  const suggested = getSuggestedStand();
  const progressPercentage = Math.round((progress.length / stands.length) * 100);

  // Calculate ranking points for groups
  const groupScores = stands.reduce((acc, stand) => {
    acc[stand.group] = (acc[stand.group] || 0) + (stand.totalPoints || 0);
    return acc;
  }, {} as Record<string, number>);

  const groupRanking = Object.entries(groupScores)
    .map(([group, score]) => ({ group, score: score as number }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Mock student ranking + real current student
  const mockStudents = [
    { name: 'Ana García', score: 3450 },
    { name: 'Luis Martínez', score: 3200 },
    { name: 'Sofía López', score: 3150 },
  ];
  
  const studentRanking = [...mockStudents];
  
  if (totalStudentScore > 0) {
     const currentStudentLeaderboard = { name: `${session?.name || 'Yo'} ${session?.lastName?.[0] || '.'}.`, score: totalStudentScore, isCurrent: true };
     studentRanking.push(currentStudentLeaderboard);
     studentRanking.sort((a, b) => b.score - a.score);
  }

  const top3Students = studentRanking.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">¡Hola, {session?.name}! 👋</h1>
        <p className="text-cyan-200/70 mt-2">Bienvenido a la Feria de Ciencias 2026. Prepárate para descubrir cosas increíbles.</p>
      </header>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 text-white shadow-xl shadow-indigo-500/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-indigo-200 font-bold uppercase tracking-wider text-xs mb-2">Tu avance</p>
              <h2 className="text-4xl font-bold text-white">{progress.length} <span className="text-lg font-normal text-slate-300">/ {stands.length} stands</span></h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-cyan-400">{progressPercentage}%</span>
            </div>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ranking Spotlight */}
      <Card className="bg-gradient-to-br from-slate-900/80 via-amber-950/20 to-slate-900/80 backdrop-blur-xl border border-amber-500/30 overflow-hidden relative shadow-[0_0_40px_rgba(245,158,11,0.15)]">
         <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
           <Trophy className="w-32 h-32 text-amber-500" />
         </div>
         <CardHeader className="pb-0 border-b border-white/5 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <CardTitle className="text-xl font-black text-white uppercase tracking-widest flex items-center">
                <Trophy className="w-6 h-6 mr-3 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] bg-amber-500/20 rounded-full p-1" />
                Líderes de la Feria
              </CardTitle>
              <div className="flex bg-white/5 p-1 rounded-xl w-full sm:w-auto">
                 <button 
                   onClick={() => setActiveLeaderboard('groups')}
                   className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-all ${activeLeaderboard === 'groups' ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'text-slate-400 hover:text-white'}`}
                 >
                   <Users className="w-4 h-4" /> Grupos
                 </button>
                 <button 
                   onClick={() => setActiveLeaderboard('students')}
                   className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-all ${activeLeaderboard === 'students' ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-slate-400 hover:text-white'}`}
                 >
                   <User className="w-4 h-4" /> Alumnos
                 </button>
              </div>
            </div>
         </CardHeader>
         <CardContent className="p-0 relative z-10 min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLeaderboard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeLeaderboard === 'groups' ? (
                  groupRanking.length > 0 ? (
                    <ul className="divide-y divide-white/5">
                       {groupRanking.map((r, index) => (
                          <li key={r.group} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                             <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shrink-0
                                   ${index === 0 ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-[#050816] shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-110' 
                                   : index === 1 ? 'bg-gradient-to-tr from-slate-400 to-slate-200 text-[#050816]' 
                                   : 'bg-gradient-to-tr from-amber-700 to-orange-400 text-[#050816]'} 
                                `}>
                                  {index + 1}
                                </div>
                                <div>
                                  <span className="font-bold text-white text-base sm:text-lg tracking-wide flex flex-wrap items-center">
                                    Grupo {r.group}
                                    {index === 0 && session?.group === r.group && <span className="ml-2 text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-1 rounded-full border border-amber-400/20">Tu Grupo</span>}
                                  </span>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                     Puntos Registrados
                                  </p>
                                </div>
                             </div>
                             <div className="text-right shrink-0">
                                <span className="text-xl sm:text-2xl font-black text-[#22D3EE] drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">{r.score}</span>
                                <span className="text-xs text-[#22D3EE]/70 font-bold ml-1">Pts</span>
                             </div>
                          </li>
                       ))}
                    </ul>
                  ) : (
                     <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                        Aún no hay puntos registrados en grupos.
                     </div>
                  )
                ) : (
                  top3Students.length > 0 ? (
                    <ul className="divide-y divide-white/5">
                       {top3Students.map((s, index) => (
                          <li key={s.name + index} className={`p-5 flex items-center justify-between hover:bg-white/5 transition-colors ${(s as any).isCurrent ? 'bg-cyan-500/5' : ''}`}>
                             <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shrink-0
                                   ${index === 0 ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-[#050816] shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110' 
                                   : index === 1 ? 'bg-gradient-to-tr from-slate-400 to-slate-200 text-[#050816]' 
                                   : 'bg-gradient-to-tr from-cyan-900 to-blue-900 text-white'} 
                                `}>
                                  {index + 1}
                                </div>
                                <div>
                                  <span className="font-bold text-white text-base sm:text-lg tracking-wide flex flex-wrap items-center">
                                    {s.name}
                                    {(s as any).isCurrent && <span className="ml-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-2 py-1 rounded-full border border-cyan-400/20">Tú</span>}
                                  </span>
                                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                     Puntaje Individual
                                  </p>
                                </div>
                             </div>
                             <div className="text-right shrink-0">
                                <span className="text-xl sm:text-2xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">{s.score}</span>
                                <span className="text-xs text-amber-400/70 font-bold ml-1">Pts</span>
                             </div>
                          </li>
                       ))}
                    </ul>
                  ) : (
                     <div className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                        Aún no hay puntos registrados en estudiantes.
                     </div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
         </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Suggested Stand */}
        <Card className="border-white/10 bg-slate-900/40 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Footprints className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white uppercase tracking-tight text-sm">Siguiente sugerido</h3>
            </div>
            
            {suggested ? (
               <div className="space-y-4">
                 <div>
                   <h4 className="font-bold text-lg text-white">{suggested.name}</h4>
                   <p className="text-sm font-medium text-cyan-400">Zona {suggested.zone}</p>
                 </div>
                 <Button asChild className="w-full font-bold uppercase tracking-wider h-12 bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                    <Link to={`/stand/${suggested.id}`}>
                      Ir al stand <Play className="w-4 h-4 ml-2 fill-current" />
                    </Link>
                 </Button>
               </div>
            ) : (
               <div className="text-center py-4">
                  <p className="text-slate-400 font-bold">¡Has completado todos los stands!</p>
               </div>
            )}
          </CardContent>
        </Card>

        {/* Explore Map */}
        <Card className="border-white/10 bg-white/5 border-dashed backdrop-blur-sm hover:bg-white/10 transition-colors">
           <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <Map className="w-12 h-12 text-slate-400 mb-3" />
              <h3 className="font-bold text-white mb-2 uppercase tracking-wide">Explora libremente</h3>
              <p className="text-sm text-slate-400 mb-4">Revisa el mapa completo y elige qué quieres visitar a continuación.</p>
              <Button variant="outline" asChild className="w-full text-slate-300 border-white/20 hover:bg-white/10 hover:text-white uppercase font-bold tracking-wider">
                 <Link to="/mapa">Ver mapa</Link>
              </Button>
           </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-slate-900/40 backdrop-blur-xl hover:border-cyan-500/50 transition-colors">
         <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
               <h3 className="font-bold text-white uppercase tracking-tight">¿Terminaste el recorrido?</h3>
               <p className="text-sm text-slate-400 mt-1">Déjanos tus comentarios y sugerencias sobre la feria.</p>
            </div>
            <Button asChild variant="outline" className="shrink-0 border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/10">
               <Link to="/feedback">Dejar Feedback</Link>
            </Button>
         </CardContent>
      </Card>
    </div>
  );
}