import React from 'react';
import { useFeria } from '../../store/FeriaContext';
import { useAuth } from '../../store/AuthContext';
import { Card, CardContent } from '../../components/ui/card';
import { Trophy, Clock, CheckCircle2, Award } from 'lucide-react';

export default function ProgressPage() {
  const { progress, stands, getVisitedStands } = useFeria();
  const { session } = useAuth();
  
  const visitedStands = getVisitedStands();
  
  const totalScore = progress.reduce((sum, p) => sum + (p.score || 0), 0);
  const possibleScore = visitedStands.filter(s => s.trivia && s.trivia.length > 0).length * 100;
  
  // Filter for those actually visited, not just arrived
  const completedProgress = progress.filter(p => p.visitedAt);

  return (
    <div className="space-y-6">
      <header className="text-center pb-6 border-b border-white/10">
        <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30 shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)]">
           <Trophy className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Tu Desempeño</h1>
        <p className="text-slate-400">{session?.name} {session?.lastName}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-white/10 shadow-xl bg-slate-900/60 backdrop-blur-xl">
          <CardContent className="p-5 flex flex-col items-center text-center">
             <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2" />
             <span className="text-3xl font-bold text-white">{completedProgress.length}</span>
             <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Stands</span>
          </CardContent>
        </Card>
        
        <Card className="border border-amber-500/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)] bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl text-amber-400 rounded-3xl">
          <CardContent className="p-5 flex flex-col items-center text-center">
             <Award className="w-6 h-6 text-amber-400 mb-2" />
             <span className="text-3xl font-bold text-white">{totalScore}</span>
             <span className="text-xs text-amber-200/70 uppercase font-bold tracking-wider">Puntos</span>
          </CardContent>
        </Card>
      </div>

      <div className="pt-6">
         <h3 className="font-bold text-white mb-6 flex items-center uppercase tracking-wider text-sm">
            <Clock className="w-5 h-5 mr-2 text-cyan-400" />
            Historial de Visitas
         </h3>
         
         <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/0 before:via-cyan-500/30 before:to-cyan-500/0">
            {completedProgress.length === 0 ? (
               <p className="text-center text-slate-500 py-8 relative z-10 font-medium">Aún no has completado ningún stand.</p>
            ) : (
               [...completedProgress].reverse().map((p, index) => {
                 const stand = stands.find(s => s.id === p.standId);
                 if (!stand || !p.visitedAt) return null;
                 
                 const date = new Date(p.visitedAt);
                 const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                 
                 return (
                   <div key={p.standId} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-2">
                     <div className="flex items-center justify-center w-10 h-10 rounded-full border border-cyan-400/30 bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_-3px_rgba(34,211,238,0.4)] backdrop-blur-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <CheckCircle2 className="w-5 h-5" />
                     </div>
                     <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl transition-all hover:bg-white/10">
                        <div className="flex items-center justify-between mb-1">
                           <h4 className="font-bold text-white text-sm">{stand.name}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 flex justify-between uppercase tracking-wider font-bold">
                           <span className="text-cyan-300">Zona {stand.zone}</span>
                           <span>{time}</span>
                        </p>
                        {p.score !== undefined && (
                           <div className="mt-3 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 inline-block px-2.5 py-1 rounded-xl uppercase tracking-wider">
                              +{p.score} pts
                           </div>
                        )}
                     </div>
                   </div>
                 )
               })
            )}
         </div>
      </div>
    </div>
  );
}

