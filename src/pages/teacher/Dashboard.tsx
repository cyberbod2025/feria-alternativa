import React, { useState } from 'react';
import { useFeria } from '../../store/FeriaContext';
import { Users, LayoutGrid, Timer, AlertTriangle, TrendingUp, Send, Trophy, Clock, SendHorizonal, Tent } from 'lucide-react';
import { 
  LuminousPanel, 
  StatusChip, 
  LuminousActionButton
} from '../../components/ui/luminous';
import { useNotifications } from '../../contexts/NotificationsContext';
import { Button } from '../../components/ui/button';

export default function Dashboard() {
  const { stands } = useFeria();
  const { sendNotification } = useNotifications();
  
  const [notifTarget, setNotifTarget] = useState<'all' | 'students' | 'teachers'>('all');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<'info' | 'warning' | 'success'>('info');
  
  const activeStands = stands.filter(s => s.status === 'active' || s.status === 'recommended' || s.status === 'saturated').length;
  const saturatedStands = stands.filter(s => s.status === 'saturated');
  const totalVisitorsEstimate = Math.floor(stands.reduce((acc, s) => acc + s.totalVisitors, 0) / 3);

  // Calculate ranking
  const groupScores = stands.reduce((acc, stand) => {
    acc[stand.group] = (acc[stand.group] || 0) + (stand.totalPoints || 0);
    return acc;
  }, {} as Record<string, number>);

   const ranking = Object.entries(groupScores)
     .map(([group, score]) => ({ group, score: score as number }))
     .filter((item) => item.score > 0)
     .sort((a, b) => b.score - a.score);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    
    sendNotification({
      target: notifTarget,
      title: notifTitle,
      message: notifMessage,
      type: notifType
    });
    
    setNotifTitle('');
    setNotifMessage('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-white/5 relative">
        <div className="absolute -bottom-[2px] left-0 w-24 h-[2px] bg-circus-red shadow-[0_0_10px_#FF4D4D]"></div>
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-circus-red animate-pulse"></div>
             <span className="text-[9px] font-black text-circus-red uppercase tracking-[0.4em]">Control de Pista en Vivo</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Panel del <span className="text-circus-yellow">Director</span> 🎩</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Monitoreo local del Circo Científico Escolar 2026</p>
        </div>
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">13:45 PM</span>
           </div>
        </div>
      </header>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Espectadores" 
          value={totalVisitorsEstimate} 
          trend="+12%" 
          icon={Users} 
          color="circus-blue" 
          label="En las carpas"
          source="local"
        />
        <MetricCard 
          title="Carpas Activas" 
          value={activeStands} 
          trend="Estable" 
          icon={Tent} 
          color="circus-cyan" 
          label={`De ${stands.length} totales`}
          source="local"
        />
        <MetricCard 
          title="Tiempo Promedio" 
          value="18m" 
          trend="Normal" 
          icon={Timer} 
          color="circus-lavender" 
          label="Por atracción"
          source="mock"
        />
        <MetricCard 
          title="Saturación" 
          value={saturatedStands.length} 
          trend={saturatedStands.length > 0 ? "Crítico" : "Baja"} 
          icon={AlertTriangle} 
          color="circus-red" 
          label="Puntos rojos"
          source="local"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Saturated Stands Alert */}
         <LuminousPanel className="flex flex-col bg-slate-900/40 backdrop-blur-3xl border-2 border-white/5 rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-white/5">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center text-white italic">
                 <AlertTriangle className="w-4 h-4 mr-3 text-circus-red" />
                 Alertas de <span className="text-circus-red ml-1">Capacidad</span>
               </h2>
            </div>
            <div className="flex-1 overflow-auto max-h-80">
               {saturatedStands.length > 0 ? (
                 <ul className="divide-y divide-white/5">
                    {saturatedStands.map(s => (
                       <li key={s.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                          <div>
                             <p className="font-black text-white uppercase tracking-tight italic group-hover:text-circus-red transition-colors">{s.name}</p>
                             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Pista {s.zone} • Grupo {s.group}</p>
                          </div>
                          <div className="px-4 py-1 bg-circus-red/10 border border-circus-red/30 rounded-full text-circus-red text-[9px] font-black uppercase tracking-widest">
                             {s.currentVisitors} Visitas
                          </div>
                       </li>
                    ))}
                 </ul>
               ) : (
                  <div className="p-12 text-center text-slate-600 font-black uppercase tracking-widest text-[10px] italic">
                     Sin congestión en la pista.
                  </div>
               )}
            </div>
         </LuminousPanel>

         {/* Zone Status */}
         <LuminousPanel className="bg-slate-900/40 backdrop-blur-3xl border-2 border-white/5 rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-white/5">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center text-white italic">
                  <LayoutGrid className="w-4 h-4 mr-3 text-circus-cyan" />
                  Estado por <span className="text-circus-cyan ml-1">Pistas</span>
               </h2>
            </div>
            <div className="p-8">
               <div className="space-y-6">
                  {['Norte', 'Centro', 'Sur', 'Este', 'Oeste'].map(zone => {
                    const zoneStands = stands.filter(s => s.zone === zone);
                    const isZoneSaturated = zoneStands.some(s => s.status === 'saturated');
                    const progress = Math.max(20, Math.random() * 80 + 20);
                    
                    return (
                      <div key={zone} className="space-y-3">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Pista {zone}</span>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${isZoneSaturated ? 'text-circus-red' : 'text-circus-cyan'}`}>
                               {isZoneSaturated ? 'Saturada' : 'Fluido'}
                            </span>
                         </div>
                         <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${isZoneSaturated ? 'bg-circus-red shadow-circus-red/20' : 'bg-circus-cyan shadow-circus-cyan/20'}`} 
                              style={{ width: `${progress}%` }} 
                            />
                         </div>
                      </div>
                    )
                  })}
               </div>
            </div>
         </LuminousPanel>

         {/* Ranking Card */}
         <LuminousPanel className="lg:col-span-2 bg-slate-900/40 backdrop-blur-3xl border-2 border-white/5 rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-circus-yellow/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
             <div className="p-6 border-b border-white/5 flex flex-row items-center justify-between relative z-10 gap-3">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center text-white italic">
                  <Trophy className="w-4 h-4 mr-3 text-circus-yellow" />
                  Escalafón de <span className="text-circus-yellow ml-1">Estrellas</span>
                </h2>
                <StatusChip status="info" label="Local" />
             </div>
            <div className="relative z-10">
               {ranking.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/5">
                    {ranking.slice(0, 6).map((r, index) => (
                       <div key={r.group} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                          <div className="flex items-center">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mr-4 border-2
                                ${index === 0 ? 'bg-circus-yellow/10 text-circus-yellow border-circus-yellow/30 rotate-[-4deg]' : 
                                  index === 1 ? 'bg-slate-400/10 text-slate-400 border-slate-400/30 rotate-[2deg]' : 
                                  'bg-white/5 text-slate-500 border-white/10'}`}>
                               {index + 1}
                             </div>
                             <div>
                                <p className="font-black text-white uppercase tracking-tight italic group-hover:text-circus-yellow transition-colors">Grupo {r.group}</p>
                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{r.score} pts</p>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
               ) : (
                  <div className="p-12 text-center text-slate-600 font-black uppercase tracking-widest text-[10px] italic">
                     Esperando registro de puntajes.
                  </div>
               )}
            </div>
         </LuminousPanel>

         {/* Notification Sender */}
         <LuminousPanel className="lg:col-span-2 bg-slate-950/60 backdrop-blur-3xl border-2 border-circus-lavender/20 rounded-[2rem] overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-circus-lavender/5">
               <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center text-white italic">
                 <SendHorizonal className="w-4 h-4 mr-3 text-circus-lavender" />
                 Megáfono del <span className="text-circus-lavender ml-1">Circo</span>
               </h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Notificaciones locales vía WebSockets (mock sin backend)</p>
            </div>
            <div className="p-8">
               <form onSubmit={handleSendNotification} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Audiencia</label>
                       <select 
                         className="w-full h-12 rounded-2xl border-2 border-white/5 bg-white/5 px-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-circus-lavender/50 transition-all appearance-none cursor-pointer"
                         value={notifTarget}
                         onChange={e => setNotifTarget(e.target.value as any)}
                       >
                          <option value="all" className="bg-slate-900">A Todo el Público</option>
                          <option value="students" className="bg-slate-900">Solo Espectadores</option>
                          <option value="teachers" className="bg-slate-900">Solo Equipo Técnico</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Naturaleza</label>
                       <select 
                         className="w-full h-12 rounded-2xl border-2 border-white/5 bg-white/5 px-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-circus-lavender/50 transition-all appearance-none cursor-pointer"
                         value={notifType}
                         onChange={e => setNotifType(e.target.value as any)}
                       >
                          <option value="info" className="bg-slate-900">Aviso General</option>
                          <option value="warning" className="bg-slate-900">Alerta Crítica</option>
                          <option value="success" className="bg-slate-900">Gran Noticia</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Título del Mensaje</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. ¡Nueva función en Zona Norte!"
                      className="w-full h-12 rounded-2xl border-2 border-white/5 bg-white/5 px-4 text-[11px] font-bold text-white focus:outline-none focus:border-circus-lavender/50 transition-all placeholder:text-slate-700"
                      value={notifTitle}
                      onChange={e => setNotifTitle(e.target.value)}
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic ml-1">Cuerpo del Comunicado</label>
                    <textarea 
                      required
                      placeholder="Escribe aquí las instrucciones para el público..."
                      className="w-full h-28 p-4 rounded-2xl border-2 border-white/5 bg-white/5 text-[11px] font-bold text-white focus:outline-none focus:border-circus-lavender/50 transition-all resize-none placeholder:text-slate-700"
                      value={notifMessage}
                      onChange={e => setNotifMessage(e.target.value)}
                    />
                 </div>
                 <LuminousActionButton type="submit" className="w-full h-14 bg-circus-lavender text-slate-950 font-black uppercase tracking-[0.2em] text-xs rounded-2xl border-b-4 border-black/30 hover:translate-y-px hover:border-b-2 transition-all">
                    Transmitir Comunicado
                 </LuminousActionButton>
               </form>
            </div>
         </LuminousPanel>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon, color, label, source }: any) {
  const colorClass = color === 'circus-red' ? 'text-circus-red' : 
                    color === 'circus-blue' ? 'text-circus-blue' : 
                    color === 'circus-yellow' ? 'text-circus-yellow' : 
                    color === 'circus-lavender' ? 'text-circus-lavender' : 'text-circus-cyan';
  
  const bgClass = color === 'circus-red' ? 'bg-circus-red/10 border-circus-red/20' : 
                 color === 'circus-blue' ? 'bg-circus-blue/10 border-circus-blue/20' : 
                 color === 'circus-yellow' ? 'bg-circus-yellow/10 border-circus-yellow/20' : 
                 color === 'circus-lavender' ? 'bg-circus-lavender/10 border-circus-lavender/20' : 'bg-circus-cyan/10 border-circus-cyan/20';

  const accentColor = color === 'circus-red' ? 'bg-circus-red' : 
                      color === 'circus-blue' ? 'bg-circus-blue' : 
                      color === 'circus-yellow' ? 'bg-circus-yellow' : 
                      color === 'circus-lavender' ? 'bg-circus-lavender' : 'bg-circus-cyan';

  const sourceChip = source === 'real'
    ? { status: 'success' as const, label: 'Real' }
    : source === 'mock'
      ? { status: 'neutral' as const, label: 'Mock' }
      : { status: 'info' as const, label: 'Local' };

  return (
    <Card className="bg-slate-900/60 backdrop-blur-3xl border-2 border-white/5 rounded-[2rem] shadow-2xl overflow-hidden hover:border-white/10 transition-all hover:translate-y-[-4px] group relative h-full">
       <div className={`absolute top-0 left-0 w-full h-1 opacity-20 ${accentColor}`}></div>
       <CardContent className="p-6">
           <div className="flex items-start justify-between mb-8 gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 ${bgClass}`}>
                 <Icon className={`w-6 h-6 ${colorClass}`} />
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                 <StatusChip status={sourceChip.status} label={sourceChip.label} />
                 <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${bgClass} ${colorClass}`}>
                    {trend}
                 </span>
             </div>
          </div>
          <div>
             <h3 className="text-slate-500 font-black uppercase tracking-[0.2em] text-[9px] mb-2 italic">{title}</h3>
             <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white tracking-tighter italic">{value}</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
             </div>
          </div>
       </CardContent>
    </Card>
  );
}

// Basic Card components in case they are not exported from ui/luminous
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`rounded-xl border border-white/10 ${className}`}>{children}</div>;
}
function CardHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
function CardTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h3 className={`font-bold ${className}`}>{children}</h3>;
}
function CardContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
}
