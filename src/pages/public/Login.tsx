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
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-cyan-400 hover:text-cyan-300 mb-6 transition-colors uppercase tracking-wider">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver a inicio
        </Link>
        <Card className="border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl shadow-indigo-500/20 ring-1 ring-white/10">
          <CardHeader className="space-y-2 pb-8">
            <CardTitle className="text-2xl font-bold text-white uppercase tracking-tight">Registro de Visitante</CardTitle>
            <CardDescription className="text-base text-slate-400">
              Ingresa tus datos para comenzar el recorrido interactivo por la feria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider" htmlFor="name">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    id="name"
                    type="text"
                    className="w-full h-11 pl-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="Ej. Ana"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                  />
                </div>
                {errors.name && <p className="text-sm text-rose-400 font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider" htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  placeholder="Ej. García"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                  }}
                />
                {errors.lastName && <p className="text-sm text-rose-400 font-medium">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider" htmlFor="group">Grupo / Procedencia</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    id="group"
                    type="text"
                    className="w-full h-11 pl-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    placeholder="Ej. 3A, Público General"
                    value={group}
                    onChange={(e) => {
                      setGroup(e.target.value);
                      if (errors.group) setErrors(prev => ({ ...prev, group: '' }));
                    }}
                  />
                </div>
                {errors.group && <p className="text-sm text-rose-400 font-medium">{errors.group}</p>}
              </div>

              <Button type="submit" className="w-full mt-2 bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)]" size="lg">
                Ingresar a la Feria
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
