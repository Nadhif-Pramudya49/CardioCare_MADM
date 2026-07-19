import React from 'react';
import { useHealth } from '../context/HealthContext';
import { Settings, LogIn, LogOut, User, Watch, HelpCircle, Info } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    selectedPatient,
    activeView,
    setActiveView,
    isLoggedIn,
    currentUser,
    logout,
    setShowLoginModal,
    triggerToast,
    triggerConfirm
  } = useHealth();

  const handleEmergencyClick = () => {
    if (!isLoggedIn) {
      triggerToast('Silakan login terlebih dahulu untuk mengaktifkan fitur peringatan.', 'warning');
      return;
    }
    triggerToast(`PERINGATAN! Sinyal atensi dikirimkan ke tim kardiologi untuk Pasien ${selectedPatient.name}.`, 'error');
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard Utama';
      case 'ranking':
        return 'Ranking Pasien';
      case 'manual-entry':
        return 'Data Master Pasien';
      case 'analysis':
        return 'Analisis Detail';
      case 'consultation':
        return 'Catatan Medis';
      case 'profile':
        return 'Profil Tenaga Medis';
      case 'ahp-setup':
        return 'Pengaturan Bobot AHP';
      case 'calculation-detail':
        return 'Detail Perhitungan TOPSIS';
      default:
        return 'CardioCare Portal';
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-8 h-16 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* View Title */}
      <div className="flex items-center gap-3">
        <h2 className="font-sans text-lg font-bold text-slate-800">{getViewTitle()}</h2>
        
        {/* Portal Mode Tag */}
        {isLoggedIn && currentUser ? (
          <div className="hidden sm:flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-700 capitalize">
              Mode: {currentUser.role}
            </span>
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
        
        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Mobile-only Action Icons */}
          <div className="md:hidden flex items-center gap-2">
            {/* Smartwatch Button (Admin Only) */}
            {isLoggedIn && currentUser?.role === 'admin' && (
              <button 
                onClick={() => setActiveView('device')}
                className={`p-2 rounded-full transition-all cursor-pointer ${activeView === 'device' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'}`}
                title="Integrasi Smartwatch"
              >
                <Watch className="h-5 w-5" />
              </button>
            )}

            {/* Tutorial Button */}
            <button 
              onClick={() => setActiveView('tutorial')}
              className={`p-2 rounded-full transition-all cursor-pointer ${activeView === 'tutorial' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'}`}
              title="Panduan Pengguna"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* About Button */}
            <button 
              onClick={() => setActiveView('about')}
              className={`p-2 rounded-full transition-all cursor-pointer ${activeView === 'about' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'}`}
              title="Tentang Sistem"
            >
              <Info className="h-5 w-5" />
            </button>

            {/* Divider */}
            <span className="w-px h-6 bg-slate-200 mx-1"></span>
          </div>

          {/* Login/Logout Profile Action */}
          {isLoggedIn && currentUser ? (
            <div className="flex items-center gap-2.5">
              
              <div className="hidden lg:flex flex-col text-right mr-1">
                <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{currentUser.role}</span>
              </div>

              {/* User Profile avatar */}
              <div 
                onClick={() => setActiveView('profile')}
                className="h-9 w-9 rounded-full overflow-hidden border-2 border-blue-600 hover:scale-105 transition-transform cursor-pointer shrink-0 bg-slate-100 flex items-center justify-center text-blue-600"
                title="Profil Saya"
              >
                {currentUser.role === 'dokter' ? (
                  <img 
                    className="w-full h-full object-cover" 
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&h=100&q=80" 
                    alt={currentUser.name}
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <button
                onClick={() => {
                  triggerConfirm('Apakah Anda yakin ingin keluar dari portal medis?', () => {
                    logout();
                  });
                }}
                className="hidden lg:flex items-center gap-1.5 py-1.5 px-3 hover:bg-slate-100 rounded-lg text-slate-600 text-xs font-semibold cursor-pointer shrink-0"
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
