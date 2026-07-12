import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Bell, Activity, Settings, ShieldAlert, LogIn, LogOut, Watch } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    selectedPatient,
    activeView,
    setActiveView,
    isLoggedIn,
    logout,
    deviceStatus,
    setShowLoginModal,
    triggerToast,
    triggerConfirm
  } = useHealth();

  const handleEmergencyClick = () => {
    if (!isLoggedIn) {
      triggerToast('Silakan login terlebih dahulu untuk mengaktifkan fitur panggilan darurat.', 'warning');
      return;
    }
    triggerToast(`DARURAT! Sinyal darurat medis kardiovaskular dikirimkan untuk Anda (${selectedPatient.name}). Tim kardiologi klinik telah dihubungi.`, 'error');
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard Utama';
      case 'manual-entry':
        return 'Input Data Mandiri';
      case 'analysis':
        return 'Analisis Risiko';
      case 'device':
        return 'Integrasi Smartwatch';
      case 'consultation':
        return 'Tanya Dokter';
      case 'profile':
        return 'Profil Saya';
      default:
        return 'CardioCare Portal';
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-8 h-16 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* View Title */}
      <div className="flex items-center gap-3">
        <h2 className="font-sans text-lg font-bold text-slate-800">{getViewTitle()}</h2>
        
        {/* Active Patient Pill Tag */}
        {isLoggedIn ? (
          <div className="hidden sm:flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-700">Pasien: {selectedPatient.name}</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
            <span className="text-xs font-semibold text-slate-500">Mode Tamu (Belum Login)</span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        
        {/* Smartwatch Connection Quick Status */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-semibold">
            <Watch className="h-3.5 w-3.5 text-blue-600" />
            <span>Watch: <strong className="text-green-600">Aktif</strong> ({deviceStatus.battery}%)</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Emergency Cardiac Trigger Button */}
          <button 
            onClick={handleEmergencyClick}
            className="p-2 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-all"
            title="DARURAT MEDIS!"
          >
            <ShieldAlert className="h-5 w-5 animate-bounce" />
          </button>

          {/* Notifications Button */}
          <button 
            onClick={() => {
              if (!isLoggedIn) {
                triggerToast('Silakan login untuk memantau notifikasi harian.', 'warning');
                return;
              }
              triggerToast('Pemberitahuan: Tidak ada anomali atau laporan medis baru harian.', 'success');
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-full transition-all relative"
            title="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            {isLoggedIn && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {/* Settings Button */}
          <button 
            onClick={() => setActiveView('analysis')}
            className="p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-full transition-all"
            title="Kriteria Risiko Jantung"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Divider */}
          <span className="w-px h-6 bg-slate-200 mx-1"></span>

          {/* Login/Logout Profile Action */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2.5">
              {/* User Profile avatar */}
              <div 
                onClick={() => setActiveView('profile')}
                className="h-9 w-9 rounded-full overflow-hidden border-2 border-blue-600 hover:scale-105 transition-transform cursor-pointer"
                title="Profil Saya"
              >
                <img 
                  className="w-full h-full object-cover" 
                  src={selectedPatient.avatarUrl} 
                  alt={selectedPatient.name}
                />
              </div>
              <button
                onClick={() => {
                  triggerConfirm('Apakah Anda yakin ingin keluar dari akun?', () => {
                    logout();
                  });
                }}
                className="hidden lg:flex items-center gap-1.5 py-1.5 px-3 hover:bg-slate-100 rounded-lg text-slate-600 text-xs font-semibold cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white py-1.5 px-4 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Masuk Akun</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
