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
  
  // Filter for those actually visited, not just arrived
  const completedProgress = progress.filter(p => p.visitedAt);

  return (
    <div className="space-y-6">
      <header className="text-center pb-8 border-b-2 border-dashed border-white/10 mx-4">
        <div className="w-24 h-24 bg-circus-yellow/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-circus-yellow/30 shadow-[0_0_40px_rgba(250,204,21,0.2)] rotate-[5deg]">
           <Trophy className="w-12 h-12 text-circus-yellow" />
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Tu <span className="text-circus-yellow">Desempeño</span></h1>
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2">{session?.name} {session?.lastName}</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-2 border-white/5 shadow-2xl bg-slate-900/60 backdrop-blur-3xl rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-circus-blue opacity-30"></div>
          <CardContent className="p-6 flex flex-col items-center text-center">
             <div className="w-10 h-10 rounded-full bg-circus-blue/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-circus-blue" />
             </div>
             <span className="text-4xl font-black text-white italic">{completedProgress.length}</span>
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Stands</span>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-circus-yellow/20 shadow-2xl bg-slate-900/60 backdrop-blur-3xl rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-circus-yellow opacity-30"></div>
          <CardContent className="p-6 flex flex-col items-center text-center">
             <div className="w-10 h-10 rounded-full bg-circus-yellow/10 flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-circus-yellow" />
             </div>
             <span className="text-4xl font-black text-white italic">{totalScore}</span>
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Puntos</span>
          </CardContent>
        </Card>
      </div>

      <div className="pt-8">
         <h3 className="font-black text-white mb-8 flex items-center uppercase tracking-widest text-[11px] italic">
            <Clock className="w-4 h-4 mr-3 text-circus-cyan" />
            Bitácora de la Pista
         </h3>
         
         <div className="space-y-6 relative ml-4 border-l-2 border-dashed border-white/10 pl-8 pb-8">
            {completedProgress.length === 0 ? (
               <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-12 h-12 bg-white/5 rounded-full mb-4"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Aún no has registrado visitas</p>
               </div>
            ) : (
               [...completedProgress].reverse().map((p, index) => {
                 const stand = stands.find(s => s.id === p.standId);
                 if (!stand || !p.visitedAt) return null;
                 
                 const date = new Date(p.visitedAt);
                 const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                 
                 return (
                   <div key={p.standId} className="relative group">
                     {/* Marker */}
                     <div className="absolute -left-[41px] top-4 w-4 h-4 rounded-full bg-circus-night border-2 border-circus-cyan shadow-[0_0_10px_rgba(103,232,249,0.5)] z-10 group-hover:scale-125 transition-transform"></div>
                     
                     <div className="p-5 rounded-2xl border-2 border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-xl transition-all group-hover:border-circus-cyan/30 group-hover:bg-slate-900/60 relative overflow-hidden">
                        {index === 0 && (
                          <div className="absolute top-0 right-0 px-3 py-1 bg-circus-cyan/10 text-circus-cyan text-[8px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-circus-cyan/20">
                             Último
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="font-black text-white text-base uppercase tracking-tight italic group-hover:text-circus-cyan transition-colors">{stand.name}</h4>
                        </div>
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                           <div className="flex items-center gap-2">
                              <span className="text-slate-500">Pista</span>
                              <span className="text-circus-blue">{stand.zone}</span>
                           </div>
                           <span className="text-slate-600">{time}</span>
                        </div>
                        {p.score !== undefined && (
                           <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Recompensa</span>
                              <span className="text-xs font-black text-circus-yellow italic">+{p.score} pts</span>
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

