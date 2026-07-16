import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, CriteriaWeight, ManualEntry, SyncHistory, ViewType } from '../types';
import { solveTopsis } from '../utils/topsis';

export interface ToastType {
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

export interface ConfirmType {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface HealthContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  patients: Patient[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedPatient: Patient;
  criteriaWeights: CriteriaWeight[];
  setCriteriaWeights: (weights: CriteriaWeight[]) => void;
  syncHistory: SyncHistory[];
  addSyncRecord: (record: SyncHistory) => void;
  addManualEntry: (entry: Omit<ManualEntry, 'id' | 'date' | 'topsisScore'>) => void;
  syncDevice: () => Promise<void>;
  isSyncing: boolean;
  deviceStatus: {
    isConnected: boolean;
    battery: number;
    signal: string;
    lastSynced: string;
    deviceName: string;
  };
  toggleDeviceConnection: () => void;
  triggerHeartRateFluctuation: () => void;
  isLoggedIn: boolean;
  login: (name?: string, gender?: 'Laki-laki' | 'Perempuan', age?: number) => void;
  logout: () => void;
  toast: ToastType | null;
  setToast: (toast: ToastType | null) => void;
  confirmDialog: ConfirmType | null;
  setConfirmDialog: (confirm: ConfirmType | null) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  triggerToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  triggerConfirm: (message: string, onConfirm: () => void) => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

const initialPatients: Patient[] = [
  {
    id: '#P-8821',
    name: 'Budi Santoso',
    age: 58,
    gender: 'Laki-laki',
    initials: 'BS',
    systolic: 142,
    diastolic: 92,
    heartRate: 112,
    cholesterol: 240,
    bloodSugar: 160,
    comorbidities: 0.8,
    bmi: 27.5,
    physicalActivity: 0.3,
    symptoms: ['Nyeri Dada (Chest Pain)', 'Palpitasi Jantung'],
    topsisScore: 0.892,
    riskStatus: 'Tinggi',
    notes: 'Pasien mengeluhkan detak jantung meningkat tiba-tiba saat istirahat disertai nyeri dada ringan.',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxXDZvYLuE2KW8MAH2SFSjvJOXU7a08HLITECoqYBYSegN52rJhrKWosL9cAIiyhxC6LyJ-y-ri4vnyft1liA8F4rHT1yYRpH_PG5XTmj-IoTmQ3SAoW7I5163RqrY1RKtajsPFPvINMQjhcMPRpRG5qC3DI7SVyXNo76hRolBjNgNfWcPB9Zt4Qo3czaBg8bpQl5dXAQlmtkaVOETqoIijMi9nEqFLvFPWLfp0b062xp0-I3hpt7VSAGy_mRqhz9EuTLLQm33Hnwo'
  },
  {
    id: '#P-8822',
    name: 'Siti Rahma',
    age: 42,
    gender: 'Perempuan',
    initials: 'SR',
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
    cholesterol: 195,
    bloodSugar: 105,
    comorbidities: 0.3,
    bmi: 22.4,
    physicalActivity: 0.6,
    symptoms: [],
    topsisScore: 0.541,
    riskStatus: 'Sedang',
    notes: 'Kondisi umum pasien stabil. Melaporkan kepatuhan obat yang baik.',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq7yKXwzMM7SRcpLxe5n6-xedq_YBFLXC6QV_K3T09VFDqhWL325aqfiYPMwevHpbX888cmvPdWLx6pSKfGAm5NrKKNsHnhQzsXjyqa4Yk900zw8jOJcU_2-NvvW9RX-yLeiN0NGQbpqhFWD2zcZbTxLuvLMO9rg7PY3nqcEGq3douNGj0qR3rrgayNCdJoSqTcCbHA0Rvp82BDdhDcWTw6lQSygjBaxQzBRaYUD1c3MOscGZC3YHTz_1u6bTNZaiEdV-YwFfR536B'
  },
  {
    id: '#P-8823',
    name: 'Andi Wijaya',
    age: 31,
    gender: 'Laki-laki',
    initials: 'AD',
    systolic: 115,
    diastolic: 75,
    heartRate: 65,
    cholesterol: 160,
    bloodSugar: 90,
    comorbidities: 0.1,
    bmi: 21.0,
    physicalActivity: 0.8,
    symptoms: [],
    topsisScore: 0.124,
    riskStatus: 'Rendah',
    notes: 'Pasien sangat aktif fisik, rutin berolahraga lari dan memiliki profil biomarker kardiovaskular optimal.',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq7yKXwzMM7SRcpLxe5n6-xedq_YBFLXC6QV_K3T09VFDqhWL325aqfiYPMwevHpbX888cmvPdWLx6pSKfGAm5NrKKNsHnhQzsXjyqa4Yk900zw8jOJcU_2-NvvW9RX-yLeiN0NGQbpqhFWD2zcZbTxLuvLMO9rg7PY3nqcEGq3douNGj0qR3rrgayNCdJoSqTcCbHA0Rvp82BDdhDcWTw6lQSygjBaxQzBRaYUD1c3MOscGZC3YHTz_1u6bTNZaiEdV-YwFfR536B'
  },
  {
    id: '#P-8824',
    name: 'Maya Wulandari',
    age: 65,
    gender: 'Perempuan',
    initials: 'MW',
    systolic: 128,
    diastolic: 84,
    heartRate: 78,
    cholesterol: 210,
    bloodSugar: 120,
    comorbidities: 0.5,
    bmi: 24.2,
    physicalActivity: 0.4,
    symptoms: ['Kelelahan Ekstrim'],
    topsisScore: 0.612,
    riskStatus: 'Sedang',
    notes: 'Mengalami keluhan lemas dan kelelahan akhir-akhir ini. Dianjurkan monitoring gula darah teratur.',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxXDZvYLuE2KW8MAH2SFSjvJOXU7a08HLITECoqYBYSegN52rJhrKWosL9cAIiyhxC6LyJ-y-ri4vnyft1liA8F4rHT1yYRpH_PG5XTmj-IoTmQ3SAoW7I5163RqrY1RKtajsPFPvINMQjhcMPRpRG5qC3DI7SVyXNo76hRolBjNgNfWcPB9Zt4Qo3czaBg8bpQl5dXAQlmtkaVOETqoIijMi9nEqFLvFPWLfp0b062xp0-I3hpt7VSAGy_mRqhz9EuTLLQm33Hnwo'
  }
];

const initialWeights: CriteriaWeight[] = [
  { id: 'c1', name: 'Tekanan Darah (Sistolik/Diastolik)', description: 'Metrik tekanan darah vital sistolik dan diastolik.', weight: 0.354 },
  { id: 'c2', name: 'Detak Jantung (Resting Heart Rate)', description: 'Detak jantung istirahat untuk mendeteksi anomali ritme.', weight: 0.241 },
  { id: 'c3', name: 'Riwayat Medis & Komorbiditas', description: 'Keberadaan penyakit komorbid seperti diabetes, hipertensi, dll.', weight: 0.185 },
  { id: 'c4', name: 'Indeks Massa Tubuh (BMI)', description: 'Rasio berat terhadap tinggi badan yang memengaruhi beban jantung.', weight: 0.120 },
  { id: 'c5', name: 'Level Aktivitas Fisik', description: 'Intensitas aktivitas fisik harian sebagai faktor protektif kardio.', weight: 0.100 }
];

const initialSyncHistory: SyncHistory[] = [
  { id: 's1', status: 'Berhasil', timestamp: 'Hari ini, 14:20', vitalsCount: 12 },
  { id: 's2', status: 'Berhasil', timestamp: 'Hari ini, 12:05', vitalsCount: 8 },
  { id: 's3', status: 'Gagal', timestamp: 'Hari ini, 09:30', vitalsCount: 0, errorMsg: 'Timeout' }
];

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [activeView, setActiveView] = useState<ViewType>(() => {
    return (localStorage.getItem('activeView') as ViewType) || 'dashboard';
  });
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('patients');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    return localStorage.getItem('selectedPatientId') || '';
  });
  const [criteriaWeights, setCriteriaWeights] = useState<CriteriaWeight[]>(initialWeights);
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>(() => {
    const saved = localStorage.getItem('syncHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [deviceStatus, setDeviceStatus] = useState({
    isConnected: true,
    battery: 84,
    signal: 'Kuat',
    lastSynced: '2 menit yang lalu',
    deviceName: 'Apple Watch Series 9'
  });

  const [toast, setToast] = useState<ToastType | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmType | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('activeView', activeView);
  }, [activeView]);

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('selectedPatientId', selectedPatientId);
  }, [selectedPatientId]);

  useEffect(() => {
    localStorage.setItem('syncHistory', JSON.stringify(syncHistory));
  }, [syncHistory]);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const triggerConfirm = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ message, onConfirm });
  };

  const login = (name: string = 'Budi Santoso', gender: 'Laki-laki' | 'Perempuan' = 'Laki-laki', age: number = 58) => {
    setIsLoggedIn(true);
    const primaryPatient: Patient = {
      id: '#P-8821',
      name: name,
      age: age,
      gender: gender,
      initials: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'BS',
      systolic: 142,
      diastolic: 92,
      heartRate: 112,
      cholesterol: 240,
      bloodSugar: 160,
      comorbidities: 0.8,
      bmi: 27.5,
      physicalActivity: 0.3,
      symptoms: ['Nyeri Dada (Chest Pain)', 'Palpitasi Jantung'],
      topsisScore: 0.892,
      riskStatus: 'Tinggi',
      notes: 'Gunakan fitur "Sync Device" dengan smartwatch Anda untuk sinkronisasi otomatis metrik vital terbaru Anda secara real-time.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    
    setPatients([primaryPatient, ...initialPatients.filter(p => p.id !== '#P-8821')]);
    setSelectedPatientId('#P-8821');
    setSyncHistory(initialSyncHistory);
    setActiveView('dashboard');
    triggerToast(`Selamat datang kembali, ${name}!`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setPatients([]);
    setSelectedPatientId('');
    setSyncHistory([]);
    setActiveView('dashboard');
    triggerToast('Anda telah keluar dari portal kesehatan Anda.', 'success');
  };

  // Calculate TOPSIS scores automatically when patients metrics or weights change
  useEffect(() => {
    if (patients.length === 0) return;
    const topsisPatients = deviceStatus.isConnected ? patients : patients.map(p => ({
      ...p,
      heartRate: 70,          // Normal resting HR (0 risk)
      physicalActivity: 1.0   // Max physical activity (0 risk)
    }));
    const scores = solveTopsis(topsisPatients, criteriaWeights);
    setPatients(prev => {
      if (prev.length === 0) return prev;
      return prev.map((p, idx) => {
        const score = scores[idx] !== undefined ? scores[idx] : p.topsisScore;
        let risk: 'Tinggi' | 'Sedang' | 'Rendah' = 'Rendah';
        if (score >= 0.70) risk = 'Tinggi';
        else if (score >= 0.40) risk = 'Sedang';

        return {
          ...p,
          topsisScore: score,
          riskStatus: risk
        };
      });
    });
  }, [criteriaWeights, patients.length, deviceStatus.isConnected]); // Calculate on weight change, patient load, or connection change

  const fallbackPatient: Patient = {
    id: '',
    name: 'Guest User',
    age: 0,
    gender: 'Laki-laki',
    initials: 'GU',
    systolic: 0,
    diastolic: 0,
    heartRate: 0,
    cholesterol: 0,
    bloodSugar: 0,
    comorbidities: 0,
    bmi: 0,
    physicalActivity: 0,
    symptoms: [],
    topsisScore: 0,
    riskStatus: 'Rendah',
    notes: 'Silakan login terlebih dahulu untuk memuat data kesehatan personal Anda.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0] || fallbackPatient;

  const addSyncRecord = (record: SyncHistory) => {
    setSyncHistory(prev => [record, ...prev]);
  };

  // Triggers minor random updates to the current selected patient's smartwatch metrics (heart rate) to simulate real-time feed
  const triggerHeartRateFluctuation = () => {
    if (!isLoggedIn) return;
    setPatients(prev =>
      prev.map(p => {
        if (p.id === selectedPatientId) {
          // Slight fluctuation (+- 3 BPM)
          const change = Math.floor(Math.random() * 7) - 3;
          let newHR = p.heartRate + change;
          // Constrain HR to reasonable bounds based on patient clinical status
          if (p.id === '#P-8821') {
            newHR = Math.max(105, Math.min(125, newHR)); // Always stays high for Budi
          } else {
            newHR = Math.max(60, Math.min(85, newHR));
          }
          return { ...p, heartRate: newHR };
        }
        return p;
      })
    );
  };

  // Updates the patient details with manual daily health logs and recalculates TOPSIS
  const addManualEntry = (entry: Omit<ManualEntry, 'id' | 'date' | 'topsisScore'>) => {
    if (!isLoggedIn) return;
    const symptomsList: string[] = [];
    if (entry.symptoms.chestPain) symptomsList.push('Nyeri Dada');
    if (entry.symptoms.shortnessOfBreath) symptomsList.push('Sesak Napas');
    if (entry.symptoms.palpitation) symptomsList.push('Palpitasi Jantung');
    if (entry.symptoms.extremeFatigue) symptomsList.push('Kelelahan Ekstrim');

    // Update patient record
    setPatients(prev => {
      const updated = prev.map(p => {
        if (p.id === selectedPatientId) {
          // Calculate high-stakes comorbidities penalty based on symptoms
          const symptomPenalty = symptomsList.length * 0.15;
          const updatedComorbidities = Math.min(1.0, p.comorbidities + symptomPenalty);

          return {
            ...p,
            systolic: entry.systolic,
            diastolic: entry.diastolic,
            cholesterol: entry.cholesterol,
            bloodSugar: entry.bloodSugar,
            symptoms: symptomsList,
            comorbidities: updatedComorbidities,
            notes: entry.notes || p.notes
          };
        }
        return p;
      });

      // Recalculate TOPSIS scores with the new metrics
      const topsisPatients = deviceStatus.isConnected ? updated : updated.map(p => ({
        ...p,
        heartRate: 70,          // Normal resting HR (0 risk)
        physicalActivity: 1.0   // Max physical activity (0 risk)
      }));
      const newScores = solveTopsis(topsisPatients, criteriaWeights);
      return updated.map((p, idx) => {
        const score = newScores[idx] !== undefined ? newScores[idx] : p.topsisScore;
        let risk: 'Tinggi' | 'Sedang' | 'Rendah' = 'Rendah';
        if (score >= 0.70) risk = 'Tinggi';
        else if (score >= 0.40) risk = 'Sedang';

        return {
          ...p,
          topsisScore: score,
          riskStatus: risk
        };
      });
    });
  };

  // Simulates connecting to the smartwatch and fetching real-time cardiovascular vitals
  const toggleDeviceConnection = () => {
    setDeviceStatus(prev => ({
      ...prev,
      isConnected: !prev.isConnected
    }));
    triggerToast(`Smartwatch berhasil ${!deviceStatus.isConnected ? 'dihubungkan' : 'diputuskan'}.`, !deviceStatus.isConnected ? 'success' : 'warning');
  };

  const syncDevice = async () => {
    if (!isLoggedIn) return;
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // After syncing successfully, randomize selected patient metrics slightly towards healthier limits
    setPatients(prev => {
      const updated = prev.map(p => {
        if (p.id === selectedPatientId) {
          // Budi recovers slightly or metrics change
          const newHR = p.id === '#P-8821' ? 78 : p.heartRate; // If Budi, sync drops to 78 BPM just like in the screenshots!
          const newSys = p.id === '#P-8821' ? 118 : p.systolic; // 118 mmHg just like in screenshots
          const newDia = p.id === '#P-8821' ? 76 : p.diastolic; // 76 mmHg
          return {
            ...p,
            heartRate: newHR,
            systolic: newSys,
            diastolic: newDia,
            // Clear symptoms if it stabilizes
            symptoms: p.id === '#P-8821' ? [] : p.symptoms
          };
        }
        return p;
      });

      // Recalculate TOPSIS
      const newScores = solveTopsis(updated, criteriaWeights);
      return updated.map((p, idx) => {
        const score = newScores[idx] !== undefined ? newScores[idx] : p.topsisScore;
        let risk: 'Tinggi' | 'Sedang' | 'Rendah' = 'Rendah';
        if (score >= 0.70) risk = 'Tinggi';
        else if (score >= 0.40) risk = 'Sedang';

        return {
          ...p,
          topsisScore: score,
          riskStatus: risk
        };
      });
    });

    const success = Math.random() > 0.15; // 85% success rate
    const now = new Date();
    const timeStr = `Hari ini, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (success) {
      addSyncRecord({
        id: `s-${Date.now()}`,
        status: 'Berhasil',
        timestamp: timeStr,
        vitalsCount: Math.floor(Math.random() * 10) + 5
      });
      setDeviceStatus(prev => ({
        ...prev,
        lastSynced: 'Baru saja',
        battery: Math.max(10, prev.battery - Math.floor(Math.random() * 3))
      }));
    } else {
      addSyncRecord({
        id: `s-${Date.now()}`,
        status: 'Gagal',
        timestamp: timeStr,
        vitalsCount: 0,
        errorMsg: 'Koneksi bluetooth terputus'
      });
    }

    setIsSyncing(false);
  };

  return (
    <HealthContext.Provider
      value={{
        activeView,
        setActiveView,
        patients,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        criteriaWeights,
        setCriteriaWeights,
        syncHistory,
        addSyncRecord,
        addManualEntry,
        syncDevice,
        isSyncing,
        deviceStatus,
        triggerHeartRateFluctuation,
        toggleDeviceConnection,
        isLoggedIn,
        login,
        logout,
        toast,
        setToast,
        confirmDialog,
        setConfirmDialog,
        showLoginModal,
        setShowLoginModal,
        triggerToast,
        triggerConfirm
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
