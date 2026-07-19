import React, { useMemo } from 'react';
import { useHealth } from '../context/HealthContext';
import { calculatePatientRiskMatrix } from '../utils/topsis';
import { ArrowLeft, Calculator, Calculator as MathIcon, CheckCircle, Target, ArrowRight } from 'lucide-react';

export const CalculationDetailView: React.FC = () => {
  const { patients, selectedPatientId, criteriaWeights, setActiveView } = useHealth();
  
  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const patientIndex = patients.findIndex(p => p.id === selectedPatient?.id);

  // Recalculate intermediate TOPSIS steps for transparency display
  const { X, normDenom, V, APlus, AMinus, SPlus, SMinus, Ci } = useMemo(() => {
    const rawX = calculatePatientRiskMatrix(patients);
    const m = rawX.length;
    const n = 5;

    const denom = Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      let sumSq = 0;
      for (let i = 0; i < m; i++) {
        sumSq += rawX[i][j] * rawX[i][j];
      }
      denom[j] = Math.sqrt(sumSq) || 1.0;
    }

    const V_matrix = Array.from({ length: m }, () => Array(n).fill(0));
    const w = criteriaWeights.map(cw => cw.weight);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        V_matrix[i][j] = (rawX[i][j] / denom[j]) * w[j];
      }
    }

    const A_plus = Array(n).fill(-Infinity);
    const A_minus = Array(n).fill(Infinity);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < m; i++) {
        if (V_matrix[i][j] > A_plus[j]) A_plus[j] = V_matrix[i][j];
        if (V_matrix[i][j] < A_minus[j]) A_minus[j] = V_matrix[i][j];
      }
    }

    const S_plus = Array(m).fill(0);
    const S_minus = Array(m).fill(0);
    for (let i = 0; i < m; i++) {
      let sumSqPlus = 0;
      let sumSqMinus = 0;
      for (let j = 0; j < n; j++) {
        sumSqPlus += Math.pow(V_matrix[i][j] - A_plus[j], 2);
        sumSqMinus += Math.pow(V_matrix[i][j] - A_minus[j], 2);
      }
      S_plus[i] = Math.sqrt(sumSqPlus);
      S_minus[i] = Math.sqrt(sumSqMinus);
    }

    const total = S_plus[patientIndex] + S_minus[patientIndex];
    const score = total === 0 ? 0.5 : S_minus[patientIndex] / total;

    return {
      X: rawX[patientIndex],
      normDenom: denom,
      V: V_matrix[patientIndex],
      APlus: A_plus,
      AMinus: A_minus,
      SPlus: S_plus[patientIndex],
      SMinus: S_minus[patientIndex],
      Ci: score
    };
  }, [patients, criteriaWeights, patientIndex]);

  const criteriaLabels = ['Tekanan Darah', 'Detak Jantung', 'Riwayat Medis', 'BMI', 'Aktivitas Fisik'];

  if (!selectedPatient) return null;

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={() => setActiveView('ranking')}
          className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-sans text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            Transparansi Perhitungan TOPSIS
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Laporan audit matematis untuk Pasien: <strong className="text-slate-700">{selectedPatient.name}</strong>
          </p>
        </div>
      </div>

      {/* Intro block */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0 mt-0.5">
          <MathIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-blue-900 text-sm mb-1">Audit Trail Algoritma</h3>
          <p className="text-xs text-blue-800/80 leading-relaxed font-medium">
            Halaman ini menampilkan tahapan <i>step-by-step</i> perhitungan TOPSIS mulai dari ekstraksi matriks risiko, normalisasi terbobot AHP, hingga pencarian jarak ke Solusi Ideal Positif (S+) dan Negatif (S-). Data disajikan hingga 6 angka di belakang koma untuk akurasi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Step 1 & 2 Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 text-sm">Tahap 1 & 2: Matriks Keputusan & Normalisasi</h3>
            <span className="text-[10px] font-black uppercase text-slate-400">Atribut Cost (Risiko)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-3 font-bold text-slate-500 w-48">Kriteria</th>
                  <th className="p-3 font-bold text-slate-500 text-right">Nilai Risiko Awal (X)</th>
                  <th className="p-3 font-bold text-slate-500 text-right">Pembagi Normalisasi</th>
                  <th className="p-3 font-bold text-blue-600 text-right">Ternormalisasi (R)</th>
                  <th className="p-3 font-bold text-slate-500 text-right">Bobot AHP (W)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-mono text-slate-600">
                {criteriaLabels.map((label, j) => {
                  const r = X[j] / normDenom[j];
                  return (
                    <tr key={j} className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-semibold text-slate-700">{label}</td>
                      <td className="p-3 text-right">{X[j].toFixed(6)}</td>
                      <td className="p-3 text-right">{normDenom[j].toFixed(6)}</td>
                      <td className="p-3 text-right font-bold text-blue-600">{r.toFixed(6)}</td>
                      <td className="p-3 text-right">{(criteriaWeights[j].weight * 100).toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 3: Weighted Normalized Matrix */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700 text-sm">Tahap 3: Matriks Keputusan Ternormalisasi Terbobot (V)</h3>
            <p className="text-[10px] text-slate-500 mt-1">Mengalikan nilai ternormalisasi (R) dengan bobot AHP (W).</p>
          </div>
          <div className="p-4 overflow-x-auto">
            <div className="flex gap-2">
              {criteriaLabels.map((label, j) => (
                <div key={j} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-center min-w-[140px]">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</div>
                  <div className="font-mono text-sm font-black text-slate-800">{V[j].toFixed(6)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4 & 5: Ideal Solutions and Distances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-red-600 text-sm flex items-center gap-2">
                <Target className="w-4 h-4" /> Solusi Ideal Positif (A+) & Jarak (S+)
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Karena semua atribut bertipe 'Cost', A+ adalah nilai maksimum risiko dari populasi.</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                {criteriaLabels.map((label, j) => (
                  <div key={j} className="flex justify-between text-xs border-b border-slate-50 pb-1">
                    <span className="text-slate-500">{label} A+</span>
                    <span className="font-mono font-bold text-red-600">{APlus[j].toFixed(6)}</span>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                <span className="text-xs font-bold text-red-800">Total Jarak ke A+ (S+)</span>
                <span className="font-mono text-lg font-black text-red-700">{SPlus.toFixed(6)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-green-600 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Solusi Ideal Negatif (A-) & Jarak (S-)
              </h3>
              <p className="text-[10px] text-slate-500 mt-1">Karena semua atribut bertipe 'Cost', A- adalah nilai minimum risiko dari populasi.</p>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                {criteriaLabels.map((label, j) => (
                  <div key={j} className="flex justify-between text-xs border-b border-slate-50 pb-1">
                    <span className="text-slate-500">{label} A-</span>
                    <span className="font-mono font-bold text-green-600">{AMinus[j].toFixed(6)}</span>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
                <span className="text-xs font-bold text-green-800">Total Jarak ke A- (S-)</span>
                <span className="font-mono text-lg font-black text-green-700">{SMinus.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 6: Final Score */}
        <div className="bg-slate-900 rounded-2xl shadow-xl overflow-hidden text-white flex flex-col md:flex-row items-center justify-between p-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          
          <div className="z-10 max-w-xl">
            <h3 className="font-bold text-xl mb-2">Tahap 6: Nilai Preferensi (Kedekatan Relatif)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Skor akhir dihitung dari proporsi jarak S- dibandingkan dengan total jarak (S+ dan S-). Rumus: <code className="bg-slate-800 px-2 py-1 rounded text-blue-300">Ci = S- / (S- + S+)</code>. 
              Semakin tinggi nilainya, semakin besar risiko yang dimiliki pasien.
            </p>
          </div>

          <div className="z-10 mt-6 md:mt-0 bg-white/10 backdrop-blur border border-white/20 p-6 rounded-2xl text-center min-w-[200px]">
            <div className="text-xs text-slate-300 font-bold uppercase tracking-widest mb-2">Skor Akhir (Ci)</div>
            <div className="text-5xl font-black text-white font-mono tracking-tighter">
              {Ci.toFixed(4)}
            </div>
            <div className="mt-4 text-xs font-bold text-blue-300 flex items-center justify-center gap-1">
              Peringkat: #{selectedPatient.rank} <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
