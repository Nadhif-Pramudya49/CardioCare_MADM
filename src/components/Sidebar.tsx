import React from 'react';
import { useHealth } from '../context/HealthContext';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  FileEdit, 
  Activity, 
  User, 
  HelpCircle, 
  LogOut,
  LogIn,
  FileText,
  Trophy,
  Scale,
  Calculator,
  Watch,
  Info
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, isLoggedIn, logout, setShowLoginModal, triggerToast, triggerConfirm, currentUser } = useHealth();

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard Utama', icon: LayoutDashboard, roles: ['admin', 'dokter'] },
    { id: 'manual-entry' as ViewType, label: 'Data Pasien', icon: FileEdit, roles: ['admin'] },
    { id: 'ahp-setup' as ViewType, label: 'Pengaturan Bobot AHP', icon: Scale, roles: ['admin'] },
    { id: 'ranking' as ViewType, label: 'Tabel Perankingan', icon: Trophy, roles: ['admin', 'dokter'] },
    { id: 'calculation-detail' as ViewType, label: 'Detail Perhitungan', icon: Calculator, roles: ['admin', 'dokter'] },
    { id: 'device' as ViewType, label: 'Integrasi Smartwatch', icon: Watch, roles: ['admin'] },
    { id: 'consultation' as ViewType, label: 'Catatan Medis', icon: FileText, roles: ['dokter'] },
    { id: 'analysis' as ViewType, label: 'Analisis Detail', icon: Activity, roles: ['dokter'] },
    { id: 'profile' as ViewType, label: 'Profil Saya', icon: User, roles: ['admin', 'dokter'] },
    { id: 'about' as ViewType, label: 'Tentang Sistem', icon: Info, roles: ['admin', 'dokter'] },
  ];

  // Filter based on currentUser role if logged in
  const visibleMenuItems = isLoggedIn && currentUser 
    ? menuItems.filter(item => item.roles.includes(currentUser.role))
    : menuItems.filter(item => item.roles.includes('dokter')); // Default guest view to dokter menus

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-slate-900 border-r border-slate-800 sticky top-0 py-6 px-4 shrink-0 justify-between text-slate-100">
      {/* Brand Header */}
      <div>
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-base font-bold leading-none select-none">favorite</span>
          </div>
          <div>
            <span className="font-sans text-lg font-bold text-white tracking-tight">CardioCare</span>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-0.5">Clinical Portal</p>
          </div>
        </div>

        {/* Navigation Menu Header */}
        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest px-2 mb-2">
          Menu Portal
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {visibleMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-all duration-200 text-left text-sm font-medium border cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 font-semibold shadow-sm'
                    : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <IconComponent className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls / Action Block */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        
        {/* Help Center and Logout/Login */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveView('tutorial')}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-all text-left text-xs font-medium cursor-pointer ${
              activeView === 'tutorial'
                ? 'bg-blue-600/10 text-blue-400 border-blue-600/20 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Panduan Penggunaan</span>
          </button>
          
          {isLoggedIn ? (
            <button
              onClick={() => {
                triggerConfirm(
                  'Apakah Anda yakin ingin keluar dari portal medis?',
                  () => logout()
                );
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-md transition-all text-left text-xs font-medium cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar Akun</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-3 w-full px-3 py-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/15 rounded-md transition-all text-left text-xs font-bold border border-blue-500/20 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Login Tenaga Medis</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
