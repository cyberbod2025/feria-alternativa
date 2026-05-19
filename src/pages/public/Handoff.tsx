import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Role } from '../../types';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function Handoff() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginSase } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('Token de acceso no proporcionado.');
      return;
    }

    try {
      let payload;
      try {
        const base64Url = token.split('.')[1];
        if(!base64Url) throw new Error("Invalid token format");
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        payload = JSON.parse(jsonPayload);
      } catch (e) {
        console.error("Failed to decode token:", e);
        setError('Token de acceso inválido o malformado.');
        return;
      }

      const { role, module } = payload;

      if (module !== 'feria') {
        setError('El token provisto no es válido para este espectáculo.');
        return;
      }

      if (!['teacher', 'admin', 'staff'].includes(role)) {
         setError('No tienes pase de Director para acceder a este panel.');
         return;
      }

      // Login
      loginSase(token, role as Role);
      navigate('/docente');

    } catch (err) {
      console.error(err);
      setError('Error al validar el pase de entrada.');
    }
  }, [searchParams, loginSase, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center p-6">
         <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border-2 border-white/5 p-10 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-circus-red"></div>
          <div className="w-20 h-20 bg-circus-red/10 text-circus-red rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-circus-red/30 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
             <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Función <span className="text-circus-red">Privada</span></h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">{error}</p>
          <Button onClick={() => navigate('/')} className="w-full mt-6 h-14 bg-white/5 border-2 border-white/10 text-white hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-[11px]" variant="outline">
            Volver a la Entrada
          </Button>
         </div>
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
           <div className="w-16 h-16 border-4 border-circus-cyan/20 border-t-circus-cyan rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-circus-cyan/10 rounded-full animate-pulse"></div>
           </div>
        </div>
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Validando <span className="text-circus-cyan">Credenciales</span></h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 italic">Conectando con el Sistema SASE-310...</p>
     </div>
  );
}
