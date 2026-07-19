import React, { useEffect } from 'react';
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

  // Auto-show login popup every 30 seconds when user is not logged in
  useEffect(() => {
    if (isLoggedIn) return;

    // Show immediately on first load if not logged in (after a short delay)
    const initialTimer = setTimeout(() => {
      if (!isLoggedIn) setShowLoginModal(true);
    }, 3000);

    // Then repeat every 30 seconds
    const interval = setInterval(() => {
      if (!isLoggedIn) setShowLoginModal(true);
    }, 30000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isLoggedIn]);

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
