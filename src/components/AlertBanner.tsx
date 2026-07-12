import React from 'react';
import { useHealth } from '../context/HealthContext';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export const AlertBanner: React.FC = () => {
  const { selectedPatient, setActiveView } = useHealth();

  const isHighRisk = selectedPatient.riskStatus === 'Tinggi' || selectedPatient.heartRate > 100 || selectedPatient.systolic >= 140;

  if (!isHighRisk) {
    // Return a beautiful, reassuring normal status bar instead of completely hiding it, 
    // which maintains the page structure nicely but keeps it clean!
    return (
      <div className="bg-green-50 text-green-800 p-4 rounded-2xl flex items-center justify-between shadow-sm border border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-100 text-green-700 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Status Kardiovaskular Aman</h3>
            <p className="text-xs text-green-700/85">
              Semua parameter vital dari {selectedPatient.name} berada dalam rentang normal yang direkomendasikan.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-green-700 bg-green-100/70 px-3 py-1 rounded-full uppercase">Optimal</span>
      </div>
    );
  }

  return (
    <div className="bg-error-container text-on-error-container p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm border border-error/20 transition-all duration-300">
      <div className="flex items-start md:items-center gap-4">
        <div className="w-12 h-12 bg-on-error-container text-error-container rounded-full flex items-center justify-center shrink-0 shadow-inner">
          <AlertTriangle className="h-6 w-6 text-error animate-pulse" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-base tracking-tight text-on-error-container">
            Peringatan: Anomali Ritme Jantung ({selectedPatient.id})
          </h3>
          <p className="text-sm text-on-error-container/90 leading-relaxed max-w-3xl">
            Detak jantung ({selectedPatient.heartRate} BPM) meningkat secara tiba-tiba di atas 110 BPM saat istirahat dengan tekanan darah {selectedPatient.systolic}/{selectedPatient.diastolic} mmHg. Mohon untuk segera duduk tenang dan lakukan pengukuran tekanan darah manual.
          </p>
        </div>
      </div>
      <button 
        onClick={() => setActiveView('analysis')}
        className="bg-on-error-container hover:bg-on-error-container/90 text-error-container hover:scale-102 active:scale-98 px-6 py-2.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition-all self-end md:self-center"
      >
        <span>Tinjau Data</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
