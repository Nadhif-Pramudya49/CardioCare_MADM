import React, { useEffect, useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { 
  Heart, 
  Gauge, 
  Wind, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  HelpCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    selectedPatient, 
    setActiveView, 
    deviceStatus, 
    triggerHeartRateFluctuation,
    isLoggedIn,
    login,
    triggerToast
  } = useHealth();

  const [hrHistory, setHrHistory] = useState<number[]>([
    40, 45, 38, 50, 65, 55, 60, 45, 50, 70, 85, 75, 60, 65
  ]);
  const [chartRange, setChartRange] = useState<'1H' | '6H' | '24H'>('1H');

  // Set up minor live fluctuations on the heart rate sparkline to make the medical feed feel alive
  useEffect(() => {
    if (!deviceStatus.isConnected) return; // Stop fluctuations if device is disconnected

    const interval = setInterval(() => {
      triggerHeartRateFluctuation();
      // Fluctuate sparkline history slightly as well
      setHrHistory(prev => {
        const next = [...prev.slice(1)];
        const lastVal = prev[prev.length - 1];
        const change = Math.floor(Math.random() * 9) - 4; // +-4
        let newVal = lastVal + change;
        if (selectedPatient.id === '#P-8821') {
          newVal = Math.max(70, Math.min(100, newVal)); // high risk Budi
        } else {
          newVal = Math.max(40, Math.min(65, newVal)); // stable
        }
        next.push(newVal);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedPatient.id, deviceStatus.isConnected, triggerHeartRateFluctuation]);

  // BP clinical categorization
  const getBPCategory = (sys: number, dia: number) => {
    if (sys >= 140 || dia >= 90) return { label: 'Kategori: Hipertensi (Tinggi)', color: 'text-error bg-error-container/40', badge: 'KRITIS' };
    if (sys >= 130 || dia >= 85) return { label: 'Kategori: Pre-Hipertensi', color: 'text-orange-600 bg-orange-100', badge: 'WASPADA' };
    return { label: 'Kategori: Normal (Optimal)', color: 'text-primary bg-surface-container', badge: 'OPTIMAL' };
  };

  const bpCat = getBPCategory(selectedPatient.systolic, selectedPatient.diastolic);

  // SpO2 mock metrics
  const spo2Val = !deviceStatus.isConnected ? '--' : (selectedPatient.id === '#P-8821' ? 95 : selectedPatient.id === '#P-8824' ? 97 : 98);

  // Active steps mock data
  const getActiveMetrics = () => {
    if (!deviceStatus.isConnected) {
      return { steps: '0', calories: '0', distance: '0.0', percent: 0, status: 'Tidak ada data smartwatch' };
    }
    if (selectedPatient.id === '#P-8821') {
      return { steps: '8.420', calories: '425', distance: '5.2', percent: 75, status: 'Berjalan santai (15 menit)' };
    }
    if (selectedPatient.id === '#P-8822') {
      return { steps: '10.250', calories: '510', distance: '6.8', percent: 102, status: 'Berlari pagi (30 menit)' };
    }
    if (selectedPatient.id === '#P-8823') {
      return { steps: '14.890', calories: '720', distance: '10.1', percent: 148, status: 'Latihan intensif kardiologi' };
    }
    return { steps: '6.120', calories: '310', distance: '3.9', percent: 61, status: 'Jalan santai sore' };
  };

  const activeMetrics = getActiveMetrics();

  return (
    <div className="space-y-8 pb-12">
      {/* Guest Mode Hero Banner */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md animate-fade-in">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl sm:text-2xl font-sans font-bold tracking-tight">Selamat Datang di CardioCare Portal!</h2>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed font-medium">
              Aplikasi pantauan kesehatan kardiovaskular harian Anda. Hubungkan smartwatch Anda (Apple Watch/Fitbit) atau masuk ke akun Anda untuk memuat data kesehatan klinis secara otomatis tanpa repot mengetik manual.
            </p>
          </div>
          <button 
            onClick={() => login()} 
            className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all shadow-lg active:scale-95 cursor-pointer hover:scale-102 flex items-center gap-2"
          >
            <span>Masuk Sekarang (Data Default)</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Real-time synchronization banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-surface-container-highest/40 pb-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-primary tracking-tight">Ringkasan Kesehatan Real-time</h1>
          <p className="text-sm text-on-surface-variant font-medium">Pantauan sinkronisasi otomatis dari Smartwatch v.4.0</p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            isLoggedIn && deviceStatus.isConnected
              ? 'bg-surface-container text-primary border-primary/10' 
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isLoggedIn && deviceStatus.isConnected ? 'bg-primary animate-ping' : 'bg-slate-400'}`}></span>
            {isLoggedIn && deviceStatus.isConnected ? 'Terhubung' : 'Terputus (Offline)'}
          </span>
          <span className="text-on-surface-variant text-xs font-medium flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Update: {isLoggedIn && deviceStatus.isConnected ? deviceStatus.lastSynced : 'Belum disinkronisasi'}
          </span>
        </div>
      </div>

      {/* Bento Grid Vitals Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Heart Rate Card */}
        <div className="md:col-span-6 lg:col-span-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider block mb-1">Detak Jantung</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-primary tracking-tight font-sans">
                  {deviceStatus.isConnected ? selectedPatient.heartRate : '--'}
                </span>
                <span className="text-xs text-on-surface-variant font-bold">BPM</span>
              </div>
            </div>
            <div className="bg-surface-container p-2.5 rounded-xl text-primary shadow-inner">
              <Heart className="h-5 w-5 fill-primary" />
            </div>
          </div>

          {/* Sparkline Visual Component */}
          <div className="h-16 flex items-end gap-[3px] mb-4 pt-2">
            {hrHistory.map((height, idx) => (
              <div
                key={idx}
                className="flex-1 bg-primary-container rounded-t-sm transition-all duration-500 hover:bg-primary"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-surface-variant/40 text-xs font-medium">
            <span className="text-on-surface-variant">Trend 30m terakhir</span>
            {selectedPatient.riskStatus === 'Tinggi' ? (
              <span className="text-error font-bold flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" /> +12% naik
              </span>
            ) : (
              <span className="text-green-600 font-bold flex items-center gap-0.5">
                <TrendingDown className="h-3.5 w-3.5" /> Stabil
              </span>
            )}
          </div>
        </div>

        {/* Blood Pressure Card */}
        <div className="md:col-span-6 lg:col-span-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider block mb-1">Tekanan Darah</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-primary tracking-tight font-sans">
                  {selectedPatient.systolic}/{selectedPatient.diastolic}
                </span>
                <span className="text-xs text-on-surface-variant font-bold">mmHg</span>
              </div>
            </div>
            <div className="bg-surface-container p-2.5 rounded-xl text-primary shadow-inner">
              <Gauge className="h-5 w-5" />
            </div>
          </div>

          {/* Linear Progress Bar */}
          <div className="flex flex-col gap-2 mb-4 pt-2">
            <div className="w-full bg-surface-container rounded-full h-3.5 overflow-hidden border border-surface-container-highest/20">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  selectedPatient.systolic >= 140 ? 'bg-error' :
                  selectedPatient.systolic >= 130 ? 'bg-orange-500' :
                  'bg-primary'
                }`}
                style={{ width: `${Math.min(100, (selectedPatient.systolic / 180) * 100)}%` }}
              ></div>
            </div>
            <span className="text-xs text-on-surface-variant font-semibold">{bpCat.label}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-surface-variant/40 text-xs font-medium">
            <span className="text-on-surface-variant">Status Tekanan Darah</span>
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
              selectedPatient.systolic >= 140 ? 'bg-error-container text-error' :
              selectedPatient.systolic >= 130 ? 'bg-orange-100 text-orange-700' :
              'bg-green-100 text-green-700'
            }`}>
              {bpCat.badge}
            </span>
          </div>
        </div>

        {/* Blood Oxygen Card */}
        <div className="md:col-span-6 lg:col-span-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider block mb-1">Saturasi Oksigen (SpO2)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-primary tracking-tight font-sans">{spo2Val}</span>
                <span className="text-xs text-on-surface-variant font-bold">%</span>
              </div>
            </div>
            <div className="bg-surface-container p-2.5 rounded-xl text-primary shadow-inner">
              <Wind className="h-5 w-5" />
            </div>
          </div>

          {/* Semicircular Ring Visual */}
          <div className="flex items-center justify-center py-2 h-16">
            <div className="relative w-28 h-14 overflow-hidden">
              <div className="absolute top-0 left-0 w-28 h-28 rounded-full border-8 border-surface-container"></div>
              <div 
                className={`absolute top-0 left-0 w-28 h-28 rounded-full border-8 border-b-transparent border-r-transparent transition-all duration-1000 ${
                  spo2Val < 95 ? 'border-error' : 'border-primary'
                }`}
                style={{ transform: `rotate(${135 + (spo2Val - 85) * 6}deg)` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-surface-variant/40 text-xs font-medium">
            <span className="text-on-surface-variant">Saturasi Oksigen</span>
            <span className={`font-bold ${spo2Val < 95 ? 'text-error' : 'text-primary'}`}>
              {spo2Val < 95 ? 'Rendah (Hipoksia)' : 'Sangat Sehat'}
            </span>
          </div>
        </div>

        {/* Activity Status Card (Wide: col-span-8) */}
        <div className="md:col-span-12 lg:col-span-8 bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-6 border border-primary-container/20">
          {/* Circular Progress SVG */}
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                className="text-surface-container" 
                cx="56" 
                cy="56" 
                fill="transparent" 
                r="48" 
                stroke="currentColor" 
                strokeWidth="8"
              />
              <circle 
                className="text-primary transition-all duration-1000" 
                cx="56" 
                cy="56" 
                fill="transparent" 
                r="48" 
                stroke="currentColor" 
                strokeWidth="8"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 - (301.6 * Math.min(100, activeMetrics.percent)) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-primary">{activeMetrics.percent}%</span>
              <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Target</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                  <Activity className="h-4.5 w-4.5" />
                  Status Aktivitas
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">Aktivitas sedang: {activeMetrics.status}</p>
              </div>
              <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                Aktif
              </span>
            </div>

            {/* Steps / Calories / Distance bento row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-container-low/60 p-3 rounded-xl border border-surface-container/20">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Langkah</span>
                <span className="text-base font-extrabold text-primary">{activeMetrics.steps}</span>
              </div>
              <div className="bg-surface-container-low/60 p-3 rounded-xl border border-surface-container/20">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Kalori</span>
                <span className="text-base font-extrabold text-primary">{activeMetrics.calories} <small className="text-[10px] font-medium">kcal</small></span>
              </div>
              <div className="bg-surface-container-low/60 p-3 rounded-xl border border-surface-container/20">
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Jarak</span>
                <span className="text-base font-extrabold text-primary">{activeMetrics.distance} <small className="text-[10px] font-medium">km</small></span>
              </div>
            </div>
          </div>
        </div>

        {/* Skor Kesehatan MADM Card (Sidebar: col-span-4) */}
        <div className="md:col-span-12 lg:col-span-4 bg-primary p-5 rounded-2xl shadow-lg text-on-primary flex flex-col justify-between hover:scale-101 transition-transform relative overflow-hidden">
          {/* Abstract background badge */}
          <div className="absolute right-[-10px] top-[-10px] opacity-10">
            <Activity className="h-32 w-32" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              Skor Kesehatan MADM
            </h3>
            <p className="text-xs text-primary-fixed font-medium mt-1 opacity-90 leading-relaxed">
              Analisis AHP &amp; TOPSIS berdasarkan metrik gabungan hari ini.
            </p>
            
            <div className="text-center py-4 my-2">
              <div className="text-5xl font-extrabold leading-none tracking-tight font-sans">
                {selectedPatient.topsisScore}
              </div>
              <div className="text-[10px] font-bold text-primary-fixed uppercase tracking-widest mt-2">
                Indeks Kondisi Jantung
              </div>
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="opacity-80">Prediksi Stabilitas</span>
              <span className="font-bold">{selectedPatient.riskStatus === 'Tinggi' ? 'Rendah (Kritis)' : 'Tinggi'}</span>
            </div>
            
            {/* Linear stability progress */}
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000" 
                style={{ width: `${Math.round((1 - selectedPatient.topsisScore) * 100)}%` }}
              ></div>
            </div>
            
            <button 
              onClick={() => setActiveView('analysis')}
              className="w-full mt-2 py-2.5 bg-white text-primary rounded-xl text-xs font-bold hover:bg-surface-bright active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <span>Lihat Analisis Detail</span>
            </button>
          </div>
        </div>

      </div>

      {/* Secondary Row: Detailed History Chart */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
            <Clock className="h-5 w-5" />
            Riwayat Detak Jantung (24 Jam Terakhir)
          </h3>
          <div className="flex gap-1.5 bg-surface-container-low p-1 rounded-lg border border-surface-container">
            <button 
              onClick={() => { setChartRange('1H'); triggerToast('Menampilkan data detak jantung 1 jam terakhir.', 'info'); }} 
              className={`px-3.5 py-1 shadow-sm rounded-md text-xs font-bold transition-all ${chartRange === '1H' ? 'bg-white text-primary' : 'text-on-surface-variant hover:text-primary bg-transparent'}`}
            >
              1 Jam
            </button>
            <button 
              onClick={() => { setChartRange('6H'); triggerToast('Riwayat jangka menengah (6 Jam) berhasil dimuat.', 'info'); }} 
              className={`px-3.5 py-1 shadow-sm rounded-md text-xs font-bold transition-all ${chartRange === '6H' ? 'bg-white text-primary' : 'text-on-surface-variant hover:text-primary bg-transparent'}`}
            >
              6 Jam
            </button>
            <button 
              onClick={() => { setChartRange('24H'); triggerToast('Riwayat jangka panjang (24 Jam) direkapitulasi.', 'info'); }} 
              className={`px-3.5 py-1 shadow-sm rounded-md text-xs font-bold transition-all ${chartRange === '24H' ? 'bg-white text-primary' : 'text-on-surface-variant hover:text-primary bg-transparent'}`}
            >
              24 Jam
            </button>
          </div>
        </div>

        {/* CSS-bar based chart simulation */}
        <div className="h-64 w-full relative flex items-end justify-between px-2 pb-8 border-b border-surface-variant/30">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
            <div className="border-t border-surface-variant/15 w-full h-px"></div>
            <div className="border-t border-surface-variant/15 w-full h-px"></div>
            <div className="border-t border-surface-variant/15 w-full h-px"></div>
            <div className="border-t border-surface-variant/15 w-full h-px"></div>
          </div>

          {/* Individual bar visualization */}
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '60%' }}></div>
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '55%' }}></div>
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '62%' }}></div>
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '70%' }}></div>
          <div className="w-6 bg-primary rounded-t-lg transition-all" style={{ height: '85%' }}></div>
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '75%' }}></div>
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '68%' }}></div>
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '62%' }}></div>
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '58%' }}></div>
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '60%' }}></div>
          <div className="w-6 bg-primary/20 rounded-t-lg transition-all hover:bg-primary" style={{ height: '55%' }}></div>
          <div className="w-6 bg-primary-container rounded-t-lg transition-all hover:bg-primary" style={{ height: `${selectedPatient.heartRate - 20}%` }}></div>
        </div>

        {/* Time Labels */}
        <div className="flex justify-between mt-3 text-xs font-semibold text-on-surface-variant">
          <span>{chartRange === '1H' ? '08:00' : chartRange === '6H' ? '03:00' : 'Kemarin'}</span>
          <span>{chartRange === '1H' ? '12:00' : chartRange === '6H' ? '06:00' : '06:00'}</span>
          <span>{chartRange === '1H' ? '16:00' : chartRange === '6H' ? '09:00' : '12:00'}</span>
          <span>{chartRange === '1H' ? '20:00' : chartRange === '6H' ? '12:00' : '18:00'}</span>
          <span className="text-primary font-bold">Sekarang ({selectedPatient.heartRate} BPM)</span>
        </div>
      </section>
    </div>
  );
};
