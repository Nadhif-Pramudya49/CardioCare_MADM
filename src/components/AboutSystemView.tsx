import React from 'react';
import { useHealth } from '../context/HealthContext';
import { BookOpen, Info, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export const AboutSystemView: React.FC = () => {
  const { setActiveView } = useHealth();

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Title block */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-sans text-2xl font-bold text-slate-800 tracking-tight">Tentang Sistem CardioCare MADM</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Penjelasan teknis dan landasan ilmiah metode pengambilan keputusan pada aplikasi medis ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - General Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full pointer-events-none -z-0"></div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3 relative z-10">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Latar Belakang
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed relative z-10">
              Sistem pendukung keputusan medis (*Clinical Decision Support System*) sangat penting dalam triase rumah sakit untuk memprioritaskan penanganan pasien kardiologi.
              CardioCare mengadopsi pendekatan <strong>MADM (Multi-Attribute Decision Making)</strong> hibrida untuk mengurangi bias dokter dan mempercepat proses evaluasi berdasarkan metrik *real-time*.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Metodologi AHP (Analytic Hierarchy Process)
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Dikembangkan oleh Thomas L. Saaty (1980), AHP digunakan untuk menentukan bobot relatif dari setiap kriteria kesehatan kardiovaskular. AHP memecah masalah yang kompleks menjadi suatu hierarki, lalu melakukan perbandingan berpasangan (*pairwise comparison*) antar kriteria.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                Memastikan konsistensi penilaian pakar (Consistency Ratio &lt; 0.10).
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></span>
                Menghasilkan bobot (*eigenvector*) yang akurat untuk setiap parameter klinis.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - TOPSIS & Criteria */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-blue-600" />
              Metodologi TOPSIS
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              *Technique for Order of Preference by Similarity to Ideal Solution* (Hwang & Yoon, 1981) digunakan pada tahap perankingan pasien. TOPSIS mengasumsikan bahwa pasien yang paling butuh penanganan adalah pasien yang memiliki jarak terpendek dari Solusi Ideal Negatif (kondisi terburuk) dan jarak terjauh dari Solusi Ideal Positif (kondisi paling sehat).
            </p>
            <button 
              onClick={() => setActiveView('calculation-detail')}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
            >
              Lihat Detail Perhitungan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-sm text-slate-100">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-400" />
              Kriteria Evaluasi
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-700 pb-2">
                <span className="font-semibold text-slate-300">C1. Tekanan Darah</span>
                <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-[10px] font-bold">COST</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-700 pb-2">
                <span className="font-semibold text-slate-300">C2. Detak Jantung (RHR)</span>
                <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-[10px] font-bold">COST</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-700 pb-2">
                <span className="font-semibold text-slate-300">C3. Komorbiditas</span>
                <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-[10px] font-bold">COST</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-700 pb-2">
                <span className="font-semibold text-slate-300">C4. Indeks Massa Tubuh</span>
                <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded text-[10px] font-bold">COST</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">C5. Aktivitas Fisik</span>
                <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-[10px] font-bold">BENEFIT</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-medium">
              Atribut *Cost* berarti semakin tinggi nilainya, semakin buruk kondisinya. Atribut *Benefit* berarti semakin tinggi nilainya, semakin baik kondisinya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
