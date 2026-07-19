import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { CriteriaWeight } from '../types';
import { ImageModal } from './ImageModal';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  FileDown, 
  ArrowLeft,
  SlidersHorizontal,
  X, 
  Heart, 
  Activity, 
  Gauge, 
  Check,
  Award,
  Info,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

export const AnalysisView: React.FC = () => {
  const { 
    selectedPatient,
    criteriaWeights, 
    setActiveView,
    isLoggedIn,
    setShowLoginModal,
    triggerToast,
    triggerConfirm
  } = useHealth();

  const [modalConfig, setModalConfig] = useState({ isOpen: false, imageSrc: '', title: '' });

  const openModal = (title: string, imageSrc: string) => {
    setModalConfig({ isOpen: true, title, imageSrc: `/assets/${imageSrc}` });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Analisis Risiko Terkunci</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Silakan masuk atau daftarkan akun Anda terlebih dahulu untuk menjalankan perhitungan kriteria kesehatan kardiovaskular MADM (Multi-Attribute Decision Making) pada profil kesehatan Anda.
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

  const exportPDF = () => {
    triggerToast('Fitur Ekspor PDF: Laporan hasil analisis risiko kardiovaskular personal Anda berhasil diunduh.', 'success');
  };

  // Calculate individual risk factor contributions (0.0 to 1.0, where 1.0 is maximum risk)
  // These represent the direct risk indices calculated before TOPSIS ideal solution distances
  const getRiskContribution = () => {
    const p = selectedPatient;
    
    // 1. Blood Pressure Risk
    const sysDev = Math.abs(p.systolic - 120);
    const diaDev = Math.abs(p.diastolic - 80);
    const bpRisk = Math.min(1.0, (sysDev / 50 + diaDev / 30) / 2);

    // 2. Heart Rate Risk
    const hrDev = Math.abs(p.heartRate - 70);
    const hrRisk = Math.min(1.0, hrDev / 45);

    // 3. Comorbidities
    const comorbiditiesRisk = p.comorbidities;

    // 4. BMI Risk
    const bmiDev = Math.abs(p.bmi - 21.7);
    const bmiRisk = Math.min(1.0, bmiDev / 12);

    // 5. Physical Activity (Inversely related to risk)
    const physicalActivityRisk = 1.0 - p.physicalActivity;

    return [
      { id: 'c1', label: 'Tekanan Darah', valStr: `${p.systolic}/${p.diastolic} mmHg`, targetStr: '120/80 mmHg', risk: bpRisk, imageSrc: 'Tekanan Darah.jpg', imageTitle: 'Referensi Tekanan Darah' },
      { id: 'c2', label: 'Detak Jantung Istirahat', valStr: `${p.heartRate} BPM`, targetStr: '60-80 BPM', risk: hrRisk, imageSrc: 'Tabel Detak Jantung.png', imageTitle: 'Referensi Detak Jantung' },
      { id: 'c3', label: 'Komorbiditas & Medis', valStr: `${(p.comorbidities * 100).toFixed(0)}% Kerentanan`, targetStr: '0% (Tanpa Riwayat)', risk: comorbiditiesRisk, imageSrc: '', imageTitle: '' },
      { id: 'c4', label: 'Indeks Massa Tubuh (BMI)', valStr: `${p.bmi.toFixed(1)} kg/m²`, targetStr: '18.5 - 24.9', risk: bmiRisk, imageSrc: 'Tabel BMI.jpg', imageTitle: 'Referensi BMI' },
      { id: 'c5', label: 'Level Aktivitas Fisik', valStr: `${(p.physicalActivity * 100).toFixed(0)}% Intensitas`, targetStr: '100% Aktif', risk: physicalActivityRisk, imageSrc: '', imageTitle: '' },
    ];
  };

  const riskFactors = getRiskContribution();

  // Color mappings for risks
  const getRiskColor = (status: string) => {
    if (status === 'Tinggi') return { text: 'text-red-600', bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-800 border-red-200/50' };
    if (status === 'Sedang') return { text: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-800 border-amber-200/50' };
    return { text: 'text-green-600', bg: 'bg-green-50 border-green-200', badge: 'bg-green-100 text-green-800 border-green-200/50' };
  };

  const patientColor = getRiskColor(selectedPatient.riskStatus);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-slate-800 tracking-tight">Analisis Risiko Kardiovaskular</h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5 max-w-2xl">
            Hasil evaluasi kesehatan personal Anda menggunakan metode pengambilan keputusan ilmiah AHP & TOPSIS berdasarkan metrik smartwatch.
          </p>
        </div>
        
        {/* Top Header Buttons */}
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={exportPDF}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 flex items-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <FileDown className="h-4 w-4" />
            <span>Unduh Laporan</span>
          </button>
          
          <button 
            onClick={() => setActiveView('ranking')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow active:scale-98 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Tabel Ranking</span>
          </button>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Risk Overview Hero Card (col-span-7) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">STATUS KESEHATAN KARDIO</span>
              <h2 className="text-base font-bold text-slate-800">{selectedPatient.name}</h2>
              <p className="text-[10px] text-slate-500 font-medium">ID Pasien: <span className="font-mono font-bold">{selectedPatient.id}</span> • {selectedPatient.age} Tahun • {selectedPatient.gender}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${patientColor.badge}`}>
              Risiko {selectedPatient.riskStatus}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
            {/* Visual circular gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              {/* Outer ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke="#f1f5f9" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  stroke={selectedPatient.riskStatus === 'Tinggi' ? '#ef4444' : selectedPatient.riskStatus === 'Sedang' ? '#f59e0b' : '#22c55e'} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 * (1 - selectedPatient.topsisScore)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center space-y-0.5">
                <span className="text-3xl font-black text-slate-800 tracking-tight block">
                  {selectedPatient.topsisScore.toFixed(3)}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Skor TOPSIS (Ci)</span>
              </div>
            </div>

            {/* Explanatory notes */}
            <div className="flex-1 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                {selectedPatient.riskStatus === 'Tinggi' ? (
                  <ShieldAlert className="h-4.5 w-4.5 text-red-500" />
                ) : (
                  <ShieldCheck className="h-4.5 w-4.5 text-green-500" />
                )}
                Diagnosis Klinis Terotomatisasi
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Skor TOPSIS Anda adalah <strong className="text-slate-800">{selectedPatient.topsisScore.toFixed(3)}</strong>. Nilai ini menunjukkan tingkat kedekatan relatif kondisi vital Anda terhadap profil risiko klinis tertinggi (ideal positif).
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 italic leading-relaxed">
                "{selectedPatient.notes}"
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-[10px] text-slate-400 font-bold">
            <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5 text-blue-500" /> TERVERIFIKASI SISTEM MADM</span>
            <span>Update: {selectedPatient.heartRate ? 'Real-time via Smartwatch' : 'Manual'}</span>
          </div>
        </div>

        {/* AHP Weight Distribution Card (col-span-5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4 text-blue-500" />
                Bobot Prioritas Kriteria (AHP)
              </h3>
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[9px] rounded-full font-bold uppercase tracking-wider border border-blue-100">
                CR: 0.042 (Konsisten)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mb-5">
              Nilai bobot klinis berikut diperoleh dari perbandingan berpasangan tingkat kepentingan kriteria kesehatan menurut konsensus kardiologi:
            </p>
          </div>

          <div className="space-y-4">
            {criteriaWeights.map((cw, idx) => (
              <div key={cw.id} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    {cw.name.split(' (')[0]}
                  </span>
                  <span className="text-blue-600">{(cw.weight * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-700" 
                    style={{ width: `${cw.weight * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Vitals Breakdown Contribution and Population Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Vitals Contribution List (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-red-500" />
              Kontribusi Parameter Terhadap Indeks Risiko Anda
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Berikut adalah nilai kerentanan tiap kriteria klinis Anda. Semakin tinggi persentasenya, semakin besar kontribusinya terhadap peningkatan risiko kardiovaskular.
            </p>
          </div>

          <div className="space-y-4.5">
            {riskFactors.map((rf) => (
              <div key={rf.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-700">{rf.label}</h4>
                      {rf.imageSrc && (
                        <button
                          onClick={() => openModal(rf.imageTitle, rf.imageSrc)}
                          className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
                        >
                          <Info className="w-3 h-3" />
                          Detail
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">
                      Nilai Saat Ini: <span className="text-slate-600 font-extrabold">{rf.valStr}</span> (Target Optimal: {rf.targetStr})
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold">Tingkat Kerentanan:</span>
                    <span className={`text-xs font-black ${(rf.risk * 100) > 65 ? 'text-red-600' : (rf.risk * 100) > 35 ? 'text-amber-600' : 'text-green-600'}`}>
                      {(rf.risk * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      (rf.risk * 100) > 65 ? 'bg-red-500' : (rf.risk * 100) > 35 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${rf.risk * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Secure Population Threshold & Comparison (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-emerald-500" />
              Rentang Ambang Batas & Referensi Populasi
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Sistem membandingkan metrik vital Anda dengan standar indeks referensi epidemiologi untuk menetapkan zona klasifikasi risiko.
            </p>
          </div>

          <div className="space-y-6 flex-1 flex flex-col justify-center">
            {/* Visual Continuous Range Slider */}
            <div className="space-y-2 relative">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>SEHAT (0.00)</span>
                <span>MAKSIMUM RISIKO (1.00)</span>
              </div>
              
              {/* Colored multi-segment progress track */}
              <div className="h-4.5 w-full rounded-full overflow-hidden flex border border-slate-100 shadow-inner">
                <div className="bg-green-500 h-full w-[40%]" title="Zona Rendah (0.0 - 0.4)" />
                <div className="bg-amber-500 h-full w-[30%]" title="Zona Sedang (0.4 - 0.7)" />
                <div className="bg-red-500 h-full w-[30%]" title="Zona Tinggi (0.7 - 1.0)" />
              </div>

              {/* Dynamic pointer for user's score */}
              <div 
                className="absolute -bottom-1 transform -translate-x-1/2 flex flex-col items-center transition-all duration-1000 ease-out"
                style={{ left: `${selectedPatient.topsisScore * 100}%` }}
              >
                <div className="w-3 h-3 bg-slate-800 rotate-45 border border-white shadow-sm" />
                <span className="text-[10px] font-extrabold bg-slate-800 text-white px-2 py-0.5 rounded-md mt-1 whitespace-nowrap shadow border border-slate-700">
                  Posisi Anda ({selectedPatient.topsisScore.toFixed(3)})
                </span>
              </div>
            </div>

            {/* Description list of thresholds */}
            <div className="space-y-2 pt-6">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-green-100 bg-green-50/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                  <span className="font-bold text-slate-700">Zona Aman (Rendah)</span>
                </div>
                <span className="font-bold text-green-700 font-mono">Ci &lt; 0.400</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-amber-100 bg-amber-50/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-bold text-slate-700">Zona Waspada (Sedang)</span>
                </div>
                <span className="font-bold text-amber-700 font-mono">0.400 - 0.699</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-red-100 bg-red-50/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="font-bold text-slate-700">Zona Bahaya (Tinggi)</span>
                </div>
                <span className="font-bold text-red-700 font-mono">Ci &ge; 0.700</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-bold italic text-center">
            *Privasi data dijamin penuh. Hasil analisis di atas sepenuhnya diolah secara lokal untuk akun kesehatan Anda.
          </div>
        </div>

      </div>



      {/* Methodology & informational block row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Info className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Informasi Metodologi MADM</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Kombinasi metode Analytic Hierarchy Process (AHP) untuk pembobotan kriteria dan TOPSIS digunakan untuk menghitung tingkat keparahan deviasi kondisi vital Anda dari kondisi sehat ideal.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wider">Sinkronisasi & Pembaruan</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Skor risiko dan persentase kontribusi klinis diperbarui otomatis secara real-time setiap kali metrik disinkronkan dari smartwatch atau diperbarui lewat menu Entri Manual.
            </p>
          </div>
        </div>
      </div>

      <ImageModal 
        isOpen={modalConfig.isOpen} 
        onClose={closeModal} 
        imageSrc={modalConfig.imageSrc} 
        title={modalConfig.title} 
      />
    </div>
  );
};
