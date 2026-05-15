import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { User, Users, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [group, setGroup] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!group.trim()) newErrors.group = 'El grupo es obligatorio';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    login(name.trim(), lastName.trim(), group.trim());
    navigate('/inicio');
  };

  return (
    <div className="min-h-screen bg-circus-night flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Lights */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-circus-red via-circus-yellow to-circus-blue opacity-50"></div>
      
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-sm font-black text-circus-yellow hover:text-white mb-8 transition-colors uppercase tracking-[0.2em]">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Regresar a la entrada
        </Link>
        
        <Card className="border-2 border-circus-ticket/20 bg-slate-900/80 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          {/* Ticket notches */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-circus-night border-r-2 border-circus-ticket/20 rounded-full z-20"></div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-circus-night border-l-2 border-circus-ticket/20 rounded-full z-20"></div>
          
          <CardHeader className="space-y-1 pb-8 text-center border-b-2 border-dashed border-circus-ticket/10 mx-6">
            <div className="mx-auto w-16 h-16 bg-circus-red/10 border-2 border-circus-red/30 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-circus-red" />
            </div>
            <CardTitle className="text-3xl font-black text-white uppercase tracking-tighter italic">Registro de <span className="text-circus-yellow">Espectador</span></CardTitle>
            <CardDescription className="text-sm text-slate-400 font-medium uppercase tracking-wider">
              Tu pase para la gran feria de la ciencia
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-circus-yellow uppercase tracking-[0.2em] ml-1" htmlFor="name">Nombre de Pila</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
                  <input
                    id="name"
                    type="text"
                    className="w-full h-12 pl-12 rounded-2xl border-2 border-white/5 bg-white/5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-circus-yellow/50 transition-all font-bold"
                    placeholder="Ej. Ana"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                  />
                </div>
                {errors.name && <p className="text-[10px] text-circus-red font-black uppercase tracking-wider ml-1 mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-circus-yellow uppercase tracking-[0.2em] ml-1" htmlFor="lastName">Apellido Paterno</label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full h-12 rounded-2xl border-2 border-white/5 bg-white/5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-circus-yellow/50 transition-all font-bold"
                  placeholder="Ej. García"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                />
                {errors.lastName && <p className="text-[10px] text-circus-red font-black uppercase tracking-wider ml-1 mt-1">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-circus-yellow uppercase tracking-[0.2em] ml-1" htmlFor="group">Grado y Sección / Grupo</label>
                <input
                  id="group"
                  type="text"
                  className="w-full h-12 rounded-2xl border-2 border-white/5 bg-white/5 px-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-circus-yellow/50 transition-all font-bold"
                  placeholder="Ej. 3A, Público"
                  value={group}
                  onChange={(e) => {
                    setGroup(e.target.value);
                    if (errors.group) setErrors(prev => ({ ...prev, group: '' }));
                  }}
                />
                {errors.group && <p className="text-[10px] text-circus-red font-black uppercase tracking-wider ml-1 mt-1">{errors.group}</p>}
              </div>

              <Button type="submit" className="w-full h-14 bg-circus-blue text-white font-black hover:bg-circus-blue/90 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] rounded-2xl uppercase tracking-[0.2em] text-sm transform active:scale-[0.98] transition-all">
                Entrar a la Carpa
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="pb-8 justify-center">
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center max-w-[200px]">
               Al ingresar aceptas el reglamento de convivencia de la feria.
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
