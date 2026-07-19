import React, { useMemo } from 'react';
import { useHealth } from '../context/HealthContext';
import { 
  Users, 
  Activity, 
  AlertTriangle,
  ShieldCheck,
  Trophy,
  ArrowRight,
  TrendingUp,
  Stethoscope
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    patients,
    setActiveView,
    setSelectedPatientId,
    isLoggedIn,
    setShowLoginModal,
    currentUser
  } = useHealth();

  const stats = useMemo(() => {
    let highRisk = 0;
    let mediumRisk = 0;
    let lowRisk = 0;

    patients.forEach(p => {
      const score = p.topsisScore || 0;
      if (score >= 0.7) highRisk++;
      else if (score >= 0.4) mediumRisk++;
      else lowRisk++;
    });

    return { total: patients.length, highRisk, mediumRisk, lowRisk };
  }, [patients]);

  const topPatients = [...patients].sort((a, b) => (a.rank || 0) - (b.rank || 0)).slice(0, 3);

  if (!isLoggedIn) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md animate-fade-in">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-sans font-bold tracking-tight">Sistem Puskesmas CardioCare</h2>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed font-medium">
            Portal cerdas berbasis MADM (AHP & TOPSIS) untuk memprioritaskan penanganan medis pasien berdasarkan profil risiko kardiovaskular.
          </p>
        </div>
        <button 
          onClick={() => setShowLoginModal(true)} 
          className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all shadow-lg active:scale-95 cursor-pointer flex items-center gap-2"
        >
          <span>Masuk Sebagai Tenaga Medis</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Selamat datang, <span className="text-blue-600">{currentUser?.name}</span>!
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Berikut adalah ringkasan profil risiko kardiovaskular seluruh pasien aktif.
          </p>
        </div>
        <button
          onClick={() => setActiveView('ranking')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <Trophy className="w-4 h-4" />
          Lihat Peringkat Lengkap
        </button>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Pasien */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stats.total}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Pasien Aktif</p>
          </div>
        </div>

        {/* Risiko Tinggi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stats.highRisk}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Risiko Tinggi</p>
          </div>
        </div>

        {/* Risiko Sedang */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stats.mediumRisk}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Risiko Sedang</p>
          </div>
        </div>

        {/* Risiko Rendah */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stats.lowRisk}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Kondisi Terkontrol</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Priority List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              Pasien Prioritas Utama (Top 3)
            </h3>
          </div>
          
          <div className="divide-y divide-slate-100">
            {topPatients.map((patient, idx) => (
              <div key={patient.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-black flex items-center justify-center shrink-0 border border-red-200 shadow-sm text-sm">
                    #{patient.rank}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{patient.name}</h4>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">ID: {patient.id} • Skor: {(patient.topsisScore || 0).toFixed(4)}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPatientId(patient.id);
                    setActiveView('calculation-detail');
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                  title="Lihat Detail Analisis"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {topPatients.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm font-medium">
                Belum ada data pasien.
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
            <button
              onClick={() => setActiveView('ranking')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Lihat Seluruh Daftar Pasien &rarr;
            </button>
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="bg-blue-600 rounded-2xl shadow-sm border border-blue-700 p-6 text-white flex flex-col relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-lg">Catatan Medis</h3>
          </div>
          
          <p className="text-sm text-blue-100 leading-relaxed mb-6 font-medium">
            Gunakan fitur Catatan Medis untuk merekap rekam medis dan konsultasi pasien yang perlu penanganan lebih lanjut berdasarkan hasil evaluasi AHP dan TOPSIS.
          </p>

          <div className="mt-auto">
            <button
              onClick={() => setActiveView('consultation')}
              className="w-full py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Buka Catatan Medis
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};
