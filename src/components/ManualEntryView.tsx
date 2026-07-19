import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Activity, Plus, Search, Users, FileEdit, X, Save, CheckCircle, Trash2 } from 'lucide-react';
import { Patient } from '../types';

export const ManualEntryView: React.FC = () => {
  const { patients, isLoggedIn, setShowLoginModal, addPatient, deletePatient, resetPatients, triggerConfirm } = useHealth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetClicks, setResetClicks] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState(40);
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [heartRate, setHeartRate] = useState(80);
  const [cholesterol, setCholesterol] = useState(180);
  const [bloodSugar, setBloodSugar] = useState(100);
  const [comorbidities, setComorbidities] = useState(0.2);
  const [weight, setWeight] = useState(65);
  const [height, setHeight] = useState(165);
  const [physicalActivity, setPhysicalActivity] = useState(0.5);
  const [notes, setNotes] = useState('');

  // Calculate BMI on the fly
  const calculatedBmi = weight && height ? Number((weight / Math.pow(height / 100, 2)).toFixed(1)) : 0;

  const isFormValid = 
    name.trim() !== '' &&
    age >= 1 &&
    systolic >= 50 &&
    diastolic >= 30 &&
    heartRate >= 30 &&
    comorbidities >= 0 &&
    weight >= 1 &&
    height >= 30 &&
    physicalActivity >= 0;

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Akses Terkunci</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Silakan masuk menggunakan akun Tenaga Medis (Admin/Dokter) untuk mengakses Master Data Pasien.
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

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient({
      name,
      age,
      gender,
      initials: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      systolic,
      diastolic,
      heartRate,
      cholesterol,
      bloodSugar,
      comorbidities,
      bmi: calculatedBmi,
      physicalActivity,
      symptoms: [],
      notes
    });
    setIsModalOpen(false);
    // Reset form
    setName('');
    setAge(40);
    setSystolic(120);
    setDiastolic(80);
    setHeartRate(80);
    setCholesterol(180);
    setBloodSugar(100);
    setComorbidities(0.2);
    setWeight(65);
    setHeight(165);
    setPhysicalActivity(0.5);
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Master Data Pasien
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Database nilai kriteria kesehatan mentah sebelum diproses oleh perhitungan MADM (TOPSIS).
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Pasien Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari ID atau Nama Pasien..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
          <span 
            onClick={() => {
              const newClicks = resetClicks + 1;
              if (newClicks >= 3) {
                triggerConfirm('Apakah Anda yakin ingin me-reset seluruh data pasien ke 12 pasien bawaan sistem? Semua pasien yang Anda tambahkan manual akan hilang.', () => {
                  resetPatients();
                  setResetClicks(0);
                });
                setResetClicks(0);
              } else {
                setResetClicks(newClicks);
              }
            }}
            className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-all select-none"
            title="Klik 3 kali untuk Reset Data"
          >
            Total: {patients.length} Pasien
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr>
                <th className="p-4 bg-white border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">ID & Nama</th>
                <th className="p-4 bg-white border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Tekanan Darah (C1)</th>
                <th className="p-4 bg-white border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Detak Jantung (C2)</th>
                <th className="p-4 bg-white border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Komorbiditas (C3)</th>
                <th className="p-4 bg-white border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">BMI (C4)</th>
                <th className="p-4 bg-white border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Aktivitas (C5)</th>
                <th className="p-4 bg-white border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider">Gula / Kolesterol</th>
                <th className="p-4 bg-white border-b border-slate-200 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-black flex items-center justify-center text-xs shrink-0">
                        {patient.initials}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{patient.name}</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">{patient.id} • {patient.age}th • {patient.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-mono text-sm font-bold ${patient.systolic > 140 || patient.diastolic > 90 ? 'text-red-600' : 'text-slate-700'}`}>
                      {patient.systolic}/{patient.diastolic}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-mono text-sm font-bold ${patient.heartRate > 100 || patient.heartRate < 60 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {patient.heartRate} bpm
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${patient.comorbidities > 0.5 ? 'bg-red-50 text-red-600' : patient.comorbidities > 0.2 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                      {(patient.comorbidities * 100).toFixed(0)}% Risk
                    </span>
                  </td>
                  <td className="p-4 text-center font-mono text-sm font-bold text-slate-700">
                    {patient.bmi.toFixed(1)}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${patient.physicalActivity < 0.3 ? 'bg-red-50 text-red-600' : patient.physicalActivity < 0.6 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                      Level {(patient.physicalActivity * 10).toFixed(0)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-800">{patient.bloodSugar}</span> mg/dL
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      <span className="font-bold text-slate-800">{patient.cholesterol}</span> mg/dL
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => triggerConfirm(`Apakah Anda yakin ingin menghapus data pasien ${patient.name}?`, () => deletePatient(patient.id))}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Pasien"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500 text-sm">
                    Tidak ada pasien yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pasien */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-blue-600" />
                Input Data Pasien Baru
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="add-patient-form" onSubmit={handleSave} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
                    <input required type="text" value={name} 
                      onChange={e => setName(e.target.value.replace(/[^a-zA-Z\s.,'-]/g, ''))} 
                      maxLength={50}
                      pattern="[a-zA-Z\s.,'-]+"
                      title="Hanya huruf dan spasi yang diperbolehkan"
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Contoh: Ahmad Sulaiman" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Usia</label>
                      <input required type="number" min="1" max="150" value={age || ''} 
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value.slice(0, 3));
                          setAge(val > 150 ? 150 : val);
                        }} 
                        onBlur={() => { if (age < 1 && age !== 0) setAge(1); }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600">Gender</label>
                      <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />
                
                <h3 className="text-sm font-bold text-slate-800">Nilai Kriteria TOPSIS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Tekanan Darah (Sistolik / Diastolik)</label>
                    <div className="flex gap-2 items-center">
                      <input required type="number" min="50" max="300" value={systolic || ''} 
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value.slice(0, 3));
                          setSystolic(val > 300 ? 300 : val);
                        }} 
                        onBlur={() => { if (systolic < 50 && systolic !== 0) setSystolic(50); }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm text-center" placeholder="120" />
                      <span className="text-slate-400 font-black">/</span>
                      <input required type="number" min="30" max="200" value={diastolic || ''} 
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value.slice(0, 3));
                          setDiastolic(val > 200 ? 200 : val);
                        }} 
                        onBlur={() => { if (diastolic < 30 && diastolic !== 0) setDiastolic(30); }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm text-center" placeholder="80" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Detak Jantung (HR)</label>
                    <div className="flex items-center gap-2">
                      <input required type="number" min="30" max="300" value={heartRate || ''} 
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value.slice(0, 3));
                          setHeartRate(val > 300 ? 300 : val);
                        }} 
                        onBlur={() => { if (heartRate < 30 && heartRate !== 0) setHeartRate(30); }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">bpm</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Tingkat Komorbiditas (0.0 - 1.0)</label>
                    <input required type="number" step="0.1" min="0" max="1" value={comorbidities || ''} 
                      onChange={e => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value.slice(0, 4));
                        setComorbidities(val > 1 ? 1 : val);
                      }} 
                      onBlur={() => { if (comorbidities < 0) setComorbidities(0); }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    <p className="text-[10px] text-slate-500">0.0 = Tidak ada penyerta, 1.0 = Sangat kritis</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-600">Berat Badan (kg) / Tinggi (cm)</label>
                      {calculatedBmi > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                          <CheckCircle className="w-3 h-3" />
                          BMI: {calculatedBmi}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <input required type="number" min="1" max="300" step="0.1" value={weight || ''} 
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value.slice(0, 5));
                          setWeight(val > 300 ? 300 : val);
                        }} 
                        onBlur={() => { if (weight < 1 && weight !== 0) setWeight(1); }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm text-center" placeholder="Berat (kg)" />
                      <span className="text-slate-400 font-black">/</span>
                      <input required type="number" min="30" max="300" step="0.1" value={height || ''} 
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value.slice(0, 5));
                          setHeight(val > 300 ? 300 : val);
                        }} 
                        onBlur={() => { if (height < 30 && height !== 0) setHeight(30); }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm text-center" placeholder="Tinggi (cm)" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Aktivitas Fisik (0.0 - 1.0)</label>
                    <input required type="number" step="0.1" min="0" max="1" value={physicalActivity || ''} 
                      onChange={e => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value.slice(0, 4));
                        setPhysicalActivity(val > 1 ? 1 : val);
                      }} 
                      onBlur={() => { if (physicalActivity < 0) setPhysicalActivity(0); }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                    <p className="text-[10px] text-slate-500">0.0 = Kurang gerak, 1.0 = Sangat aktif</p>
                  </div>
                </div>

                <hr className="border-slate-100" />
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Catatan Medis Tambahan</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" rows={2} placeholder="Keterangan tambahan pasien..." />
                </div>

              </form>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                Batal
              </button>
              <button 
                type="submit" 
                form="add-patient-form" 
                disabled={!isFormValid}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors ${
                  isFormValid 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Save className="w-4 h-4" />
                Simpan & Masukkan ke SPK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
