import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { SessionResponse } from '../../types';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

const API_BASE = '/api/feria';

export default function Handoff() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginSase } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('sase_token') || searchParams.get('token');

    if (!tokenParam) {
      setError('Token de acceso no proporcionado.');
      return;
    }

    let cancelled = false;

    async function validateWithBackend() {
      try {
        const res = await fetch(`${API_BASE}/handoff`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenParam }),
          signal: AbortSignal.timeout(10000),
        });

        const data: SessionResponse = await res.json();

        if (cancelled) return;

        if (data.valid && data.session) {
          loginSase(data.session);
          navigate('/docente');
        } else {
          setError(data.error || 'Token rechazado por el servidor.');
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          'No se pudo conectar con el servidor de validación. ' +
          'Asegúrate de que el servidor Express esté corriendo (npm run dev).'
        );
      }
    }

    validateWithBackend();

    return () => { cancelled = true; };
  }, [searchParams, loginSase, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
         <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-2xl rounded-2xl shadow-xl border border-white/10 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
             <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Acceso Denegado</h2>
          <p className="text-slate-400">{error}</p>
          <Button onClick={() => navigate('/')} className="w-full mt-4 border-white/10 text-white hover:bg-white/5" variant="outline">Volver al inicio</Button>
         </div>
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">Verificando acceso...</h2>
        <p className="text-cyan-200/70 mt-2 font-medium">Conectando con SASE-310</p>
     </div>
  );
}
