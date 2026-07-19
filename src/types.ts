export type UserRole = 'admin' | 'dokter';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

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
  riskStatus: 'Tinggi' | 'Sedang' | 'Rendah'; // Kept for backwards compatibility if needed, but we rely on recommendation mostly now
  rank?: number; // Added for new Ranking system
  recommendation?: string; // Added for new Ranking system
  notes?: string;
  avatarUrl?: string;
}

export interface CriteriaWeight {
  id: string;
  name: string;
  description: string;
  weight: number; // 0 to 1 (all sum to 1.0)
}

export type AHPMatrix = number[][];

export interface TopsisResult {
  patientId: string;
  score: number;
  rank: number;
  recommendation: string;
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

export type ViewType = 'dashboard' | 'manual-entry' | 'analysis' | 'device' | 'profile' | 'ranking' | 'ahp-setup' | 'calculation-detail' | 'doctor-notes' | 'consultation' | 'about' | 'tutorial';
