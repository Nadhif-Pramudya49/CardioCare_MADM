import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { 
  Stethoscope,
  Save,
  CheckCircle,
  FileText,
  Clock,
  User,
  AlertTriangle,
  Search
} from 'lucide-react';

export const ConsultationView: React.FC = () => {
  const { patients, setPatients, isLoggedIn, setShowLoginModal, triggerToast } = useHealth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedId] = useState<string>(patients[0]?.id || '');
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Initialize textarea when patient changes
  useEffect(() => {
    if (selectedPatient) {
      setNoteContent(selectedPatient.notes || '');
    }
  }, [selectedPatientId, selectedPatient]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => (a.rank || 0) - (b.rank || 0));

  const handleSaveNote = () => {
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      setPatients(prev => 
        prev.map(p => {
          if (p.id === selectedPatientId) {
            return { ...p, notes: noteContent };
          }
          return p;
        })
      );
      setIsSaving(false);
      triggerToast('Catatan medis berhasil disimpan ke database.', 'success');
    }, 600);
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Akses Terkunci</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Fitur Catatan Medis (E-Rekam Medis) hanya dapat diakses oleh Tenaga Medis terotentikasi. Silakan masuk sebagai Admin atau Dokter.
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
    <div className="space-y-6 h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Catatan Medis & Observasi
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Manajemen rekam medis elektronik (EMR) berbasis hasil perankingan TOPSIS.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
        
        {/* Left Column - Patient List */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Cari nama / ID pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2">
            {filteredPatients.map(patient => {
              const isSelected = patient.id === selectedPatientId;
              const isHighRisk = (patient.topsisScore || 0) >= 0.7;
              
              return (
                <button
                  key={patient.id}
                  onClick={() => setSelectedId(patient.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${
                      isSelected ? 'bg-blue-600 text-white border-blue-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {patient.initials}
                    </div>
                    {isHighRisk && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-100 rounded-full flex items-center justify-center border border-red-200" title="Risiko Tinggi">
                        <AlertTriangle className="w-2.5 h-2.5 text-red-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                      {patient.name}
                    </h4>
                    <p className={`text-[10px] font-mono mt-0.5 truncate ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                      {patient.id} • Rank #{patient.rank}
                    </p>
                  </div>
                </button>
              );
            })}
            
            {filteredPatients.length === 0 && (
              <div className="text-center p-6 text-slate-400 text-xs font-medium">
                Tidak ada pasien ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Editor */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm h-[600px]">
          {selectedPatient ? (
            <>
              {/* Header Profile */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-sm border border-blue-200 shadow-sm shrink-0">
                    {selectedPatient.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      {selectedPatient.name}
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-bold ${
                        (selectedPatient.topsisScore || 0) >= 0.7 ? 'bg-red-50 text-red-600 border-red-200' :
                        (selectedPatient.topsisScore || 0) >= 0.4 ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        'bg-green-50 text-green-600 border-green-200'
                      }`}>
                        Skor TOPSIS: {(selectedPatient.topsisScore || 0).toFixed(4)}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {selectedPatient.age} Thn • {selectedPatient.gender} • ID: {selectedPatient.id}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rekomendasi Sistem</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{selectedPatient.recommendation}</p>
                </div>
              </div>

              {/* Editor Area */}
              <div className="flex-1 p-5 flex flex-col">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Jurnal / Observasi Klinis
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder={`Ketik hasil observasi atau rencana tindakan medis untuk ${selectedPatient.name}...`}
                  className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Tersimpan otomatis ke memori lokal
                </span>
                <button
                  onClick={handleSaveNote}
                  disabled={isSaving}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 ${
                    isSaving ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Simpan Catatan
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
              <User className="w-12 h-12 mb-3 text-slate-200" />
              <p className="text-sm font-medium">Pilih pasien dari daftar di sebelah kiri untuk menulis catatan medis.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
