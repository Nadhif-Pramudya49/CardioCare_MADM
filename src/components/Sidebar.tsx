import React from 'react';
import { useHealth } from '../context/HealthContext';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  FileEdit, 
  Activity, 
  Watch, 
  User, 
  RefreshCw, 
  HelpCircle, 
  LogOut,
  LogIn,
  Stethoscope
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, syncDevice, isSyncing, isLoggedIn, logout, setShowLoginModal, triggerToast, triggerConfirm } = useHealth();

  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'manual-entry' as ViewType, label: 'Input Data Mandiri', icon: FileEdit },
    { id: 'analysis' as ViewType, label: 'Analisis Risiko', icon: Activity },
    { id: 'device' as ViewType, label: 'Integrasi Smartwatch', icon: Watch },
    { id: 'consultation' as ViewType, label: 'Tanya Dokter', icon: Stethoscope },
    { id: 'profile' as ViewType, label: 'Profil Saya', icon: User },
  ];

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
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-0.5">Patient Portal</p>
          </div>
        </div>

        {/* Navigation Menu Header */}
        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest px-2 mb-2">
          Menu Portal
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md transition-all duration-200 text-left text-sm font-medium border ${
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
        {/* Sync Device Card styled with Professional Polish */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-800/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-xs font-semibold">Koneksi Smartwatch</span>
            <span className={`text-xs font-bold ${isLoggedIn ? 'text-green-400' : 'text-slate-500'}`}>
              {isLoggedIn ? 'Aktif' : 'Offline'}
            </span>
          </div>
          <button
            onClick={syncDevice}
            disabled={isSyncing || !isLoggedIn}
            className={`w-full py-2 px-3 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 ${
              !isLoggedIn 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50' 
                : 'bg-blue-600 hover:bg-blue-500'
            } ${isSyncing ? 'opacity-70' : ''}`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyingkronkan...' : 'Sinkronkan Jam'}</span>
          </button>
          <p className="text-[10px] text-slate-500 mt-2 font-semibold">
            {isLoggedIn ? 'Apple Watch Series 9' : 'Silakan login terlebih dahulu'}
          </p>
        </div>

        {/* Help Center and Logout/Login */}
        <div className="space-y-1">
          <button
            onClick={() => triggerToast('Pusat Bantuan: Silakan hubungi bagian pelayanan medis atau baca panduan di laman Smartwatch untuk bantuan teknis.', 'info')}
            className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-md transition-all text-left text-xs font-medium"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Pusat Bantuan</span>
          </button>
          
          {isLoggedIn ? (
            <button
              onClick={() => {
                triggerConfirm(
                  'Apakah Anda yakin ingin keluar dari portal kesehatan Anda? Semua data sesi lokal harian akan dibersihkan.',
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
              <span>Login Pasien</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
