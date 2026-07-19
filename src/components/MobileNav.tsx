import React from 'react';
import { useHealth } from '../context/HealthContext';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  Activity, 
  Plus, 
  Trophy,
  FileText,
  Scale,
  HelpCircle,
  Calculator
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, isLoggedIn, currentUser } = useHealth();
  
  const role = isLoggedIn && currentUser ? currentUser.role : 'dokter';

  const centerAction = role === 'admin'
    ? { id: 'manual-entry' as ViewType, icon: Plus, title: 'Input Data' }
    : { id: 'consultation' as ViewType, icon: FileText, title: 'Catatan Medis' };

  const thirdTab = role === 'admin'
    ? { id: 'calculation-detail' as ViewType, label: 'Hitungan', icon: Calculator }
    : { id: 'analysis' as ViewType, label: 'Analisis', icon: Activity };

  const fourthTab = role === 'admin'
    ? { id: 'ahp-setup' as ViewType, label: 'Bobot AHP', icon: Scale }
    : { id: 'tutorial' as ViewType, label: 'Panduan', icon: HelpCircle };

  const tabs = [
    { id: 'dashboard' as ViewType, label: 'Utama', icon: LayoutDashboard },
    { id: 'ranking' as ViewType, label: 'Ranking', icon: Trophy },
    thirdTab,
    fourthTab,
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] border-t border-slate-200 flex justify-around items-center z-50">
      {tabs.slice(0, 2).map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            <IconComponent className="h-5 w-5" />
            <span className="text-[10px] font-bold mt-0.5">{tab.label}</span>
          </button>
        );
      })}

      {/* Central Floating Button */}
      <div className="relative -top-5 shrink-0 px-2">
        <button
          onClick={() => setActiveView(centerAction.id)}
          className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title={centerAction.title}
        >
          <centerAction.icon className="h-6 w-6" />
        </button>
      </div>

      {tabs.slice(2).map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full ${
              isActive ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            <IconComponent className="h-5 w-5" />
            <span className="text-[10px] font-bold mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
