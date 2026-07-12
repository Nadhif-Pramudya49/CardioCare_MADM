export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  initials: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  cholesterol: number;
  bloodSugar: number;
  comorbidities: number; // Risk value from 0 to 1
  bmi: number;
  physicalActivity: number; // Value from 0 to 1 (0 = low, 1 = high)
  symptoms: string[];
  topsisScore: number; // Relative closeness Ci (0 to 1)
  riskStatus: 'Tinggi' | 'Sedang' | 'Rendah';
  notes?: string;
  avatarUrl?: string;
}

export interface CriteriaWeight {
  id: string;
  name: string;
  description: string;
  weight: number; // 0 to 1 (all sum to 1.0)
}

export interface ManualEntry {
  id: string;
  systolic: number;
  diastolic: number;
  cholesterol: number;
  bloodSugar: number;
  symptoms: {
    chestPain: boolean;
    shortnessOfBreath: boolean;
    palpitation: boolean;
    extremeFatigue: boolean;
  };
  notes: string;
  date: string;
  topsisScore: number;
}

export interface SyncHistory {
  id: string;
  status: 'Berhasil' | 'Gagal';
  timestamp: string;
  vitalsCount: number;
  errorMsg?: string;
}

export type ViewType = 'dashboard' | 'manual-entry' | 'analysis' | 'device' | 'profile' | 'consultation';
