import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MessageSquare, Star, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { sendFeedback } from '../../lib/feedbackService';

export default function Feedback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: 'student',
    organization: 5,
    stands: 5,
    experience: 5,
    comments: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const mensaje = formData.comments.trim() || "Evaluación sin comentario textual.";

    const result = await sendFeedback({
      app_origen: 'feria_alternativa',
      tipo: 'sugerencia',
      mensaje,
      nombre: formData.role === 'student' ? 'Estudiante/Visitante' : 'Docente/Organizador',
      rol: formData.role,
      metadata: {
        organization: formData.organization,
        stands: formData.stands,
        experience: formData.experience
      }
    });

    if (result.success) {
      toast.success('¡Gracias por tu opinión!', {
        description: 'Tu comentario ha sido registrado en el sistema institucional.'
      });
      setTimeout(() => navigate(-1), 2000);
    } else if (result.fallback) {
      toast.info('Feedback guardado localmente', {
        description: 'No pudimos conectar con el servidor, pero tu opinión se guardó en este dispositivo.'
      });
      setTimeout(() => navigate(-1), 2000);
    } else {
      toast.error('Error al enviar el feedback');
    }

    setLoading(false);
  };

  const StarRating = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`transition-all ${star <= value ? 'text-amber-400 scale-110' : 'text-slate-600 hover:text-amber-400/50'}`}
          >
            <Star className="w-8 h-8 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-900/10 to-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-bold text-cyan-400 hover:text-cyan-300 mb-6 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver
        </button>

        <Card className="border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl shadow-indigo-500/20 ring-1 ring-white/10">
          <CardHeader className="text-center pb-6 border-b border-white/10">
            <div className="mx-auto w-16 h-16 bg-cyan-400/20 border border-cyan-400/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]">
              <MessageSquare className="w-8 h-8 text-cyan-400" />
            </div>
             <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">Feedback del Circo Científico Escolar</CardTitle>
             <CardDescription className="text-slate-400 mt-2 font-medium">
               Tu opinión es muy importante para nosotros. ¿Cómo calificarías tu experiencia en el Circo Científico Escolar 2026?
             </CardDescription>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Soy un...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'student'})}
                    className={`p-3 rounded-xl border font-bold transition-all ${
                      formData.role === 'student' 
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Estudiante / Visitante
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, role: 'teacher'})}
                    className={`p-3 rounded-xl border font-bold transition-all ${
                      formData.role === 'teacher' 
                        ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    Docente / Organizador
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-200">Organización y Logística</label>
                  <StarRating 
                    value={formData.organization} 
                    onChange={val => setFormData({...formData, organization: val})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-200">Calidad de los Stands</label>
                  <StarRating 
                    value={formData.stands} 
                    onChange={val => setFormData({...formData, stands: val})} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-200">Experiencia General</label>
                  <StarRating 
                    value={formData.experience} 
                    onChange={val => setFormData({...formData, experience: val})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Comentarios y Sugerencias</label>
                <textarea
                  className="w-full h-32 p-4 rounded-xl border border-white/10 bg-white/5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none placeholder-slate-500"
                  placeholder="¿Qué fue lo que más te gustó? ¿Qué podríamos mejorar?"
                  value={formData.comments}
                  onChange={e => setFormData({...formData, comments: e.target.value})}
                ></textarea>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-wide uppercase shadow-[0_0_20px_-5px_rgba(34,211,238,0.5)] transition-all"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Feedback'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
