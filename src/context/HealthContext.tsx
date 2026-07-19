import React, { createContext, useContext, useState, useEffect } from 'react';
import { Patient, CriteriaWeight, ManualEntry, SyncHistory, ViewType, User, AHPMatrix, TopsisResult } from '../types';
import { solveTopsis } from '../utils/topsis';
import { calculateAHP } from '../utils/ahp';

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
  currentUser: User | null;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  patients: Patient[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  selectedPatient: Patient;
  criteriaWeights: CriteriaWeight[];
  setCriteriaWeights: (weights: CriteriaWeight[]) => void;
  ahpMatrix: AHPMatrix;
  setAhpMatrix: (matrix: AHPMatrix) => void;
  syncHistory: SyncHistory[];
  addSyncRecord: (record: SyncHistory) => void;
  addManualEntry: (entry: Omit<ManualEntry, 'id' | 'date' | 'topsisScore'>) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'topsisScore' | 'riskStatus' | 'rank' | 'recommendation'>) => void;
  deletePatient: (id: string) => void;
  resetPatients: () => void;
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
  loginAdmin: () => void;
  loginDokter: () => void;
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
  // 3 Kritis (Tinggi)
  { id: '#P-001', name: 'Budi Santoso', age: 58, gender: 'Laki-laki', initials: 'BS', systolic: 165, diastolic: 95, heartRate: 112, cholesterol: 240, bloodSugar: 160, comorbidities: 0.8, bmi: 27.5, physicalActivity: 0.2, symptoms: ['Nyeri Dada', 'Palpitasi Jantung'], topsisScore: 0, riskStatus: 'Tinggi' },
  { id: '#P-004', name: 'Maya Wulandari', age: 65, gender: 'Perempuan', initials: 'MW', systolic: 155, diastolic: 92, heartRate: 90, cholesterol: 250, bloodSugar: 170, comorbidities: 0.75, bmi: 29.0, physicalActivity: 0.2, symptoms: ['Nyeri Dada', 'Sesak Napas'], topsisScore: 0, riskStatus: 'Tinggi' },
  { id: '#P-012', name: 'Lina Marlina', age: 55, gender: 'Perempuan', initials: 'LM', systolic: 150, diastolic: 90, heartRate: 88, cholesterol: 210, bloodSugar: 180, comorbidities: 0.7, bmi: 28.2, physicalActivity: 0.3, symptoms: ['Kelelahan Ekstrim'], topsisScore: 0, riskStatus: 'Tinggi' },

  // 4 Perlu Perhatian (Sedang)
  { id: '#P-002', name: 'Siti Rahma', age: 42, gender: 'Perempuan', initials: 'SR', systolic: 130, diastolic: 85, heartRate: 76, cholesterol: 205, bloodSugar: 115, comorbidities: 0.35, bmi: 24.5, physicalActivity: 0.4, symptoms: [], topsisScore: 0, riskStatus: 'Sedang' },
  { id: '#P-005', name: 'Hendra Gunawan', age: 45, gender: 'Laki-laki', initials: 'HG', systolic: 135, diastolic: 85, heartRate: 78, cholesterol: 220, bloodSugar: 110, comorbidities: 0.4, bmi: 25.5, physicalActivity: 0.4, symptoms: ['Sesak Napas'], topsisScore: 0, riskStatus: 'Sedang' },
  { id: '#P-006', name: 'Ratna Sari', age: 52, gender: 'Perempuan', initials: 'RS', systolic: 125, diastolic: 82, heartRate: 80, cholesterol: 195, bloodSugar: 105, comorbidities: 0.3, bmi: 23.5, physicalActivity: 0.5, symptoms: ['Palpitasi Jantung'], topsisScore: 0, riskStatus: 'Sedang' },
  { id: '#P-010', name: 'Nina Herlina', age: 48, gender: 'Perempuan', initials: 'NH', systolic: 128, diastolic: 84, heartRate: 74, cholesterol: 200, bloodSugar: 112, comorbidities: 0.25, bmi: 24.0, physicalActivity: 0.5, symptoms: [], topsisScore: 0, riskStatus: 'Sedang' },

  // 3 Stabil (Rendah)
  { id: '#P-003', name: 'Andi Wijaya', age: 31, gender: 'Laki-laki', initials: 'AW', systolic: 118, diastolic: 78, heartRate: 68, cholesterol: 170, bloodSugar: 95, comorbidities: 0.15, bmi: 22.0, physicalActivity: 0.7, symptoms: [], topsisScore: 0, riskStatus: 'Rendah' },
  { id: '#P-008', name: 'Dewi Lestari', age: 38, gender: 'Perempuan', initials: 'DL', systolic: 115, diastolic: 75, heartRate: 70, cholesterol: 165, bloodSugar: 92, comorbidities: 0.1, bmi: 21.5, physicalActivity: 0.8, symptoms: [], topsisScore: 0, riskStatus: 'Rendah' },
  { id: '#P-009', name: 'Kusuma Wardani', age: 40, gender: 'Laki-laki', initials: 'KW', systolic: 112, diastolic: 72, heartRate: 65, cholesterol: 160, bloodSugar: 90, comorbidities: 0.05, bmi: 21.0, physicalActivity: 0.85, symptoms: [], topsisScore: 0, riskStatus: 'Rendah' },

  // 2 Sangat Sehat (Sangat Rendah -> we'll classify as Rendah but with very good values)
  { id: '#P-007', name: 'Ahmad Faisal', age: 28, gender: 'Laki-laki', initials: 'AF', systolic: 105, diastolic: 65, heartRate: 58, cholesterol: 140, bloodSugar: 80, comorbidities: 0, bmi: 19.5, physicalActivity: 1.0, symptoms: [], topsisScore: 0, riskStatus: 'Rendah' },
  { id: '#P-011', name: 'Rizky Pratama', age: 25, gender: 'Laki-laki', initials: 'RP', systolic: 110, diastolic: 70, heartRate: 60, cholesterol: 150, bloodSugar: 85, comorbidities: 0, bmi: 20.5, physicalActivity: 0.95, symptoms: [], topsisScore: 0, riskStatus: 'Rendah' },
];

