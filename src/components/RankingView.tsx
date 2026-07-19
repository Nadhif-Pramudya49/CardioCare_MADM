import React from 'react';
import { useHealth } from '../context/HealthContext';
import { Trophy, ArrowRight, Activity, Users, FileBarChart2 } from 'lucide-react';
import { Patient } from '../types';

export const RankingView: React.FC = () => {
  const { patients, setActiveView, setSelectedPatientId, isLoggedIn, setShowLoginModal, currentUser } = useHealth();

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Akses Terkunci</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Silakan masuk menggunakan akun Tenaga Medis (Admin/Dokter) untuk melihat hasil perankingan pasien secara keseluruhan.
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98"
        >
          Masuk Akun Sekarang
        </button>
      </div>
    );
  }

  // Sort patients by rank ascending
  const rankedPatients = [...patients].sort((a, b) => (a.rank || 0) - (b.rank || 0));

  const handleViewDetail = (id: string) => {
    setSelectedPatientId(id);
    if (currentUser?.role === 'admin') {
      setActiveView('calculation-detail');
    } else {
      setActiveView('analysis');
    }
  };

  const getRiskStatus = (score: number) => {
    if (score >= 0.7) return { label: 'Risiko Tinggi', color: 'text-red-700 bg-red-50 border-red-200' };
    if (score >= 0.4) return { label: 'Risiko Sedang', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Risiko Rendah', color: 'text-green-700 bg-green-50 border-green-200' };
  };

  const getRecommendationColor = (rec?: string) => {
    if (rec === 'Penanganan Segera') return 'text-red-600 font-bold';
    if (rec === 'Perlu Konsultasi Lanjutan') return 'text-amber-600 font-bold';
    return 'text-green-600 font-medium';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            Dashboard Prioritas Pasien
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1 max-w-2xl leading-relaxed">
            Hasil akhir sistem rekomendasi medis berbasis MADM (AHP & TOPSIS). Daftar di bawah ini diurutkan berdasarkan tingkat urgensi penanganan (peringkat teratas memiliki risiko tertinggi).
          </p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setActiveView('ahp-setup')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 flex items-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <FileBarChart2 className="h-4 w-4 text-blue-500" />
            <span>Bobot AHP</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            Daftar Ranking Pasien Aktif ({rankedPatients.length})
          </h3>
          <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
            Diperbarui secara real-time
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-white border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider w-16 text-center">Rank</th>
                <th className="p-4 bg-white border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">ID Pasien & Nama Lengkap</th>
                <th className="p-4 bg-white border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">Kategori Risiko</th>
                <th className="p-4 bg-white border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Skor TOPSIS (Ci)</th>
                <th className="p-4 bg-white border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">Rekomendasi Tindakan</th>
                <th className="p-4 bg-white border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rankedPatients.map((patient, index) => {
                const isTop3 = index < 3;
                const riskInfo = getRiskStatus(patient.topsisScore || 0);

                return (
                  <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-4 align-middle text-center">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-black text-sm ${
                        isTop3 ? 'bg-red-100 text-red-600 border border-red-200 shadow-sm' : 'bg-slate-100 text-slate-500'
                      }`}>
                        #{patient.rank}
                      </div>
                    </td>
                    
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs border border-white shadow-sm shrink-0">
                          {patient.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{patient.name}</div>
                          <div className="text-[10px] font-medium text-slate-500 font-mono mt-0.5">{patient.id} • {patient.age} thn</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 align-middle">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${riskInfo.color}`}>
                        {riskInfo.label}
                      </span>
                    </td>

                    <td className="p-4 align-middle text-center">
                      <span className="font-mono text-sm font-black text-slate-700">
                        {(patient.topsisScore || 0).toFixed(4)}
                      </span>
                    </td>

                    <td className="p-4 align-middle">
                      <span className={`text-xs ${getRecommendationColor(patient.recommendation)}`}>
                        {patient.recommendation || '-'}
                      </span>
                    </td>

                    <td className="p-4 align-middle text-right">
                      <button
                        onClick={() => handleViewDetail(patient.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all cursor-pointer border border-blue-100 shadow-sm"
                        title="Lihat Detail Perhitungan"
                      >
                        <span>Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {rankedPatients.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              Belum ada data pasien yang dianalisis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
