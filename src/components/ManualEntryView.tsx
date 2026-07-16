import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { ShieldAlert, History, Activity, Sparkles, Check, Info } from 'lucide-react';
import { ImageModal } from './ImageModal';

export const ManualEntryView: React.FC = () => {
  const { selectedPatient, addManualEntry, isLoggedIn, setShowLoginModal, triggerConfirm, triggerToast, setActiveView } = useHealth();

  // Populate form with current selected patient's values initially
  const [systolic, setSystolic] = useState<number>(selectedPatient ? selectedPatient.systolic : 120);
  const [diastolic, setDiastolic] = useState<number>(selectedPatient ? selectedPatient.diastolic : 80);
  const [cholesterol, setCholesterol] = useState<number>(selectedPatient ? selectedPatient.cholesterol : 180);
  const [bloodSugar, setBloodSugar] = useState<number>(selectedPatient ? selectedPatient.bloodSugar : 100);
  const [chestPain, setChestPain] = useState<boolean>(selectedPatient ? selectedPatient.symptoms.includes('Nyeri Dada (Chest Pain)') : false);
  const [shortnessOfBreath, setShortnessOfBreath] = useState<boolean>(selectedPatient ? selectedPatient.symptoms.includes('Sesak Napas (Shortness of Breath)') : false);
  const [palpitation, setPalpitation] = useState<boolean>(selectedPatient ? selectedPatient.symptoms.includes('Palpitasi Jantung') : false);
  const [extremeFatigue, setExtremeFatigue] = useState<boolean>(selectedPatient ? selectedPatient.symptoms.includes('Kelelahan Ekstrim') : false);
  const [notes, setNotes] = useState<string>(selectedPatient ? (selectedPatient.notes || '') : '');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [hasSavedSession, setHasSavedSession] = useState<boolean>(false);
  const [lastEntry, setLastEntry] = useState({
    date: '12 Okt 2023',
    score: 0.84
  });

  const [modalConfig, setModalConfig] = useState({ isOpen: false, imageSrc: '', title: '' });
  
  const openModal = (title: string, imageSrc: string) => {
    setModalConfig({ isOpen: true, title, imageSrc: `/assets/${imageSrc}` });
  };
  
  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  // Keep form in sync if user changes patient via navbar dropdown
  useEffect(() => {
    if (!selectedPatient) return;
    setSystolic(selectedPatient.systolic);
    setDiastolic(selectedPatient.diastolic);
    setCholesterol(selectedPatient.cholesterol);
    setBloodSugar(selectedPatient.bloodSugar);
    setChestPain(selectedPatient.symptoms.includes('Nyeri Dada (Chest Pain)'));
    setShortnessOfBreath(selectedPatient.symptoms.includes('Sesak Napas (Shortness of Breath)'));
    setPalpitation(selectedPatient.symptoms.includes('Palpitasi Jantung'));
    setExtremeFatigue(selectedPatient.symptoms.includes('Kelelahan Ekstrim'));
    setNotes(selectedPatient.notes || '');
  }, [selectedPatient]);

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Input Data Terkunci</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Silakan masuk atau daftarkan akun Anda terlebih dahulu untuk mencatat data vital harian Anda secara mandiri dan mengalkulasi tingkat risiko kardiovaskular secara akurat.
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      // Save data via context
      addManualEntry({
        systolic: Number(systolic),
        diastolic: Number(diastolic),
        cholesterol: Number(cholesterol),
        bloodSugar: Number(bloodSugar),
        symptoms: {
          chestPain,
          shortnessOfBreath,
          palpitation,
          extremeFatigue
        },
        notes
      });

      // Update last entry informational widget
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
      
      setLastEntry({
        date: dateStr,
        score: selectedPatient.topsisScore
      });

      setIsSaving(false);
      setSaveSuccess(true);
      setHasSavedSession(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleCancel = () => {
    triggerConfirm('Batalkan pengisian form? Semua perubahan yang belum disimpan akan hilang.', () => {
      // Reset form to patient's current values
      setSystolic(selectedPatient.systolic);
      setDiastolic(selectedPatient.diastolic);
      setCholesterol(selectedPatient.cholesterol);
      setBloodSugar(selectedPatient.bloodSugar);
      setChestPain(selectedPatient.symptoms.includes('Nyeri Dada (Chest Pain)'));
      setShortnessOfBreath(selectedPatient.symptoms.includes('Sesak Napas (Shortness of Breath)'));
      setPalpitation(selectedPatient.symptoms.includes('Palpitasi Jantung'));
      setExtremeFatigue(selectedPatient.symptoms.includes('Kelelahan Ekstrim'));
      setNotes(selectedPatient.notes || '');
      triggerToast('Pengisian form dibatalkan.', 'info');
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div>
        <h1 className="font-sans text-2xl font-bold text-primary tracking-tight">Entri Kesehatan Harian</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-0.5">
          Catat metrik vital Anda secara akurat untuk mendukung analisis algoritma TOPSIS.
        </p>
      </div>

      {/* Main Form Input Panel */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8" id="healthDataForm">
          
          {/* Section: Blood Pressure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full border-b border-surface-container-highest pb-2 mb-2">
              <h3 className="font-sans text-base font-bold text-primary flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Tekanan Darah
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Sistolik (mmHg)
                </label>
                <button 
                  type="button" 
                  onClick={() => openModal('Referensi Tekanan Darah', 'Tabel Tekanan Darah.jpg')}
                  className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
                >
                  <Info className="w-3 h-3" />
                  Detail
                </button>
              </div>
              <input 
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                placeholder="Contoh: 120"
                required
                className="w-full h-11 px-4 bg-white border border-outline-variant rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Diastolik (mmHg)
                </label>
                <button 
                  type="button" 
                  onClick={() => openModal('Referensi Tekanan Darah', 'Tekanan Darah.jpg')}
                  className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
                >
                  <Info className="w-3 h-3" />
                  Detail
                </button>
              </div>
              <input 
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                placeholder="Contoh: 80"
                required
                className="w-full h-11 px-4 bg-white border border-outline-variant rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Section: Biomarkers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full border-b border-surface-container-highest pb-2 mb-2">
              <h3 className="font-sans text-base font-bold text-primary flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Biomarker Darah
              </h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Kolesterol Total (mg/dL)
                </label>
                <button 
                  type="button" 
                  onClick={() => openModal('Referensi Kadar Kolesterol', 'tabel kolesterol.jpg')}
                  className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
                >
                  <Info className="w-3 h-3" />
                  Detail
                </button>
              </div>
              <input 
                type="number"
                value={cholesterol}
                onChange={(e) => setCholesterol(Number(e.target.value))}
                placeholder="Contoh: 180"
                required
                className="w-full h-11 px-4 bg-white border border-outline-variant rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Gula Darah (mg/dL)
                </label>
                <button 
                  type="button" 
                  onClick={() => openModal('Referensi Gula Darah', 'tabel gula darah.png')}
                  className="flex items-center gap-1 text-[10px] font-semibold text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded transition-colors"
                >
                  <Info className="w-3 h-3" />
                  Detail
                </button>
              </div>
              <input 
                type="number"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(Number(e.target.value))}
                placeholder="Contoh: 95"
                required
                className="w-full h-11 px-4 bg-white border border-outline-variant rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Section: Symptoms */}
          <div className="space-y-4">
            <div className="border-b border-surface-container-highest pb-2 mb-2">
              <h3 className="font-sans text-base font-bold text-primary flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" />
                Catatan Gejala Harian
              </h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-3 border rounded-xl hover:bg-surface-container transition-all cursor-pointer group ${
                chestPain ? 'border-primary bg-primary-container/10' : 'border-outline-variant/70'
              }`}>
                <input 
                  type="checkbox"
                  checked={chestPain}
                  onChange={(e) => setChestPain(e.target.checked)}
                  className="w-5 h-5 rounded text-primary border-outline-variant focus:ring-primary"
                />
                <span className="text-sm font-semibold text-on-surface">Nyeri Dada</span>
              </label>
              
              <label className={`flex items-center gap-3 p-3 border rounded-xl hover:bg-surface-container transition-all cursor-pointer group ${
                shortnessOfBreath ? 'border-primary bg-primary-container/10' : 'border-outline-variant/70'
              }`}>
                <input 
                  type="checkbox"
                  checked={shortnessOfBreath}
                  onChange={(e) => setShortnessOfBreath(e.target.checked)}
                  className="w-5 h-5 rounded text-primary border-outline-variant focus:ring-primary"
                />
                <span className="text-sm font-semibold text-on-surface">Sesak Napas</span>
              </label>
              
              <label className={`flex items-center gap-3 p-3 border rounded-xl hover:bg-surface-container transition-all cursor-pointer group ${
                palpitation ? 'border-primary bg-primary-container/10' : 'border-outline-variant/70'
              }`}>
                <input 
                  type="checkbox"
                  checked={palpitation}
                  onChange={(e) => setPalpitation(e.target.checked)}
                  className="w-5 h-5 rounded text-primary border-outline-variant focus:ring-primary"
                />
                <span className="text-sm font-semibold text-on-surface">Palpitasi Jantung</span>
              </label>
              
              <label className={`flex items-center gap-3 p-3 border rounded-xl hover:bg-surface-container transition-all cursor-pointer group ${
                extremeFatigue ? 'border-primary bg-primary-container/10' : 'border-outline-variant/70'
              }`}>
                <input 
                  type="checkbox"
                  checked={extremeFatigue}
                  onChange={(e) => setExtremeFatigue(e.target.checked)}
                  className="w-5 h-5 rounded text-primary border-outline-variant focus:ring-primary"
                />
                <span className="text-sm font-semibold text-on-surface">Kelelahan Ekstrim</span>
              </label>
            </div>

            {/* Additional notes */}
            <div className="space-y-2 mt-4">
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Catatan Tambahan Klinis
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jelaskan lebih detail kondisi Anda hari ini..."
                rows={4}
                className="w-full p-4 border border-outline-variant rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none resize-none transition-all bg-white"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-surface-container-highest/45">
            {hasSavedSession && (
              <button 
                type="button"
                onClick={() => setActiveView('analysis')}
                className="px-6 py-2.5 h-11 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-200"
              >
                Lihat Hasil Analisis
              </button>
            )}
            <button 
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2.5 h-11 text-xs font-bold text-primary hover:bg-surface-container-high rounded-xl transition-all"
            >
              Batal
            </button>
            
            <button 
              type="submit"
              disabled={isSaving}
              className={`px-8 py-2.5 h-11 text-xs font-bold text-on-primary rounded-xl shadow-md hover:scale-101 active:scale-98 transition-all flex items-center gap-2 ${
                saveSuccess ? 'bg-green-600' : 'bg-primary hover:bg-primary/95'
              }`}
            >
              {isSaving ? (
                <>
                  <span>Menyimpan...</span>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </>
              ) : saveSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Data Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Data</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Informational Cards (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Mengapa data penting bento block */}
        <div className="col-span-1 md:col-span-2 glass-card rounded-2xl p-5 flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-primary-container/10 flex items-center justify-center shrink-0 border border-primary/10 shadow-sm text-primary">
            <Activity className="h-8 w-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Mengapa Data Ini Penting?</h4>
            <p className="text-xs text-on-surface-variant font-semibold mt-1 leading-relaxed">
              Algoritma MADM kami memadukan data manual ini dengan data smartwatch untuk memberikan skor kesehatan jantung yang lebih presisi dan akurat.
            </p>
          </div>
        </div>

        {/* Entri Terakhir block */}
        <div className="glass-card rounded-2xl p-5 bg-surface-container-high/30 flex flex-col justify-center border-dashed border-2 border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <History className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Entri Terakhir</span>
          </div>
          <p className="text-base font-extrabold text-on-surface">{lastEntry.date}</p>
          <p className="text-xs text-on-surface-variant font-bold mt-0.5">
            Skor: {selectedPatient.topsisScore} ({selectedPatient.riskStatus === 'Tinggi' ? 'Tinggi' : selectedPatient.riskStatus === 'Sedang' ? 'Sedang' : 'Optimal'})
          </p>
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
