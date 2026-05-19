import React, { useState } from 'react';
import { useFeria } from '../../store/FeriaContext';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import { MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { StandStatus, Stand } from '../../types';

export default function MapPage() {
  const { stands, progress } = useFeria();
  const [activeZone, setActiveZone] = useState<string | 'All'>('All');

  const zones = ['All', 'Norte', 'Sur', 'Este', 'Oeste', 'Centro'];

  const filteredStands = activeZone === 'All' 
    ? stands 
    : stands.filter(s => s.zone === activeZone);

  const getStatusColor = (status: StandStatus) => {
    switch (status) {
      case 'active': return 'bg-circus-cyan shadow-[0_0_10px_rgba(103,232,249,0.8)]';
      case 'recommended': return 'bg-circus-yellow shadow-[0_0_10px_rgba(250,204,21,0.8)]';
      case 'moderate': return 'bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.8)]';
      case 'saturated': return 'bg-circus-red shadow-[0_0_10px_rgba(239,68,68,0.8)]';
      case 'inactive': return 'bg-slate-700 shadow-[0_0_8px_rgba(51,65,85,0.5)]';
      default: return 'bg-slate-700';
    }
  };

  const getStatusText = (status: StandStatus) => {
    switch (status) {
      case 'active': return 'Abierto';
      case 'recommended': return '¡Visítame!';
      case 'moderate': return 'Fila Media';
      case 'saturated': return '¡Lleno!';
      case 'inactive': return 'Cerrado';
      default: return status;
    }
  };

  // Group stands for the floor plan map
  const standsByZone = stands.reduce((acc, stand) => {
    acc[stand.zone] = acc[stand.zone] || [];
    acc[stand.zone].push(stand);
    return acc;
  }, {} as Record<string, Stand[]>);

  // If viewing all, show the floor plan. Otherwise, show a detailed list.
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Plano de las <span className="text-circus-red">Carpas</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mt-1">Ubicación y flujo de visitantes en vivo</p>
        </div>
        <div className="hidden sm:block">
           <div className="px-3 py-1 bg-circus-yellow/10 border border-circus-yellow/30 rounded-full text-circus-yellow text-[10px] font-black uppercase tracking-widest animate-pulse">
              En Vivo
           </div>
        </div>
      </header>

      {/* Zone Filters */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {zones.map(zone => (
          <button
            key={zone}
            onClick={() => setActiveZone(zone)}
            className={cn(
               "px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all",
               activeZone === zone 
                ? "bg-circus-blue text-white border-circus-blue shadow-[0_5px_15px_-5px_rgba(37,99,235,0.5)]" 
                : "bg-white/5 text-slate-500 border-white/5 hover:bg-white/10 hover:border-white/10"
            )}
          >
            {zone === 'All' ? 'Vista Global' : `Pista ${zone}`}
          </button>
        ))}
      </div>

      {activeZone === 'All' ? (
        <div className="relative w-full aspect-square sm:aspect-video bg-slate-950/80 backdrop-blur-xl rounded-3xl border-2 border-dashed border-white/10 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
          {/* Legend */}
          <div className="absolute top-6 left-6 bg-slate-900/90 p-4 rounded-2xl border border-white/10 backdrop-blur-2xl z-20 hidden md:block shadow-2xl">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Estado de Carpa</h4>
            <div className="space-y-3 text-[9px] font-black uppercase tracking-wider text-white">
               <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-circus-cyan shadow-[0_0_10px_rgba(103,232,249,0.8)]"></div> Disponible</div>
               <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-circus-yellow shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div> Recomendado</div>
               <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-circus-red shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div> Saturado</div>
            </div>
          </div>

          {/* Map Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-3 w-full max-w-2xl h-full relative z-10">
            {/* Norte */}
            <div className="col-start-2 row-start-1 bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-lg" onClick={() => setActiveZone('Norte')}>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2 group-hover:text-white transition-colors">Pista Norte</span>
              <div className="flex-1 flex flex-wrap gap-2 justify-center content-center">
                 {standsByZone['Norte']?.map(s => (
                   <div key={s.id} className={cn("w-5 h-5 sm:w-7 sm:h-7 rounded-lg shadow-md transform group-hover:scale-110 transition-transform", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>

            {/* Oeste */}
            <div className="col-start-1 row-start-2 bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-lg" onClick={() => setActiveZone('Oeste')}>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2 group-hover:text-white transition-colors">Pista Oeste</span>
              <div className="flex-1 flex flex-wrap gap-2 justify-center content-center">
                 {standsByZone['Oeste']?.map(s => (
                   <div key={s.id} className={cn("w-5 h-5 sm:w-7 sm:h-7 rounded-lg shadow-md transform group-hover:scale-110 transition-transform", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>

            {/* Centro */}
            <div className="col-start-2 row-start-2 bg-circus-red/5 border-2 border-circus-red/30 rounded-full p-2 flex flex-col justify-center items-center hover:bg-circus-red/10 transition-all cursor-pointer shadow-[0_0_40px_rgba(239,68,68,0.2)] relative overflow-hidden group circus-border" onClick={() => setActiveZone('Centro')}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-circus-red/10 to-transparent"></div>
              <span className="text-xs sm:text-sm font-black text-white uppercase tracking-tighter italic text-center mb-2 relative z-10 drop-shadow-md">Escenario <br/><span className="text-[10px] font-black text-circus-yellow tracking-widest drop-shadow-none non-italic">PRINCIPAL</span></span>
              <div className="flex flex-wrap gap-2 justify-center content-center relative z-10">
                 {standsByZone['Centro']?.map(s => (
                   <div key={s.id} className={cn("w-6 h-6 sm:w-9 sm:h-9 rounded-full border-2 border-white/20 shadow-xl transform group-hover:rotate-12 transition-transform", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>

            {/* Este */}
            <div className="col-start-3 row-start-2 bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-lg" onClick={() => setActiveZone('Este')}>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2 group-hover:text-white transition-colors">Pista Este</span>
              <div className="flex-1 flex flex-wrap gap-2 justify-center content-center">
                 {standsByZone['Este']?.map(s => (
                   <div key={s.id} className={cn("w-5 h-5 sm:w-7 sm:h-7 rounded-lg shadow-md transform group-hover:scale-110 transition-transform", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>

            {/* Sur */}
            <div className="col-start-2 row-start-3 bg-white/5 border border-white/10 rounded-2xl p-2 flex flex-col hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-lg" onClick={() => setActiveZone('Sur')}>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2 group-hover:text-white transition-colors">Pista Sur</span>
              <div className="flex-1 flex flex-wrap gap-2 justify-center content-center">
                 {standsByZone['Sur']?.map(s => (
                   <div key={s.id} className={cn("w-5 h-5 sm:w-7 sm:h-7 rounded-lg shadow-md transform group-hover:scale-110 transition-transform", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>
          </div>
          
          <p className="mt-8 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] absolute bottom-6 flex items-center gap-3">
             <span className="w-1.5 h-1.5 rounded-full bg-circus-cyan animate-ping"></span>
             Toca una pista para ver detalles
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 mb-2 flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center uppercase tracking-tight italic">
              <MapPin className="w-5 h-5 mr-2 text-circus-yellow" /> Pista {activeZone}
            </h2>
            <button onClick={() => setActiveZone('All')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors border-b border-white/10">Cerrar Detalle</button>
          </div>
          {filteredStands.map(stand => {
            const isVisited = progress.some(p => p.standId === stand.id);
            
            return (
              <Link key={stand.id} to={`/stand/${stand.id}`} className="block">
                <Card className="hover:bg-white/10 transition-all overflow-hidden relative bg-slate-900/60 backdrop-blur-2xl border-2 border-white/5 group cursor-pointer h-full rounded-2xl">
                  {isVisited && (
                    <div className="absolute top-4 right-4 text-circus-cyan z-10 bg-circus-cyan/10 rounded-full p-1 border border-circus-cyan/30">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  
                  <CardContent className="p-6 flex flex-col h-full">
                     <div className="flex flex-col gap-4 flex-1">
                        <div className="flex items-start justify-between pe-8">
                           <h3 className="font-black text-white line-clamp-2 text-lg group-hover:text-circus-yellow transition-colors uppercase tracking-tight">{stand.name}</h3>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3">
                             <div className={cn("w-3 h-3 rounded-full shadow-lg", getStatusColor(stand.status), stand.status === 'active' && 'animate-pulse')} />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getStatusText(stand.status)}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                        </div>
                     </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  );
}
