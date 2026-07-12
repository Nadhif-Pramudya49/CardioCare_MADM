import React from 'react';
import { useHealth } from '../context/HealthContext';
import { ViewType } from '../types';
import { 
  LayoutDashboard, 
  Activity, 
  Plus, 
  FileEdit, 
  User,
  Stethoscope
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView } = useHealth();

  const tabs = [
    { id: 'dashboard' as ViewType, label: 'Utama', icon: LayoutDashboard },
    { id: 'consultation' as ViewType, label: 'Tanya Dokter', icon: Stethoscope },
    { id: 'analysis' as ViewType, label: 'Analisis', icon: Activity },
    { id: 'profile' as ViewType, label: 'Profil', icon: User },
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

      {/* Central Floating Button for Manual Entry */}
      <div className="relative -top-5 shrink-0 px-2">
        <button
          onClick={() => setActiveView('manual-entry')}
          className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          title="Input Data"
        >
          <Plus className="h-6 w-6" />
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
