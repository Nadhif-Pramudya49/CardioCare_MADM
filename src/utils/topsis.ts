import { Patient, CriteriaWeight, TopsisResult } from '../types';

/**
 * Calculates individual risk metrics for each criterion (0 to 1 scale, where 1 is maximum risk/worst)
 */
export function calculatePatientRiskMatrix(patients: Patient[]): number[][] {
  return patients.map(p => {
    // 1. Blood Pressure Risk (Optimal: 120/80)
    // Deviation is penalizing. High BP (systolic > 140, diastolic > 90) or low BP (systolic < 90) is risky
    const sysDev = Math.abs(p.systolic - 120);
    const diaDev = Math.abs(p.diastolic - 80);
    const bpRisk = Math.min(1.0, (sysDev / 50 + diaDev / 30) / 2);

    // 2. Heart Rate Risk (Optimal resting: 70 BPM)
    // Tachycardia (>100) or bradycardia (<55) increases cardiovascular risk
    const hrDev = Math.abs(p.heartRate - 70);
    const hrRisk = Math.min(1.0, hrDev / 45);

    // 3. Comorbidities & Medical History (already 0 to 1 scale)
    const comorbiditiesRisk = p.comorbidities;

    // 4. BMI Risk (Optimal: 21.7)
    // Underweight (<18.5) or Obesity (>30) increases cardiac strain
    const bmiDev = Math.abs(p.bmi - 21.7);
    const bmiRisk = Math.min(1.0, bmiDev / 12);

    // 5. Physical Activity Level (Benefit criterion: higher activity reduces risk, so we use 1 - activity)
    const physicalActivityRisk = 1.0 - p.physicalActivity;

    return [bpRisk, hrRisk, comorbiditiesRisk, bmiRisk, physicalActivityRisk];
  });
}

/**
 * Mathematical TOPSIS Solver
 * In this setup:
 * All normalized attributes are treated as "Risk Factors" (higher is worse).
 * Therefore, the "positive ideal solution" (A+) represents the MAX risk across all criteria.
 * The "negative ideal solution" (A-) represents the MIN risk across all criteria.
 * Closeness Ci represents the relative distance of the patient's condition to the WORST risk condition.
 * Thus:
 * - High Ci (e.g. > 0.70) -> High Risk
 * - Medium Ci (0.40 - 0.70) -> Medium Risk
 * - Low Ci (< 0.40) -> Low Risk
 */
export function solveTopsis(patients: Patient[], weights: CriteriaWeight[]): TopsisResult[] {
  if (patients.length === 0) return [];

  // Step 1: Establish Decision Matrix
  // Size: m x n, where m is patients.length, n is 5 criteria
  const X = calculatePatientRiskMatrix(patients);
  const m = X.length;
  const n = 5;

  // Step 2: Calculate denominator for normalization (column-wise square sum root)
  const normDenom = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let sumSq = 0;
    for (let i = 0; i < m; i++) {
      sumSq += X[i][j] * X[i][j];
    }
    normDenom[j] = Math.sqrt(sumSq) || 1.0; // avoid division by zero
  }

  // Step 3: Construct Weighted Normalized Decision Matrix V
  const V = Array.from({ length: m }, () => Array(n).fill(0));
  const w = weights.map(cw => cw.weight);

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      V[i][j] = (X[i][j] / normDenom[j]) * w[j];
    }
  }

  // Step 4: Determine Positive Ideal Solution (A+) and Negative Ideal Solution (A-)
  const APlus = Array(n).fill(-Infinity);
  const AMinus = Array(n).fill(Infinity);

  for (let j = 0; j < n; j++) {
    for (let i = 0; i < m; i++) {
      if (V[i][j] > APlus[j]) APlus[j] = V[i][j];
      if (V[i][j] < AMinus[j]) AMinus[j] = V[i][j];
    }
  }

  // Step 5: Calculate Separation Measures
  const SPlus = Array(m).fill(0);
  const SMinus = Array(m).fill(0);

  for (let i = 0; i < m; i++) {
    let sumSqPlus = 0;
    let sumSqMinus = 0;
    for (let j = 0; j < n; j++) {
      sumSqPlus += Math.pow(V[i][j] - APlus[j], 2);
      sumSqMinus += Math.pow(V[i][j] - AMinus[j], 2);
    }
    SPlus[i] = Math.sqrt(sumSqPlus);
    SMinus[i] = Math.sqrt(sumSqMinus);
  }

  // Step 6: Calculate Relative Closeness Ci
  const rawScores = patients.map((_, i) => {
    const total = SPlus[i] + SMinus[i];
    if (total === 0) return 0.5;
    const score = SMinus[i] / total;
    return Math.round(score * 1000) / 1000;
  });

  // Calculate ranking and recommendations
  const sortedIndices = rawScores
    .map((score, index) => ({ score, index }))
    .sort((a, b) => b.score - a.score);

  const results: TopsisResult[] = new Array(patients.length);
  
  sortedIndices.forEach((item, sortedIndex) => {
    const rank = sortedIndex + 1;
    let recommendation = 'Kondisi Terkontrol';
    
    if (rank <= 3) {
      recommendation = 'Penanganan Segera';
    } else if (rank <= 6) {
      recommendation = 'Perlu Konsultasi Lanjutan';
    } else if (rank <= 10) {
      recommendation = 'Kontrol Rutin';
    }

    results[item.index] = {
      patientId: patients[item.index].id,
      score: item.score,
      rank,
      recommendation
    };
  });

  return results;
}
