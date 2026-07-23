import React from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { AlertBanner } from './components/AlertBanner';
import { DashboardView } from './components/DashboardView';
import { ManualEntryView } from './components/ManualEntryView';
import { AnalysisView } from './components/AnalysisView';
import { DeviceView } from './components/DeviceView';
import { ProfileView } from './components/ProfileView';
import { ConsultationView } from './components/ConsultationView';
import { ToastNotification } from './components/ToastNotification';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LoginModal } from './components/LoginModal';
import { AHPSetupView } from './components/AHPSetupView';
import { RankingView } from './components/RankingView';
import { CalculationDetailView } from './components/CalculationDetailView';
import { AboutSystemView } from './components/AboutSystemView';
import { TutorialView } from './components/TutorialView';

const LayoutShell: React.FC = () => {
  const { activeView, isLoggedIn, setShowLoginModal, showLoginModal } = useHealth();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'manual-entry':
        return <ManualEntryView />;
      case 'analysis':
        return <AnalysisView />;
      case 'device':
        return <DeviceView />;
      case 'consultation':
        return <ConsultationView />;
      case 'profile':
        return <ProfileView />;
      case 'ahp-setup':
        return <AHPSetupView />;
      case 'ranking':
        return <RankingView />;
      case 'calculation-detail':
        return <CalculationDetailView />;
      case 'about':
        return <AboutSystemView />;
      case 'tutorial':
        return <TutorialView />;
      default:
        return <DashboardView />;
    }
  };

  // --- HARD LOGIN GATE ---
  if (!isLoggedIn) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-md w-full">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">CardioCare</h1>
              <p className="text-blue-300 text-sm font-semibold mt-1">Sistem Pendukung Keputusan Medis</p>
            </div>
          </div>

          {/* Lock Card */}
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="w-14 h-14 bg-amber-500/20 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Akses Terbatas</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Sistem ini hanya dapat diakses oleh <strong className="text-white">tenaga medis terverifikasi</strong>. Silakan masuk menggunakan akun yang telah terdaftar.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" x2="3" y1="12" y2="12" />
              </svg>
              Masuk Sekarang
            </button>
          </div>

          {/* Footer note */}
          <p className="text-slate-600 text-xs">
            © 2025 CardioCare MADM — Sistem Prioritas Kardiovaskular
          </p>
        </div>

        {/* Login Modal */}
        <LoginModal />
        <ToastNotification />
        <ConfirmDialog />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-container-lowest text-on-surface">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header Navbar */}
        <Navbar />

        {/* Scrollable View Content Port */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 space-y-6 pb-24 md:pb-8 bg-surface-container-lowest/20">
          {/* Diagnostic warning alert banner */}
          <AlertBanner />

          {/* Active View Module */}
          <div className="animate-fade-in">
            {renderActiveView()}
          </div>
        </main>

        {/* Mobile Navigation bar */}
        <MobileNav />
      </div>

      {/* Custom Global Dialogs / Modals for Iframe Stability */}
      <ToastNotification />
      <ConfirmDialog />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <HealthProvider>
      <LayoutShell />
    </HealthProvider>
  );
}
