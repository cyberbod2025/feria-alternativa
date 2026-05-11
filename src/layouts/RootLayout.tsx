import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../store/AuthContext';
import { FeriaProvider } from '../store/FeriaContext';
import { Toaster } from 'sonner';
import { GlobalNotificationsWrapper } from '../contexts/GlobalNotificationsWrapper';

export default function RootLayout() {
  return (
    <AuthProvider>
      <GlobalNotificationsWrapper>
        <FeriaProvider>
          <div className="min-h-screen w-full bg-[#050816] font-sans text-[#F8FAFC] overflow-x-hidden selection:bg-[#22D3EE]/30 selection:text-white">
            <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.20),transparent_35%),#050816]">
              <Outlet />
              <Toaster theme="dark" position="top-center" richColors />
            </div>
          </div>
        </FeriaProvider>
      </GlobalNotificationsWrapper>
    </AuthProvider>
  );
}
