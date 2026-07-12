import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { User, Heart, Scale, ShieldAlert, FileText, Check, Edit2, X } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { selectedPatient, patients, isLoggedIn, setShowLoginModal, triggerToast } = useHealth();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [age, setAge] = useState<number>(selectedPatient ? selectedPatient.age : 35);
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>(selectedPatient ? selectedPatient.gender : 'Laki-laki');
  const [weight, setWeight] = useState<number>(74); // mock weight
  const [height, setHeight] = useState<number>(172); // mock height
  const [bloodType, setBloodType] = useState<string>('O+');

  useEffect(() => {
    if (!selectedPatient) return;
    setAge(selectedPatient.age);
    setGender(selectedPatient.gender);
    // vary mock details based on patient
    if (selectedPatient.id === '#P-8821') {
      setWeight(82); setHeight(173); setBloodType('B+');
    } else if (selectedPatient.id === '#P-8822') {
      setWeight(56); setHeight(158); setBloodType('A-');
    } else if (selectedPatient.id === '#P-8823') {
      setWeight(68); setHeight(180); setBloodType('AB+');
    } else {
      setWeight(62); setHeight(160); setBloodType('O+');
    }
  }, [selectedPatient]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    triggerToast('Profil pasien berhasil dimutakhirkan secara aman pada database CardioCare.', 'success');
  };

  const calculateBmi = () => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Profil Terkunci</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Silakan masuk atau daftarkan akun Anda terlebih dahulu untuk melihat rekam medis, riwayat pemeriksaan fisik, dan mengatur preferensi data personal Anda.
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
      {/* Title block */}
      <div>
        <h1 className="font-sans text-2xl font-bold text-primary tracking-tight">Profil Pasien</h1>
        <p className="text-sm text-on-surface-variant font-medium mt-0.5">
          Kelola folder rekam medis dan data fisik utama pasien secara terpusat.
        </p>
      </div>

      {/* Main card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Avatar & Demographics Card (col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-between">
          <div className="w-full flex flex-col items-center">
            {/* Avatar Frame */}
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary shadow-md">
                <img 
                  className="w-full h-full object-cover" 
                  src={selectedPatient.avatarUrl} 
                  alt={selectedPatient.name}
                />
              </div>
              <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white ${
                selectedPatient.riskStatus === 'Tinggi' ? 'bg-error' :
                selectedPatient.riskStatus === 'Sedang' ? 'bg-orange-500' :
                'bg-green-600'
              }`} title={`Risiko ${selectedPatient.riskStatus}`}>
                {selectedPatient.riskStatus[0]}
              </span>
            </div>

            <h2 className="font-sans text-lg font-bold text-primary leading-tight">{selectedPatient.name}</h2>
            <p className="text-xs font-semibold text-on-surface-variant/80 font-mono mt-1">{selectedPatient.id}</p>

            <div className="w-full border-t border-surface-container mt-5 pt-5 space-y-3.5 text-left text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Umur / Usia</span>
                <span className="text-on-surface">{age} Tahun</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Jenis Kelamin</span>
                <span className="text-on-surface">{gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Golongan Darah</span>
                <span className="text-on-surface font-mono">{bloodType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Metode Evaluasi</span>
                <span className="text-primary font-bold uppercase tracking-wider">AHP &amp; TOPSIS</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="w-full mt-6 py-2.5 bg-surface-container-low hover:bg-surface-container-high text-primary rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-surface-container-highest/40 transition-colors"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
            <span>{isEditing ? 'Batal Edit' : 'Edit Data Fisik'}</span>
          </button>
        </div>

        {/* Right Side: Medical Folders & Interactive Editor (col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          
          {isEditing ? (
            /* INTERACTIVE DEMOGRAPHICS EDITOR FORM */
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div className="border-b border-surface-container pb-2 mb-4">
                <h3 className="font-sans text-base font-bold text-primary flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Sunting Parameter Fisik
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Tinggi Badan (cm)</label>
                  <input 
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full h-11 px-4 border border-outline-variant rounded-xl text-sm"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Berat Badan (kg)</label>
                  <input 
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-11 px-4 border border-outline-variant rounded-xl text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Golongan Darah</label>
                  <select 
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full h-11 px-4 border border-outline-variant rounded-xl text-sm bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Usia / Umur</label>
                  <input 
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full h-11 px-4 border border-outline-variant rounded-xl text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-surface-container">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary/95 text-on-primary rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          ) : (
            /* STATIC CLINICAL REPORT OVERVIEW */
            <div className="space-y-6">
              <div className="border-b border-surface-container pb-2">
                <h3 className="font-sans text-base font-bold text-primary flex items-center gap-1.5">
                  <FileText className="h-5 w-5" />
                  Catatan Folder Rekam Medis
                </h3>
              </div>

              {/* Physical details grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface-container-low/50 p-4 rounded-xl border border-surface-container/35">
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Tinggi Badan</span>
                  <span className="text-base font-extrabold text-primary">{height} <small className="text-[10px] font-medium">cm</small></span>
                </div>
                
                <div className="bg-surface-container-low/50 p-4 rounded-xl border border-surface-container/35">
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Berat Badan</span>
                  <span className="text-base font-extrabold text-primary">{weight} <small className="text-[10px] font-medium">kg</small></span>
                </div>
                
                <div className="bg-surface-container-low/50 p-4 rounded-xl border border-surface-container/35">
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Indeks BMI</span>
                  <span className="text-base font-extrabold text-primary">{calculateBmi()}</span>
                </div>

                <div className="bg-surface-container-low/50 p-4 rounded-xl border border-surface-container/35">
                  <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Status Obesitas</span>
                  <span className="text-xs font-bold text-primary block mt-1">
                    {Number(calculateBmi()) >= 27.5 ? 'Obesitas (Risiko Tinggi)' :
                     Number(calculateBmi()) >= 23.0 ? 'Overweight (Waspada)' :
                     'Normal (Optimal)'
                    }
                  </span>
                </div>
              </div>

              {/* Clinical metrics summary */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Parameter Vitals Terakhir</h4>
                <div className="bg-surface-container-low/20 border border-surface-container p-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2.5">
                    <Heart className="h-5 w-5 text-primary" />
                    <div>
                      <span className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Detak Jantung</span>
                      <span className="text-sm font-bold text-on-surface">{selectedPatient.heartRate} BPM</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <Scale className="h-5 w-5 text-primary" />
                    <div>
                      <span className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Tekanan Darah</span>
                      <span className="text-sm font-bold text-on-surface">{selectedPatient.systolic}/{selectedPatient.diastolic} mmHg</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    <div>
                      <span className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Risiko TOPSIS (Ci)</span>
                      <span className="text-sm font-bold text-on-surface">{selectedPatient.topsisScore.toFixed(3)}</span>
                    </div>
                  </div>
                </div>

                {/* Patient notes */}
                {selectedPatient.notes && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider block">Catatan Medis &amp; Rekomendasi Dokter</span>
                    <p className="text-xs text-on-surface-variant italic leading-relaxed bg-surface-container-low/40 p-3 rounded-xl border border-surface-container/30">
                      {selectedPatient.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer licensing / copyright info */}
          <div className="text-[10px] font-bold text-on-surface-variant/50 text-center uppercase tracking-widest pt-6 border-t border-surface-container mt-6">
            © CardioCare MADM System Clinical Ledger
          </div>
        </div>

      </div>
    </div>
  );
};
