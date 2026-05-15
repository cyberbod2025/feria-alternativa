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
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const studentRanking = totalStudentScore > 0
    ? [{ name: `${session?.name || 'Yo'} ${session?.lastName?.[0] || '.'}.`, score: totalStudentScore, isCurrent: true }]
    : [];

  const top3Students = studentRanking.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">¡Hola, <span className="text-circus-yellow">{session?.name}</span>! 🎪</h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Tu jornada en el Circo Científico Escolar 2026</p>
        </div>
        <div className="px-4 py-2 bg-circus-red/10 border-2 border-circus-red/30 rounded-2xl flex items-center gap-3">
           <Trophy className="w-5 h-5 text-circus-red" />
           <div className="text-right">
              <p className="text-[9px] font-black text-circus-red uppercase tracking-widest leading-none">Tu Puntaje</p>
              <p className="text-xl font-black text-white leading-none mt-1">{totalStudentScore} <span className="text-[10px] font-bold text-slate-500">pts</span></p>
           </div>
        </div>
      </header>

      {/* Progress Overview */}
      <Card className="bg-slate-900/40 backdrop-blur-3xl border-2 border-white/5 text-white shadow-2xl relative overflow-hidden rounded-3xl ticket-cut">
        {/* Ticket notches */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-circus-night border-r-2 border-white/10 rounded-full z-20"></div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-circus-night border-l-2 border-white/10 rounded-full z-20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-circus-red via-circus-yellow to-circus-blue opacity-30"></div>
        <CardContent className="p-8 px-12">
          <div className="flex justify-between items-end mb-6">
            <div>
               <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[9px] mb-2">Pasaporte del Circo</p>
              <h2 className="text-5xl font-black text-white tracking-tighter italic">{progress.length} <span className="text-lg font-bold text-slate-500 not-italic uppercase tracking-widest">/ {stands.length} stands</span></h2>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-circus-cyan italic">{progressPercentage}%</span>
            </div>
          </div>
          
          <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden p-1 border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-circus-blue via-circus-cyan to-circus-yellow h-full rounded-full shadow-[0_0_15px_rgba(103,232,249,0.5)]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Ranking Spotlight */}
      <Card className="bg-slate-900/60 backdrop-blur-3xl border-2 border-circus-yellow/20 overflow-hidden relative shadow-2xl rounded-3xl">
         <CardHeader className="pb-0 border-b border-white/5 relative z-10 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <CardTitle className="text-lg font-black text-white uppercase tracking-widest flex items-center italic">
                <Trophy className="w-6 h-6 mr-3 text-circus-yellow" />
                Líderes de la <span className="text-circus-yellow ml-2">Pista</span>
              </CardTitle>
              <div className="flex bg-white/5 p-1 rounded-2xl w-full sm:w-auto border border-white/5">
                 <button 
                   onClick={() => setActiveLeaderboard('groups')}
                   className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2 transition-all ${activeLeaderboard === 'groups' ? 'bg-circus-yellow text-slate-950' : 'text-slate-500 hover:text-white'}`}
                 >
                   <Users className="w-4 h-4" /> Grupos
                 </button>
                 <button 
                   onClick={() => setActiveLeaderboard('students')}
                   className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex justify-center items-center gap-2 transition-all ${activeLeaderboard === 'students' ? 'bg-circus-blue text-white' : 'text-slate-500 hover:text-white'}`}
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
                          <li key={r.group} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors relative group">
                             <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shrink-0 border-2
                                   ${index === 0 ? 'bg-circus-yellow border-white/20 text-slate-950 rotate-[-4deg]' 
                                   : index === 1 ? 'bg-slate-200 border-white/20 text-slate-950 rotate-[2deg]' 
                                   : 'bg-orange-400 border-white/20 text-slate-950 rotate-[-2deg]'} 
                                `}>
                                  {index + 1}
                                </div>
                                <div>
                                  <span className="font-black text-white text-xl tracking-tight flex flex-wrap items-center uppercase italic">
                                    Grupo {r.group}
                                    {index === 0 && session?.group === r.group && <span className="ml-3 text-[9px] font-black text-circus-yellow uppercase tracking-[0.2em] bg-circus-yellow/10 px-3 py-1 rounded-full border border-circus-yellow/30 not-italic">Tu Grupo</span>}
                                  </span>
                                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">
                                     Puntos de Investigación
                                  </p>
                                </div>
                             </div>
                             <div className="text-right shrink-0">
                                <span className="text-3xl font-black text-circus-cyan italic">{r.score}</span>
                                <span className="text-[10px] text-circus-cyan/50 font-black ml-1 uppercase tracking-widest">Pts</span>
                             </div>
                          </li>
                       ))}
                    </ul>
                  ) : (
                     <div className="p-12 text-center text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
                        Esperando los primeros resultados...
                     </div>
                  )
                ) : (
                  top3Students.length > 0 ? (
                    <ul className="divide-y divide-white/5">
                       {top3Students.map((s, index) => (
                          <li key={s.name + index} className={`p-6 flex items-center justify-between hover:bg-white/5 transition-colors ${(s as any).isCurrent ? 'bg-circus-blue/5' : ''}`}>
                             <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shrink-0 border-2
                                   ${index === 0 ? 'bg-circus-blue border-white/20 text-white rotate-[-4deg]' 
                                   : index === 1 ? 'bg-slate-200 border-white/20 text-slate-950 rotate-[2deg]' 
                                   : 'bg-circus-cyan border-white/20 text-slate-950 rotate-[-2deg]'} 
                                `}>
                                  {index + 1}
                                </div>
                                <div>
                                  <span className="font-black text-white text-xl tracking-tight flex flex-wrap items-center uppercase italic">
                                    {s.name}
                                    {(s as any).isCurrent && <span className="ml-3 text-[9px] font-black text-circus-blue uppercase tracking-[0.2em] bg-circus-blue/10 px-3 py-1 rounded-full border border-circus-blue/30 not-italic">Tú</span>}
                                  </span>
                                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">
                                     Puntaje Individual
                                  </p>
                                </div>
                             </div>
                             <div className="text-right shrink-0">
                                <span className="text-3xl font-black text-circus-yellow italic">{s.score}</span>
                                <span className="text-[10px] text-circus-yellow/50 font-black ml-1 uppercase tracking-widest">Pts</span>
                             </div>
                          </li>
                       ))}
                    </ul>
                  ) : (
                     <div className="p-12 text-center text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
                        Preparando el ranking individual...
                     </div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
         </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Next Suggested Stand */}
        <Card className="bg-slate-900/40 backdrop-blur-3xl border-2 border-white/5 rounded-3xl hover:border-circus-yellow/30 transition-all group">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-circus-yellow/10 text-circus-yellow border-2 border-circus-yellow/30 flex items-center justify-center">
                <Footprints className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-white uppercase tracking-widest text-[10px]">Próxima Atracción</h3>
                <p className="text-slate-500 font-bold text-[9px] uppercase tracking-widest mt-0.5 italic">Recomendado para ti</p>
              </div>
            </div>
            
            {suggested ? (
               <div className="space-y-6">
                 <div>
                   <h4 className="font-black text-2xl text-white uppercase tracking-tight italic group-hover:text-circus-yellow transition-colors">{suggested.name}</h4>
                   <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-circus-blue/20 text-circus-blue text-[9px] font-black uppercase tracking-widest rounded-md border border-circus-blue/30">Pista {suggested.zone}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Grupo {suggested.group}</span>
                   </div>
                 </div>
                 <Button asChild className="w-full h-14 bg-circus-red text-white font-black hover:bg-circus-red/90 border-b-4 border-black/30 text-sm rounded-2xl uppercase tracking-[0.2em] shadow-xl">
                    <Link to={`/stand/${suggested.id}`}>
                      Entrar ahora <Play className="w-4 h-4 ml-2 fill-current" />
                    </Link>
                 </Button>
               </div>
            ) : (
               <div className="text-center py-8">
                  <p className="text-circus-cyan font-black uppercase tracking-widest text-xs italic">¡Has conquistado todas las carpas!</p>
               </div>
            )}
          </CardContent>
        </Card>

        {/* Explore Map */}
        <Card className="bg-white/5 border-2 border-dashed border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all rounded-3xl group">
           <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                <Map className="w-8 h-8 text-slate-400 group-hover:text-circus-blue transition-colors" />
              </div>
               <h3 className="font-black text-white mb-2 uppercase tracking-tighter text-xl italic">Explora el <span className="text-circus-blue">Circo</span></h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8 max-w-[200px]">Consulta el plano completo y elige tu propio camino.</p>
              <Button variant="outline" asChild className="w-full h-12 border-2 border-white/10 text-white hover:bg-white/5 hover:border-white/20 rounded-2xl uppercase font-black tracking-widest text-[10px]">
                 <Link to="/mapa">Abrir Plano de Carpas</Link>
              </Button>
           </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-950/40 backdrop-blur-3xl border-2 border-circus-lavender/10 rounded-3xl hover:border-circus-lavender/30 transition-all group overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-circus-lavender/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
         <CardContent className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="text-center sm:text-left">
               <h3 className="font-black text-white uppercase tracking-tight text-lg italic">¿Qué te ha parecido la <span className="text-circus-lavender">Función</span>?</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Tus comentarios nos ayudan a mejorar el espectáculo.</p>
            </div>
            <Button asChild variant="outline" className="shrink-0 h-12 px-8 border-2 border-circus-lavender/30 text-circus-lavender hover:bg-circus-lavender/10 hover:border-circus-lavender/50 rounded-2xl uppercase font-black tracking-widest text-[10px]">
               <Link to="/feedback">Dejar Feedback</Link>
            </Button>
         </CardContent>
      </Card>
    </div>
  );
}
