import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LayoutDashboard, Users, Map, LogOut, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/button';
import { EventTimerDisplay } from '../components/EventTimerDisplay';

export default function TeacherLayout() {
  const { session, logout } = useAuth();
  const location = useLocation();

  if (!session || !['teacher', 'staff', 'admin'].includes(session.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] p-4">
        <div className="max-w-md w-full bg-[#0F172A] rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-[#EF4444]/20 text-[#EF4444] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <LogOut className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-black text-[#F8FAFC] tracking-wide uppercase">Acceso Denegado</h2>
          <p className="text-[#94A3B8]">
            El acceso docente solo está permitido a través del sistema principal SASE-310.
            Por favor, inicie sesión allí.
          </p>
          <Button onClick={logout} className="w-full mt-4 font-bold tracking-widest text-[#050816] bg-[#22D3EE] hover:bg-[#38BDF8]">VOLVER AL INICIO</Button>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/docente', icon: LayoutDashboard },
    { name: 'Stands & QR', path: '/docente/stands', icon: Map },
    { name: 'Visitantes', path: '/docente/visitantes', icon: Users },
    { name: 'Ir a Feedback', path: '/feedback', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0F172A]/70 backdrop-blur-2xl border-r border-[#1E293B] min-h-screen p-6 shadow-[20px_0_60px_rgba(0,0,0,0.3)] z-10 relative">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#3B82F6] to-[#7C3AED] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-heading font-black tracking-widest uppercase leading-tight line-clamp-2 text-[#F8FAFC] drop-shadow-md">
              Circo<br /><span className="text-[#22D3EE] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">Científico Escolar</span>
            </h1>
          </div>
          <p className="text-[10px] text-[#22D3EE] font-bold px-1 tracking-[0.2em] uppercase mt-2 opacity-80">SASE-310 • Panel Org.</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/docente' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl transition-all font-bold tracking-wide",
                  isActive ? "bg-gradient-to-r from-[#2563EB]/20 to-transparent border-l-4 border-l-[#22D3EE] text-[#F8FAFC] shadow-[inset_0_0_20px_rgba(37,99,235,0.1)]" : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-[#22D3EE] drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" : "")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-white/5 space-y-4">
          <div className="flex justify-center mb-4">
             <EventTimerDisplay />
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#7C3AED]/10 to-[#3B82F6]/5 mb-4 border border-[#7C3AED]/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]">
            <p className="text-[10px] uppercase font-bold text-[#A78BFA] mb-2 tracking-widest drop-shadow-sm">Operador Activo</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#3B82F6] flex items-center justify-center text-white font-black shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                {session.role[0].toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-bold text-[#F8FAFC] capitalize tracking-wide">{session.role}</p>
                <p className="text-xs text-[#94A3B8]">SASE Connect</p>
              </div>
            </div>
            <Button variant="ghost" className="w-full py-2 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] hover:text-[#F8FAFC] text-xs font-bold tracking-widest transition-colors border border-[#EF4444]/20 rounded-xl" onClick={logout}>
              TERMINAR SESIÓN
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="md:hidden bg-[#0F172A]/80 backdrop-blur-2xl border-b border-white/10 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg font-heading font-black text-[#F8FAFC] uppercase tracking-widest drop-shadow-sm">
          SASE <span className="text-[#22D3EE]">Admin</span>
        </h1>
        <div className="flex items-center gap-2">
           <EventTimerDisplay />
           <Button variant="ghost" size="icon" onClick={logout} className="text-[#94A3B8] hover:text-[#EF4444] rounded-xl hover:bg-[#EF4444]/10">
             <LogOut className="w-5 h-5" />
           </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative z-0 pb-24 md:pb-8">
        <div className="absolute inset-0 bg-[#050816]/50 pointer-events-none -z-10"></div>
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 w-full h-20 bg-[#0F172A]/90 backdrop-blur-2xl border-t border-white/10 flex justify-around items-center z-50 pb-2">
          {navItems.map((item) => {
             const isActive = location.pathname === item.path || (item.path !== '/docente' && location.pathname.startsWith(item.path));
             return (
               <Link
                 key={item.path}
                 to={item.path}
                 className={cn("flex flex-col items-center justify-center w-full h-full text-[10px] font-bold uppercase tracking-widest transition-all", isActive ? "text-[#22D3EE] drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] -translate-y-1" : "text-[#94A3B8] hover:text-[#F8FAFC]")}
               >
                 <item.icon className="w-5 h-5 mb-1.5" />
                 {item.name}
               </Link>
             )
          })}
      </nav>
    </div>
  );
}