const initialWeights: CriteriaWeight[] = [
  { id: 'c1', name: 'Tekanan Darah (Sistolik/Diastolik)', description: 'Metrik tekanan darah vital sistolik dan diastolik.', weight: 0.354 },
  { id: 'c2', name: 'Detak Jantung (Resting Heart Rate)', description: 'Detak jantung istirahat untuk mendeteksi anomali ritme.', weight: 0.241 },
  { id: 'c3', name: 'Riwayat Medis & Komorbiditas', description: 'Keberadaan penyakit komorbid seperti diabetes, hipertensi, dll.', weight: 0.185 },
  { id: 'c4', name: 'Indeks Massa Tubuh (BMI)', description: 'Rasio berat terhadap tinggi badan yang memengaruhi beban jantung.', weight: 0.120 },
  { id: 'c5', name: 'Level Aktivitas Fisik', description: 'Intensitas aktivitas fisik harian sebagai faktor protektif kardio.', weight: 0.100 }
];

const initialAhpMatrix: AHPMatrix = [
  [1, 2, 3, 4, 5],
  [1/2, 1, 2, 3, 4],
  [1/3, 1/2, 1, 2, 3],
  [1/4, 1/3, 1/2, 1, 2],
  [1/5, 1/4, 1/3, 1/2, 1]
];

