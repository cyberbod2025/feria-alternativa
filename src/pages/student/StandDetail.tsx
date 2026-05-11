import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFeria } from '../../store/FeriaContext';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ChevronLeft, CheckCircle, Users, Target, BookOpen, QrCode, Sparkles, Map } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function StandDetail() {
  const { standId } = useParams();
  const navigate = useNavigate();
  const { stands, progress, markArrived, markVisited, getSuggestedStand } = useFeria();
  
  const stand = stands.find(s => s.id === standId);
  const p = progress.find(pr => pr.standId === standId);
  
  const isArrived = !!p?.arrivedAt;
  const isVisited = !!p?.visitedAt;
  
  const [showTrivia, setShowTrivia] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [qrInput, setQrInput] = useState('');
  
  const [showRewardOverlay, setShowRewardOverlay] = useState(false);
  const [rewardMessage, setRewardMessage] = useState({ title: '', desc: '', isCorrect: false });
  const [nextSuggested, setNextSuggested] = useState<any>(null);

  if (!stand) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Stand no encontrado</h2>
        <Button onClick={() => navigate('/mapa')} className="mt-4">Volver al mapa</Button>
      </div>
    );
  }

  const handleCheckIn = () => {
    if (markArrived(stand.id, qrInput)) {
      toast.success('¡Check-in exitoso!');
    } else {
      if (stand.currentVisitors >= 20) {
        toast.error('Este stand está lleno (máx 20 personas). Intenta de nuevo más tarde.');
      } else {
        toast.error('Código QR inválido. (Tip: usa ' + stand.qrSlug + ')');
      }
    }
  };

  const triggerReward = (isCorrect: boolean, score: number) => {
    const nextStand = getSuggestedStand();
    setNextSuggested(nextStand);
    
    setRewardMessage({
      title: isCorrect ? '¡CORRECTO!' : '¡COMPLETADO!',
      desc: isCorrect ? `¡Ganaste ${score} pts increíbles!` : `Has ganado ${score} pts por participar.`,
      isCorrect
    });
    
    setShowRewardOverlay(true);
    
    // Confetti!
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#22d3ee', '#8b5cf6', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#22d3ee', '#8b5cf6', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleMarkVisited = () => {
    const score = 50;
    markVisited(stand.id, score); 
    triggerReward(true, score); // give them standard reward
  };

  const handleTriviaSubmit = () => {
    if (selectedOption === null) return;
    
    // Simplistic evaluation
    const isCorrect = selectedOption === stand.trivia?.[0].correctOptionIndex;
    const score = isCorrect ? 150 : 50;
    
    markVisited(stand.id, score);
    triggerReward(isCorrect, score);
    setShowTrivia(false);
  };

  const navigateToNext = () => {
    if (nextSuggested) {
      navigate(`/stand/${nextSuggested.id}`);
      setShowRewardOverlay(false);
      window.scrollTo(0, 0);
    } else {
      navigate('/mapa');
    }
  };

  useEffect(() => {
    if (showRewardOverlay && nextSuggested) {
      const timer = setTimeout(() => {
        navigateToNext();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showRewardOverlay, nextSuggested]);

  if (!isArrived) {
    return (
      <div className="space-y-6 pb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver
        </button>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white leading-tight uppercase tracking-tight">{stand.name}</h1>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
             <span className="bg-white/10 text-slate-300 border border-white/10 px-2.5 py-1 rounded-xl">Ocupación: {stand.currentVisitors}/20</span>
          </div>
        </div>

        <Card className="border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xl shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)]">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
               <QrCode className="w-10 h-10 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Escanea para Ingresar</h2>
              <p className="text-sm text-cyan-200/70 mt-2">Debes escanear el código QR físico del stand para registrar tu llegada y comenzar la actividad.</p>
            </div>
            
            <div className="w-full space-y-3 pt-4">
              <input 
                type="text" 
                placeholder={`Simular escaneo (ej: ${stand.qrSlug})`}
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all font-mono text-sm text-center"
              />
              <Button onClick={handleCheckIn} className="w-full font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.4)]" size="lg">
                Verificar Código QR
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6 mt-4 relative">
      <AnimatePresence>
        {showRewardOverlay && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/95 backdrop-blur-2xl p-6"
          >
            <div className="max-w-md w-full flex flex-col items-center text-center space-y-8">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              >
                <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,211,238,0.5)] ${rewardMessage.isCorrect ? 'bg-emerald-500' : 'bg-cyan-500'}`}>
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-2">
                  {rewardMessage.title}
                </h1>
                <p className="text-xl text-[#22D3EE] font-bold uppercase tracking-wider">
                  {rewardMessage.desc}
                </p>
              </motion.div>

              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                className="w-full bg-[#0F172A] border border-white/10 rounded-3xl p-6 mt-8 shadow-xl"
              >
                <p className="text-xs uppercase font-bold text-[#94A3B8] tracking-widest mb-4">Siguiente Destino Sugerido</p>
                {nextSuggested ? (
                  <>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">{nextSuggested.name}</h3>
                    <p className="text-sm text-cyan-400 mb-4 font-bold uppercase tracking-widest animate-pulse">Redirigiendo automáticamente...</p>
                    <Button 
                      onClick={navigateToNext} 
                      className="w-full text-lg h-14 bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:opacity-90 shadow-[0_0_30px_rgba(124,58,237,0.5)] font-bold tracking-widest"
                    >
                      ¡VAMOS ALLÁ AHORA! <Map className="ml-2 w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white mb-6">¡Has visitado todos los stands disponibles!</h3>
                    <Button 
                      onClick={() => navigate('/mapa')}
                      className="w-full border border-white/20 bg-white/5 text-white"
                    >
                      Volver al Mapa
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => navigate('/mapa')} 
        className="flex items-center text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Mapa
      </button>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
           <h1 className="text-3xl font-extrabold text-white leading-tight uppercase tracking-tight">{stand.name}</h1>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
           <span className="bg-white/10 text-slate-300 border border-white/10 px-2.5 py-1 rounded-xl">Grupo {stand.group}</span>
           <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">Participando Activamente</span>
        </div>
      </div>

      <Card className="border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-indigo-500/10">
         <CardContent className="p-6 space-y-6">
            <div>
               <h3 className="flex items-center text-lg font-bold text-white mb-2 uppercase tracking-tight">
                  <BookOpen className="w-5 h-5 mr-2 text-cyan-400" />
                  Descripción
               </h3>
               <p className="text-slate-300 leading-relaxed font-medium">{stand.description}</p>
            </div>

            {stand.objective && (
               <div>
                  <h3 className="flex items-center text-lg font-bold text-white mb-2 uppercase tracking-tight">
                     <Target className="w-5 h-5 mr-2 text-rose-400" />
                     Objetivo
                  </h3>
                  <p className="text-slate-300 leading-relaxed font-medium">{stand.objective}</p>
               </div>
            )}
         </CardContent>
      </Card>

      {!isVisited ? (
        <Card className="border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl shadow-[0_0_30px_-5px_rgba(99,102,241,0.2)]">
          <CardContent className="p-6 text-center space-y-4">
             <h3 className="font-bold text-indigo-300 uppercase tracking-tight">¿Ya terminaste la actividad?</h3>
             {stand.trivia && stand.trivia.length > 0 ? (
               <div className="space-y-3">
                 {showTrivia ? (
                    <div className="bg-slate-950/50 backdrop-blur-md p-5 rounded-2xl border border-indigo-500/30 text-left space-y-4">
                       <p className="font-bold text-white">{stand.trivia[0].question}</p>
                       <div className="space-y-2">
                         {stand.trivia[0].options.map((option, idx) => (
                           <button
                             key={idx}
                             onClick={() => setSelectedOption(idx)}
                             className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                               selectedOption === idx 
                                ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_-3px_rgba(34,211,238,0.3)]' 
                                : 'border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                             }`}
                           >
                             {option}
                           </button>
                         ))}
                       </div>
                       <Button 
                         className="w-full mt-4 font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]" 
                         disabled={selectedOption === null || isVisited}
                         onClick={handleTriviaSubmit}
                       >
                         Responder y Finalizar Visita
                       </Button>
                    </div>
                 ) : (
                    <Button onClick={() => setShowTrivia(true)} className="w-full font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]" size="lg">
                      Responder Trivia y Concluir
                    </Button>
                 )}
               </div>
             ) : (
                <Button onClick={handleMarkVisited} className="w-full font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]" size="lg">
                  Marcar como Terminado
                </Button>
             )}
          </CardContent>
        </Card>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl rounded-2xl p-6 flex items-center justify-center gap-3 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]">
           <CheckCircle className="w-6 h-6" />
           <span className="font-bold uppercase tracking-wider">Stand completado</span>
        </div>
      )}

    </div>
  );
}

