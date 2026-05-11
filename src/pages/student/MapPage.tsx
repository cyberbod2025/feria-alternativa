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
      case 'active': return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]';
      case 'recommended': return 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]';
      case 'moderate': return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]';
      case 'saturated': return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]';
      case 'inactive': return 'bg-zinc-600 shadow-[0_0_8px_rgba(82,82,91,0.5)]';
      default: return 'bg-zinc-600';
    }
  };

  const getStatusText = (status: StandStatus) => {
    switch (status) {
      case 'active': return 'Disponible';
      case 'recommended': return 'Recomendado';
      case 'moderate': return 'Moderado';
      case 'saturated': return 'Lleno';
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
      <header>
        <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Plano de la Feria</h1>
        <p className="text-zinc-400 font-medium">Explora las zonas y la disponibilidad en tiempo real.</p>
      </header>

      {/* Zone Filters */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {zones.map(zone => (
          <button
            key={zone}
            onClick={() => setActiveZone(zone)}
            className={cn(
               "px-4 py-2 rounded-none border text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all",
               activeZone === zone 
                ? "bg-zinc-200 text-zinc-900 border-zinc-300 shadow-md" 
                : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10"
            )}
          >
            {zone === 'All' ? 'Plano Completo' : `Zona ${zone}`}
          </button>
        ))}
      </div>

      {activeZone === 'All' ? (
        <div className="relative w-full aspect-square sm:aspect-video bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-8 flex flex-col items-center justify-center overflow-hidden">
          {/* Legend */}
          <div className="absolute top-4 left-4 bg-zinc-950/60 p-3 rounded-xl border border-white/10 backdrop-blur-2xl z-20 hidden md:block shadow-xl">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Estado</h4>
            <div className="space-y-2 text-[10px] uppercase font-bold text-zinc-400">
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div> Disponible</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div> Moderado</div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div> Lleno</div>
            </div>
          </div>

          {/* Map Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full max-w-2xl h-full relative z-10">
            {/* Norte */}
            <div className="col-start-2 row-start-1 bg-white/5 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/10 rounded-xl p-2 flex flex-col hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-lg" onClick={() => setActiveZone('Norte')}>
              <span className="text-[10px] font-bold text-zinc-300 uppercase text-center mb-1">Norte</span>
              <div className="flex-1 flex flex-wrap gap-1.5 justify-center content-center">
                 {standsByZone['Norte']?.map(s => (
                   <div key={s.id} className={cn("w-4 h-4 sm:w-6 sm:h-6 rounded-sm shadow-sm", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>

            {/* Oeste */}
            <div className="col-start-1 row-start-2 bg-white/5 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/10 rounded-xl p-2 flex flex-col hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-lg" onClick={() => setActiveZone('Oeste')}>
              <span className="text-[10px] font-bold text-zinc-300 uppercase text-center mb-1">Oeste</span>
              <div className="flex-1 flex flex-wrap gap-1.5 justify-center content-center">
                 {standsByZone['Oeste']?.map(s => (
                   <div key={s.id} className={cn("w-4 h-4 sm:w-6 sm:h-6 rounded-sm shadow-sm", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>

            {/* Centro */}
            <div className="col-start-2 row-start-2 bg-zinc-800/60 bg-gradient-to-br from-zinc-700/50 to-transparent backdrop-blur-2xl border border-white/20 rounded-xl p-2 flex flex-col justify-center items-center hover:bg-zinc-700/80 transition-all cursor-pointer shadow-2xl relative overflow-hidden" onClick={() => setActiveZone('Centro')}>
              <div className="absolute inset-0 bg-white/5"></div>
              <span className="text-xs sm:text-sm font-black text-white uppercase tracking-widest text-center mb-2 relative z-10 drop-shadow-md">Centro <br/><span className="text-[10px] font-medium text-zinc-300 tracking-normal drop-shadow-none">(Principal)</span></span>
              <div className="flex flex-wrap gap-2 justify-center content-center relative z-10">
                 {standsByZone['Centro']?.map(s => (
                   <div key={s.id} className={cn("w-5 h-5 sm:w-8 sm:h-8 rounded", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>

            {/* Este */}
            <div className="col-start-3 row-start-2 bg-white/5 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/10 rounded-xl p-2 flex flex-col hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-lg" onClick={() => setActiveZone('Este')}>
              <span className="text-[10px] font-bold text-zinc-300 uppercase text-center mb-1">Este</span>
              <div className="flex-1 flex flex-wrap gap-1.5 justify-center content-center">
                 {standsByZone['Este']?.map(s => (
                   <div key={s.id} className={cn("w-4 h-4 sm:w-6 sm:h-6 rounded-sm shadow-sm", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>

            {/* Sur */}
            <div className="col-start-2 row-start-3 bg-white/5 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl border border-white/10 rounded-xl p-2 flex flex-col hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-lg" onClick={() => setActiveZone('Sur')}>
              <span className="text-[10px] font-bold text-zinc-300 uppercase text-center mb-1">Sur</span>
              <div className="flex-1 flex flex-wrap gap-1.5 justify-center content-center">
                 {standsByZone['Sur']?.map(s => (
                   <div key={s.id} className={cn("w-4 h-4 sm:w-6 sm:h-6 rounded-sm shadow-sm", getStatusColor(s.status))} title={s.name} />
                 ))}
              </div>
            </div>
            
            {/* Walkways / Connections */}
            <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
              <div className="w-[80%] h-4 bg-white/5 absolute rounded-full"></div>
              <div className="h-[80%] w-4 bg-white/5 absolute rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-zinc-500 uppercase tracking-widest absolute bottom-4">Toca una zona para ver detalles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 mb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-200 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-zinc-400" /> Detalle Zona {activeZone}
            </h2>
            <button onClick={() => setActiveZone('All')} className="text-xs font-bold text-zinc-400 uppercase hover:text-white transition-colors">Volver al Plano</button>
          </div>
          {filteredStands.map(stand => {
            const isVisited = progress.some(p => p.standId === stand.id);
            
            return (
              <Link key={stand.id} to={`/stand/${stand.id}`} className="block">
                <Card className="hover:bg-white/10 transition-all overflow-hidden relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 group cursor-pointer h-full">
                  {isVisited && (
                    <div className="absolute top-4 right-4 text-emerald-400 z-10 bg-emerald-500/10 rounded-full p-1 border border-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  
                  <CardContent className="p-5 flex flex-col h-full">
                     <div className="flex flex-col gap-3 flex-1">
                        <div className="flex items-start justify-between pe-8">
                           <h3 className="font-bold text-white line-clamp-2 text-lg group-hover:text-zinc-200">{stand.name}</h3>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2">
                             <div className={cn("w-3 h-3 rounded shadow-sm", getStatusColor(stand.status), stand.status === 'active' && 'animate-pulse')} />
                             <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{getStatusText(stand.status)}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        </div>
                     </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
          {filteredStands.length === 0 && (
             <div className="sm:col-span-2 text-center p-8 border border-white/5 border-dashed rounded-xl bg-white/5 text-zinc-500">
                No hay stands en esta zona.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