const initialSyncHistory: SyncHistory[] = [
  { id: 's1', status: 'Berhasil', timestamp: 'Hari ini, 14:20', vitalsCount: 12 },
  { id: 's2', status: 'Berhasil', timestamp: 'Hari ini, 12:05', vitalsCount: 8 },
  { id: 's3', status: 'Gagal', timestamp: 'Hari ini, 09:30', vitalsCount: 0, errorMsg: 'Timeout' }
];

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [activeView, setActiveView] = useState<ViewType>(() => {
    return (localStorage.getItem('activeView') as ViewType) || 'dashboard';
  });
  
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('patients');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return initialPatients;
  });
  
  const [selectedPatientId, setSelectedPatientId] = useState<string>(() => {
    return localStorage.getItem('selectedPatientId') || initialPatients[0].id;
  });
  
  const [criteriaWeights, setCriteriaWeights] = useState<CriteriaWeight[]>(() => {
    const saved = localStorage.getItem('criteriaWeights');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return initialWeights;
  });
  
  const [ahpMatrix, setAhpMatrix] = useState<AHPMatrix>(() => {
    const saved = localStorage.getItem('ahpMatrix');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return initialAhpMatrix;
  });
  
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>(() => {
    const saved = localStorage.getItem('syncHistory');
    return saved ? JSON.parse(saved) : initialSyncHistory;
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
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

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
    localStorage.setItem('criteriaWeights', JSON.stringify(criteriaWeights));
  }, [criteriaWeights]);

  useEffect(() => {
    localStorage.setItem('ahpMatrix', JSON.stringify(ahpMatrix));
  }, [ahpMatrix]);



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

  const addPatient = (patientData: Omit<Patient, 'id' | 'topsisScore' | 'riskStatus' | 'rank' | 'recommendation'>) => {
    const maxIdNum = patients.reduce((max, p) => {
      const num = parseInt(p.id.replace('#P-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const newId = `#P-${String(maxIdNum + 1).padStart(3, '0')}`;
    const initials = patientData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      initials,
      topsisScore: 0,
      riskStatus: 'Sedang'
    };
    
    setPatients(prev => [...prev, newPatient]);
    triggerToast('Data pasien berhasil ditambahkan & dimasukkan ke antrean SPK', 'success');
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    triggerToast('Data pasien berhasil dihapus', 'success');
  };

  const resetPatients = () => {
    setPatients(initialPatients);
    triggerToast('Data dikembalikan ke 12 pasien awal (Bawaan Sistem)', 'success');
  };

  const loginAdmin = () => {
    const user: User = { name: 'Admin Puskesmas', email: 'admin@puskesmas.go.id', role: 'admin' };
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveView('dashboard');
    triggerToast(`Selamat datang, ${user.name}!`, 'success');
  };

  const loginDokter = () => {
    const user: User = { name: 'Dr. Ahmad Setiawan', email: 'ahmad.setiawan@rs.com', role: 'dokter' };
    setCurrentUser(user);
    setIsLoggedIn(true);
    setActiveView('dashboard');
    triggerToast(`Selamat datang, ${user.name}!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveView('dashboard');
    triggerToast('Anda telah keluar dari sistem.', 'success');
  };

  // Calculate TOPSIS scores automatically when patients metrics or weights change
  useEffect(() => {
    if (patients.length === 0) return;
    
    // Process AHP
    const ahpResults = calculateAHP(ahpMatrix);
    const weights = initialWeights.map((w, index) => ({
      ...w,
      weight: ahpResults.weights[index]
    }));
    
    if (JSON.stringify(weights) !== JSON.stringify(criteriaWeights)) {
      setCriteriaWeights(weights);
    }
    
    const topsisPatients = deviceStatus.isConnected ? patients : patients.map(p => ({
      ...p,
      heartRate: 70,          // Normal resting HR (0 risk)
      physicalActivity: 1.0   // Max physical activity (0 risk)
    }));
    
    const results = solveTopsis(topsisPatients, weights);
    
    setPatients(prev => {
      let changed = false;
      const next = prev.map(p => {
        const res = results.find(r => r.patientId === p.id);
        if (res && (p.topsisScore !== res.score || p.rank !== res.rank || p.recommendation !== res.recommendation)) {
          changed = true;
          return {
            ...p,
            topsisScore: res.score,
            rank: res.rank,
            recommendation: res.recommendation
          };
        }
        return p;
      });
      return changed ? next : prev;
    });
  }, [ahpMatrix, patients, deviceStatus.isConnected]); 

  const fallbackPatient: Patient = {
    id: '', name: 'Guest User', age: 0, gender: 'Laki-laki', initials: 'GU', systolic: 0, diastolic: 0, heartRate: 0, cholesterol: 0, bloodSugar: 0, comorbidities: 0, bmi: 0, physicalActivity: 0, symptoms: [], topsisScore: 0, riskStatus: 'Rendah', notes: 'Silakan login terlebih dahulu untuk memuat data kesehatan personal Anda.'
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0] || fallbackPatient;

  const addSyncRecord = (record: SyncHistory) => {
    setSyncHistory(prev => [record, ...prev]);
  };

  const triggerHeartRateFluctuation = () => {
    if (!isLoggedIn) return;
    setPatients(prev =>
      prev.map(p => {
        if (p.id === selectedPatientId) {
          const change = Math.floor(Math.random() * 7) - 3;
          let newHR = p.heartRate + change;
          if (p.id === '#P-001') {
            newHR = Math.max(105, Math.min(125, newHR));
          } else {
            newHR = Math.max(60, Math.min(100, newHR));
          }
          return { ...p, heartRate: newHR };
        }
        return p;
      })
    );
  };

  const addManualEntry = (entry: Omit<ManualEntry, 'id' | 'date' | 'topsisScore'>) => {
    if (!isLoggedIn || currentUser?.role !== 'admin') return;
    
    const symptomsList: string[] = [];
    if (entry.symptoms.chestPain) symptomsList.push('Nyeri Dada');
    if (entry.symptoms.shortnessOfBreath) symptomsList.push('Sesak Napas');
    if (entry.symptoms.palpitation) symptomsList.push('Palpitasi Jantung');
    if (entry.symptoms.extremeFatigue) symptomsList.push('Kelelahan Ekstrim');

    setPatients(prev => {
      return prev.map(p => {
        if (p.id === selectedPatientId) {
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
    });
    
    triggerToast('Data kesehatan pasien berhasil diperbarui!', 'success');
  };

  const toggleDeviceConnection = () => {
    setDeviceStatus(prev => ({
      ...prev,
      isConnected: !prev.isConnected
    }));
    triggerToast(`Smartwatch berhasil ${!deviceStatus.isConnected ? 'dihubungkan' : 'diputuskan'}.`, !deviceStatus.isConnected ? 'success' : 'warning');
  };

  const syncDevice = async () => {
    if (!isLoggedIn || currentUser?.role !== 'admin') return;
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    setPatients(prev => {
      return prev.map(p => {
        if (p.id === selectedPatientId) {
          // Simulate smartwatch fetching new real-time data
          // Randomize heart rate around their current HR, and slightly shift physical activity
          const hrChange = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const newHR = Math.max(50, Math.min(180, p.heartRate + hrChange));
          
          const paChange = (Math.random() * 0.2) - 0.1; // -0.1 to +0.1
          const newPA = Math.max(0, Math.min(1.0, p.physicalActivity + paChange));

          return {
            ...p,
            heartRate: newHR,
            physicalActivity: newPA
          };
        }
        return p;
      });
    });

    const success = Math.random() > 0.15;
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
        currentUser,
        activeView,
        setActiveView,
        patients,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        criteriaWeights,
        setCriteriaWeights,
        ahpMatrix,
        setAhpMatrix,
        syncHistory,
        addSyncRecord,
        addManualEntry,
        addPatient,
        deletePatient,
        resetPatients,
        syncDevice,
        isSyncing,
        deviceStatus,
        triggerHeartRateFluctuation,
        toggleDeviceConnection,
        isLoggedIn,
        loginAdmin,
        loginDokter,
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
