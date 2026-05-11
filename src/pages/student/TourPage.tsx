import React from 'react';
import { useFeria } from '../../store/FeriaContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { Footprints, CheckCircle2, ArrowRight } from 'lucide-react';

export default function TourPage() {
  const { stands, progress, getSuggestedStand } = useFeria();
  
  const suggested = getSuggestedStand();
  const unvisited = stands.filter(s => !progress.some(p => p.standId === s.id)).filter(s => s.id !== suggested?.id);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Tu Recorrido</h1>
        <p className="text-slate-400">Sugerencias basadas en disponibilidad y flujo en tiempo real.</p>
      </header>

      {suggested ? (
        <div className="space-y-6">
          <Card className="border border-white/10 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] relative overflow-hidden backdrop-blur-xl">
             <div className="absolute top-0 right-0 p-6 opacity-10">
               <Footprints className="w-32 h-32 transform -rotate-12 text-cyan-400" />
             </div>
             <CardContent className="p-8 relative z-10 space-y-4">
                <span className="inline-flex items-center rounded-full bg-cyan-400/20 border border-cyan-400/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-md">
                   Siguiente recomendado
                </span>
                <div>
                   <h2 className="text-3xl font-bold mb-1 text-white">{suggested.name}</h2>
                   <p className="text-cyan-200">Zona {suggested.zone} • {suggested.status === 'recommended' ? 'Alta prioridad' : 'Disponible'}</p>
                </div>
                <p className="text-slate-300 text-sm max-w-sm line-clamp-2">
                   {suggested.description}
                </p>
                <Button asChild size="lg" className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] font-bold mt-4">
                   <Link to={`/stand/${suggested.id}`}>
                     Ir al stand <ArrowRight className="w-5 h-5 ml-2" />
                   </Link>
                </Button>
             </CardContent>
          </Card>

          {unvisited.length > 0 && (
            <div>
              <h3 className="font-bold text-white mb-4 px-1 uppercase tracking-wider text-sm">Otras opciones cercanas</h3>
              <div className="space-y-3">
                 {unvisited.slice(0, 3).map(stand => (
                   <Link key={stand.id} to={`/stand/${stand.id}`} className="block">
                     <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/50 hover:bg-white/5 hover:shadow-[0_0_15px_-3px_rgba(34,211,238,0.2)] transition-all">
                        <CardContent className="p-4 flex items-center justify-between">
                           <div>
                             <h4 className="font-bold text-white">{stand.name}</h4>
                             <p className="text-xs font-medium text-cyan-400">Zona {stand.zone}</p>
                           </div>
                           <ArrowRight className="w-4 h-4 text-slate-400" />
                        </CardContent>
                     </Card>
                   </Link>
                 ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl text-center py-12 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]">
           <CardContent className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-400 mb-2 uppercase tracking-tight">¡Recorrido Completado!</h2>
              <p className="text-emerald-100/70 max-w-sm mb-6">
                Has visitado todos los stands de la feria. ¡Esperamos que hayas aprendido mucho!
              </p>
              <Button onClick={() => window.location.hash = '#/progreso'} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-bold">
                Ver mi resumen
              </Button>
           </CardContent>
        </Card>
      )}
    </div>
  );
}
