import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { 
  Watch, 
  BatteryCharging, 
  Signal, 
  History, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ChevronRight, 
  Cpu, 
  Bluetooth, 
  ShieldCheck,
  RefreshCw,
  Activity
} from 'lucide-react';

export const DeviceView: React.FC = () => {
  const { 
    syncHistory, 
    syncDevice, 
    isSyncing, 
    deviceStatus, 
    selectedPatient,
    selectedPatientId,
    setSelectedPatientId,
    patients,
    isLoggedIn,
    setShowLoginModal,
    triggerToast
  } = useHealth();

  const [expandedHistory, setExpandedHistory] = useState<boolean>(false);

  const displayHistory = expandedHistory 
    ? syncHistory 
    : syncHistory.slice(0, 3);

  const [liveHR, setLiveHR] = useState<number>(selectedPatient?.heartRate || 70);
  const [liveBattery, setLiveBattery] = useState<number>(deviceStatus.battery || 84);
  const [liveSignal, setLiveSignal] = useState<string>(deviceStatus.signal || 'Kuat');

  useEffect(() => {
    if (selectedPatient) {
      setLiveHR(selectedPatient.heartRate);
    }
  }, [selectedPatient]);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Live Heart Rate Fluctuation
      setLiveHR(prev => {
        if (!selectedPatient) return prev;
        const base = selectedPatient.heartRate;
        const variance = Math.floor(Math.random() * 5) - 2; // Fluctuate -2 to +2
        return base + variance;
      });

      // 2. Live Signal Fluctuation (15% chance to change per tick)
      if (Math.random() > 0.85) {
        const r = Math.random();
        if (r > 0.9) setLiveSignal('Sedang');
        else if (r > 0.6) setLiveSignal('Sangat Kuat');
        else setLiveSignal('Kuat');
      }

      // 3. Live Battery Drain (5% chance to drop 1% per tick, simulating usage)
      if (Math.random() > 0.95) {
        setLiveBattery(prev => Math.max(1, prev - 1));
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [selectedPatient]);

  const handleDeviceSetup = () => {
    triggerToast('Pengaturan Perangkat: Membuka panel konfigurasi protokol sensor Apple Watch Series 9...', 'info');
  };

  const handleAlternativeConnect = (deviceName: string) => {
    triggerToast(`Menyambungkan perangkat: Memulai proses autentikasi OAuth / Bluetooth untuk mengintegrasikan ${deviceName} ke sistem CardioCare...`, 'info');
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Watch className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Integrasi Perangkat Terkunci</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Silakan masuk atau daftarkan akun Anda terlebih dahulu untuk mengintegrasikan smartwatch (Apple Watch, Fitbit, Garmin, dll.) dan menyinkronkan data kardiologi Anda secara otomatis.
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

  return (
    <div className="space-y-8 pb-12">
      {/* Header Block */}
      <div>
        <h1 className="font-sans text-2xl font-bold text-primary tracking-tight">Integrasi Perangkat</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-0.5">
          Kelola koneksi smartwatch Anda untuk pemantauan kesehatan real-time.
        </p>
      </div>

      {/* Bento Layout Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Primary Smartwatch Controller (col-span-8) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 flex flex-col md:flex-row gap-8 items-center shadow-sm">
          {/* Smartwatch High-Quality Image Asset */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-primary-container rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="w-44 h-44 md:w-56 md:h-56 relative z-10 flex items-center justify-center">
              <img 
                className="object-contain w-full h-full drop-shadow-2xl hover:scale-103 transition-transform duration-300" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHtzpa_q2hPJpltutENDfl1rc42XJ1VFNfqajWaIyN2OWk-MMkrJqGUcKcHVwLaQMM29Uxm8Jr3tigzZEHOrSH6kU7q-zV6WDg2BvX1vZJaQ0kWQQyFPbj-P0ly3tZYs8Ulg0H3pmFFuBu41Ij04CMUk6GU0pvPXuAm0nIBf6y79OVGLbyAJrd5q9iYrzdZIemCg_9CW5KAs-Y7L4WrfwFzDTdlcLCM_etzORqGHjGTun5qD9h9SHnrux_yKvV07PjDx0h4DZyRyQc" 
                alt="Smartwatch Sensor"
              />
            </div>
          </div>

          {/* Connected Device Details */}
          <div className="flex-1 space-y-5 text-center md:text-left w-full">
            <div>
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-ping"></span>
                Terhubung
              </span>
              <h3 className="font-sans text-xl font-bold text-primary">{deviceStatus.deviceName}</h3>
              <p className="text-xs text-on-surface-variant font-semibold mb-3">Sinkronisasi terakhir: {deviceStatus.lastSynced}</p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perangkat terpasang pada:</span>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer w-full max-w-[250px] font-bold shadow-sm"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Metrics / Batteries / Signal widgets */}
            <div className="grid grid-cols-3 gap-4 py-1">
              {/* Heart Rate Widget */}
              <div className="bg-red-50/60 rounded-xl p-3 border border-red-100 flex flex-col justify-center">
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-red-600 mb-1">
                  <Activity className="h-4 w-4 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Heart Rate</span>
                </div>
                <div className="text-2xl font-extrabold text-red-700 font-sans flex items-baseline gap-1 justify-center md:justify-start">
                  {liveHR} <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">BPM</span>
                </div>
              </div>

              <div className="bg-surface-container-low/60 rounded-xl p-3 border border-surface-container/20 flex flex-col justify-center">
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-primary mb-1">
                  <BatteryCharging className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Baterai</span>
                </div>
                <div className="text-2xl font-extrabold text-on-surface font-sans text-center md:text-left">{liveBattery}%</div>
              </div>
              
              <div className="bg-surface-container-low/60 rounded-xl p-3 border border-surface-container/20 flex flex-col justify-center">
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-primary mb-1">
                  <Signal className={`h-4 w-4 ${liveSignal === 'Sedang' ? 'text-yellow-500' : 'text-primary'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Sinyal</span>
                </div>
                <div className="text-2xl font-extrabold text-on-surface font-sans text-center md:text-left">{liveSignal}</div>
              </div>
            </div>

            {/* Trigger buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button 
                onClick={syncDevice}
                disabled={isSyncing}
                className={`flex-1 bg-primary hover:bg-primary/95 text-on-primary h-11 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow hover:shadow-md active:scale-98 transition-all ${
                  isSyncing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`h-4.5 w-4.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
              </button>
              
              <button 
                onClick={handleDeviceSetup}
                className="flex-1 border border-outline hover:bg-surface-container-low text-primary h-11 px-5 rounded-xl font-bold text-xs active:scale-98 transition-all"
              >
                Pengaturan Perangkat
              </button>
            </div>
          </div>
        </div>

        {/* Sync History Logs Card (col-span-4) */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-surface-container pb-2">
              <h4 className="font-sans text-sm font-bold text-primary flex items-center gap-1.5">
                <History className="h-4.5 w-4.5" />
                Riwayat Sinkronisasi
              </h4>
            </div>

            <div className={`space-y-3 pr-1 ${expandedHistory ? 'max-h-[300px] overflow-y-auto' : ''} [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full`}>
              {displayHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-surface-container hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.status === 'Berhasil' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {item.status === 'Berhasil' 
                        ? <CheckCircle className="h-4.5 w-4.5" /> 
                        : <AlertCircle className="h-4.5 w-4.5" />
                      }
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface leading-tight">
                        {item.status === 'Berhasil' ? 'Berhasil' : 'Gagal'}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/80 font-medium">{item.timestamp}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`text-[10px] font-bold ${
                      item.status === 'Berhasil' ? 'text-primary' : 'text-red-600'
                    }`}>
                      {item.status === 'Berhasil' ? `${item.vitalsCount} data vitals` : item.errorMsg}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setExpandedHistory(!expandedHistory)}
            className="mt-4 w-full py-2 bg-surface-container-low hover:bg-surface-container-high rounded-xl text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-surface-container-highest/30"
          >
            <span>{expandedHistory ? 'Sembunyikan Riwayat' : 'Lihat Semua Riwayat'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Alternative Connections Options */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Samsung Galaxy Watch */}
          <div 
            onClick={() => handleAlternativeConnect('Samsung Galaxy Watch')}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-surface-container rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Watch className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Tersedia</span>
            </div>
            <h5 className="font-sans text-sm font-bold text-primary">Samsung Galaxy Watch</h5>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-semibold">
              Integrasikan via Samsung Health Cloud untuk sinkronisasi otomatis harian.
            </p>
            <div className="flex items-center text-primary font-bold text-xs mt-4 group-hover:gap-1.5 transition-all">
              <span>Hubungkan Sekarang</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Android Health Connect */}
          <div 
            onClick={() => handleAlternativeConnect('Android Health Connect')}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-surface-container rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Tersedia</span>
            </div>
            <h5 className="font-sans text-sm font-bold text-primary">Android Health Connect</h5>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-semibold">
              Pusat data integratif untuk menyelaraskan ribuan aplikasi kebugaran Android.
            </p>
            <div className="flex items-center text-primary font-bold text-xs mt-4 group-hover:gap-1.5 transition-all">
              <span>Hubungkan Sekarang</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Custom Bluetooth Devices */}
          <div 
            onClick={() => handleAlternativeConnect('Perangkat Bluetooth Medis')}
            className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-surface-container rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Bluetooth className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Tersedia</span>
            </div>
            <h5 className="font-sans text-sm font-bold text-primary">Perangkat Bluetooth Khusus</h5>
            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-semibold">
              Sambungkan elektrokardiogram (ECG) genggam atau tensimeter lengan digital.
            </p>
            <div className="flex items-center text-primary font-bold text-xs mt-4 group-hover:gap-1.5 transition-all">
              <span>Cari Perangkat</span>
              <Bluetooth className="h-4 w-4 text-primary animate-pulse ml-1" />
            </div>
          </div>
        </div>

        {/* Smartwatch Data Integrity (TOPSIS Analytics) */}
        <div className="lg:col-span-12 glass-card p-5 rounded-2xl shadow-sm border border-surface-container-highest">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h4 className="font-sans text-sm font-bold text-primary">Status Integritas Data (TOPSIS)</h4>
              <p className="text-xs text-on-surface-variant font-semibold mt-0.5">
                Analisis kualitas dan akurasi data sensor Apple Watch dalam 24 jam terakhir.
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-fixed rounded-xl border border-primary/10">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              <span className="font-extrabold text-xs text-primary">Akurasi Sensor: 98.4%</span>
            </div>
          </div>

          {/* Metric grid progress bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-on-surface">
                <span>Heart Rate Precision</span>
                <span className="text-primary">92%</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden border border-surface-container">
                <div className="h-full bg-primary w-[92%] rounded-full"></div>
              </div>
            </div>
            
            {/* Metric 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-on-surface">
                <span>Oxygen Saturation</span>
                <span className="text-primary">88%</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden border border-surface-container">
                <div className="h-full bg-primary w-[88%] rounded-full"></div>
              </div>
            </div>
            
            {/* Metric 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-on-surface">
                <span>ECG Trace Clarity</span>
                <span className="text-primary">95%</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden border border-surface-container">
                <div className="h-full bg-primary w-[95%] rounded-full"></div>
              </div>
            </div>
            
            {/* Metric 4 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-on-surface">
                <span>Movement Artifacts</span>
                <span className="text-primary">15%</span>
              </div>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden border border-surface-container">
                <div className="h-full bg-primary w-[15%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
