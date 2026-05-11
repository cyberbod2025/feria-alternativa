import React, { useState } from 'react';
import { useFeria } from '../../store/FeriaContext';
import { Users, LayoutGrid, Timer, AlertTriangle, TrendingUp, Send, Trophy } from 'lucide-react';
import { 
  LuminousPanel, 
  StatusChip, 
  LuminousActionButton
} from '../../components/ui/luminous';
import { useNotifications } from '../../contexts/NotificationsContext';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-black text-luminous-text-primary uppercase tracking-widest">Dashboard de Coordinación</h1>
        <p className="text-luminous-text-secondary">Métricas en tiempo real de la Feria de Ciencias.</p>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LuminousPanel className="border-l-4 border-l-luminous-blue/80 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-luminous-text-secondary uppercase tracking-wider mb-1">Visitantes Activos</p>
                <h3 className="text-4xl font-heading font-bold text-luminous-text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">{totalVisitorsEstimate}</h3>
             </div>
             <div className="w-12 h-12 bg-luminous-blue/20 rounded-2xl flex items-center justify-center text-luminous-blue shadow-sm pb-0.5">
                <Users className="w-6 h-6" />
             </div>
          </div>
          <p className="text-xs text-luminous-success font-bold flex items-center mt-4 tracking-wider uppercase">
             <TrendingUp className="w-3 h-3 mr-1" /> +12% esta hora
          </p>
        </LuminousPanel>

        <LuminousPanel className="border-l-4 border-l-luminous-cyan/80 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-luminous-text-secondary uppercase tracking-wider mb-1">Stands Activos</p>
                <h3 className="text-4xl font-heading font-bold text-luminous-text-primary drop-shadow-[0_0_15px_rgba(103,232,249,0.3)]">{activeStands} <span className="text-xl text-luminous-text-secondary font-normal">/ {stands.length}</span></h3>
             </div>
             <div className="w-12 h-12 bg-luminous-cyan/20 rounded-2xl flex items-center justify-center text-luminous-cyan shadow-sm pb-0.5">
                <LayoutGrid className="w-6 h-6" />
             </div>
          </div>
        </LuminousPanel>

        <LuminousPanel className="border-l-4 border-l-luminous-lavender/80 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-luminous-text-secondary uppercase tracking-wider mb-1">Tiempo Promedio</p>
                <h3 className="text-4xl font-heading font-bold text-luminous-text-primary drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]">18m</h3>
             </div>
             <div className="w-12 h-12 bg-luminous-lavender/20 rounded-2xl flex items-center justify-center text-luminous-lavender shadow-sm pb-0.5">
                <Timer className="w-6 h-6" />
             </div>
          </div>
        </LuminousPanel>

        <LuminousPanel className="border-l-4 border-l-luminous-warning/80 p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div>
                <p className="text-sm font-medium text-luminous-text-secondary uppercase tracking-wider mb-1">Zonas de Riesgo</p>
                <h3 className="text-4xl font-heading font-bold text-luminous-text-primary drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">{saturatedStands.length}</h3>
             </div>
             <div className="w-12 h-12 bg-luminous-warning/20 rounded-2xl flex items-center justify-center text-luminous-warning shadow-sm pb-0.5">
                <AlertTriangle className="w-6 h-6" />
             </div>
          </div>
          {saturatedStands.length > 0 && (
            <p className="text-xs text-luminous-warning font-bold mt-4 uppercase tracking-wider">Requiere redistribución</p>
          )}
        </LuminousPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Saturated Stands Alert */}
         <LuminousPanel className="flex flex-col">
            <div className="p-4 border-b border-luminous-lavender/20">
               <h2 className="text-lg font-semibold flex items-center text-luminous-text-primary">
                 <AlertTriangle className="w-5 h-5 mr-2 text-luminous-warning" />
                 Stands Saturados
               </h2>
            </div>
            <div className="flex-1 overflow-auto">
               {saturatedStands.length > 0 ? (
                 <ul className="divide-y divide-luminous-lavender/10">
                    {saturatedStands.map(s => (
                       <li key={s.id} className="p-4 flex items-center justify-between hover:bg-luminous-lavender/5 transition-colors">
                          <div>
                             <p className="font-semibold text-luminous-text-primary">{s.name}</p>
                             <p className="text-xs text-luminous-text-secondary">Zona {s.zone} • Grupo {s.group}</p>
                          </div>
                          <StatusChip status="danger" label={`${s.currentVisitors} visitas actuales`} />
                       </li>
                    ))}
                 </ul>
               ) : (
                  <div className="p-8 text-center text-luminous-text-secondary h-full flex items-center justify-center">
                     No hay stands con saturación actual.
                  </div>
               )}
            </div>
         </LuminousPanel>

         {/* Zone Heatmap (simplified) */}
         <LuminousPanel>
            <div className="p-4 border-b border-luminous-lavender/20">
               <h2 className="text-lg font-semibold text-luminous-text-primary">Calor por Zonas</h2>
            </div>
            <div className="p-5">
               <div className="space-y-5">
                  {['Norte', 'Centro', 'Sur', 'Este', 'Oeste'].map(zone => {
                    const zoneStands = stands.filter(s => s.zone === zone);
                    const isZoneSaturated = zoneStands.some(s => s.status === 'saturated');
                    
                    return (
                      <div key={zone} className="flex items-center justify-between">
                         <span className="font-medium text-luminous-text-primary w-20">Zona {zone}</span>
                         <div className="flex-1 mx-4 h-2.5 bg-luminous-bg rounded-full overflow-hidden border border-luminous-lavender/20">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ease-out ${isZoneSaturated ? 'bg-luminous-danger' : 'bg-luminous-cyan'}`} 
                              style={{ width: `${Math.max(20, Math.random() * 80 + 20)}%` }} 
                            />
                         </div>
                         <div className="w-20 text-right">
                           <StatusChip status={isZoneSaturated ? 'danger' : 'success'} label={isZoneSaturated ? 'Alta' : 'Normal'} />
                         </div>
                      </div>
                    )
                  })}
               </div>
            </div>
         </LuminousPanel>

         {/* Ranking Card */}
         <LuminousPanel className="lg:col-span-2">
            <div className="p-4 border-b border-luminous-lavender/20">
               <h2 className="text-lg font-semibold flex items-center text-luminous-text-primary">
                 <Trophy className="w-5 h-5 mr-2 text-luminous-warning" />
                 Ranking de Grupos
               </h2>
               <p className="text-sm text-luminous-text-secondary mt-1">
                 Puntaje acumulado por cada grupo basado en visitas y trivias correctas de los asistentes.
               </p>
            </div>
            <div>
               {ranking.length > 0 ? (
                 <ul className="divide-y divide-luminous-lavender/10 max-h-64 overflow-y-auto">
                    {ranking.map((r, index) => (
                       <li key={r.group} className="p-4 flex items-center justify-between hover:bg-luminous-lavender/5 transition-colors">
                          <div className="flex items-center">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${index === 0 ? 'bg-luminous-warning/20 text-luminous-warning border border-luminous-warning/50' : index === 1 ? 'bg-luminous-text-secondary/20 text-luminous-text-secondary border border-luminous-text-secondary/50' : index === 2 ? 'bg-orange-600/20 text-orange-500 border border-orange-600/50' : 'bg-luminous-bg text-luminous-text-secondary border border-luminous-lavender/20'}`}>
                               {index + 1}
                             </div>
                             <span className="font-semibold text-luminous-text-primary">Grupo {r.group}</span>
                          </div>
                          <StatusChip status="info" label={`${r.score} pts`} />
                       </li>
                    ))}
                 </ul>
               ) : (
                  <div className="p-8 text-center text-luminous-text-secondary">
                     Aún no hay puntos registrados.
                  </div>
               )}
            </div>
         </LuminousPanel>

         {/* Notification Sender */}
         <LuminousPanel className="lg:col-span-2">
            <div className="p-4 border-b border-luminous-lavender/20">
               <h2 className="text-lg font-semibold text-luminous-text-primary flex items-center">
                 <Send className="w-5 h-5 mr-2 text-luminous-text-secondary" />
                 Emisión de Avisos en Vivo (WebSockets)
               </h2>
               <p className="text-sm text-luminous-text-secondary mt-1">
                 Envía notificaciones en tiempo real a los dispositivos de los asistentes o docentes.
               </p>
            </div>
            <div className="p-6">
               <form onSubmit={handleSendNotification} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-luminous-text-secondary uppercase tracking-wider">Destinatarios</label>
                       <select 
                         className="w-full h-11 rounded-lg border border-luminous-lavender/30 bg-luminous-bg/50 px-3 text-sm text-luminous-text-primary focus:outline-none focus:ring-1 focus:ring-luminous-cyan transition-all appearance-none"
                         value={notifTarget}
                         onChange={e => setNotifTarget(e.target.value as any)}
                       >
                          <option value="all" className="bg-luminous-bg">Todos</option>
                          <option value="students" className="bg-luminous-bg">Estudiantes / Visitantes</option>
                          <option value="teachers" className="bg-luminous-bg">Docentes / Organizadores</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-luminous-text-secondary uppercase tracking-wider">Tipo de Aviso</label>
                       <select 
                         className="w-full h-11 rounded-lg border border-luminous-lavender/30 bg-luminous-bg/50 px-3 text-sm text-luminous-text-primary focus:outline-none focus:ring-1 focus:ring-luminous-cyan transition-all appearance-none"
                         value={notifType}
                         onChange={e => setNotifType(e.target.value as any)}
                       >
                          <option value="info" className="bg-luminous-bg">Información</option>
                          <option value="warning" className="bg-luminous-bg">Alerta / Advertencia</option>
                          <option value="success" className="bg-luminous-bg">Éxito</option>
                       </select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-luminous-text-secondary uppercase tracking-wider">Título</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Cambio de Flujo en Zona Norte"
                      className="w-full h-11 rounded-lg border border-luminous-lavender/30 bg-luminous-bg/50 px-3 text-sm text-luminous-text-primary focus:outline-none focus:ring-1 focus:ring-luminous-cyan transition-all"
                      value={notifTitle}
                      onChange={e => setNotifTitle(e.target.value)}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-luminous-text-secondary uppercase tracking-wider">Mensaje</label>
                    <textarea 
                      required
                      placeholder="Escribe el mensaje a enviar..."
                      className="w-full h-24 p-3 rounded-lg border border-luminous-lavender/30 bg-luminous-bg/50 text-sm text-luminous-text-primary focus:outline-none focus:ring-1 focus:ring-luminous-cyan transition-all resize-none"
                      value={notifMessage}
                      onChange={e => setNotifMessage(e.target.value)}
                    />
                 </div>
                 <LuminousActionButton type="submit" className="w-full text-base py-3 mt-2">
                    Enviar Notificación
                 </LuminousActionButton>
               </form>
            </div>
         </LuminousPanel>
      </div>
    </div>
  );
}
