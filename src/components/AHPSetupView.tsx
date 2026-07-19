import React, { useState, useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { calculateAHP } from '../utils/ahp';
import { AHPMatrix } from '../types';
import { Save, RefreshCw, AlertTriangle, CheckCircle, Info, Scale, ChevronDown, Zap, Lightbulb, Star } from 'lucide-react';

const CRITERIA_LABELS = ['Tekanan Darah', 'Detak Jantung', 'Riwayat Medis', 'BMI', 'Aktivitas Fisik'];

const PAIRS: {i: number, j: number}[] = [];
for (let i = 0; i < CRITERIA_LABELS.length; i++) {
  for (let j = i + 1; j < CRITERIA_LABELS.length; j++) {
    PAIRS.push({ i, j });
  }
}

const getDynamicOptions = (leftLabel: string, rightLabel: string) => [
  { value: 9, label: `${leftLabel} mutlak lebih penting` },
  { value: 7, label: `${leftLabel} sangat lebih penting` },
  { value: 5, label: `${leftLabel} lebih penting` },
  { value: 3, label: `${leftLabel} sedikit lebih penting` },
  { value: 1, label: `Keduanya sama penting` },
  { value: 1/3, label: `${rightLabel} sedikit lebih penting` },
  { value: 1/5, label: `${rightLabel} lebih penting` },
  { value: 1/7, label: `${rightLabel} sangat lebih penting` },
  { value: 1/9, label: `${rightLabel} mutlak lebih penting` },
];

const CustomSelect = ({ value, onChange, options, recommendedValues = [] }: { value: number, onChange: (v: number) => void, options: {value: number, label: string}[], recommendedValues?: number[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.reduce((prev, curr) => 
    Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
  );
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-slate-300 hover:border-blue-400 text-slate-700 font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-colors flex items-center justify-between ${
                selected.value === opt.value 
                  ? 'bg-blue-50 text-blue-700 font-bold' 
                  : recommendedValues.some(v => Math.abs(v - opt.value) < 0.01)
                    ? 'bg-emerald-50/50 text-emerald-700 font-medium hover:bg-emerald-50'
                    : 'text-slate-600 font-medium hover:bg-slate-50'
              }`}
            >
              <span>{opt.label}</span>
              {recommendedValues.some(v => Math.abs(v - opt.value) < 0.01) && (
                <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500 drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const AHPSetupView: React.FC = () => {
  const { ahpMatrix, setAhpMatrix, isLoggedIn, setShowLoginModal, triggerToast } = useHealth();
  const [localMatrix, setLocalMatrix] = useState<AHPMatrix>(ahpMatrix);
  const [results, setResults] = useState(calculateAHP(ahpMatrix));
  const [isSmartMode, setIsSmartMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Recalculate AHP when local matrix changes
  useEffect(() => {
    setResults(calculateAHP(localMatrix));
  }, [localMatrix]);

  const handleMatrixChange = (i: number, j: number, value: number) => {
    const newMatrix = localMatrix.map(row => [...row]);
    newMatrix[i][j] = value;
    newMatrix[j][i] = 1 / value;
    
    if (isSmartMode && i === 0) {
      for(let x = 1; x < CRITERIA_LABELS.length; x++) {
        for(let y = x + 1; y < CRITERIA_LABELS.length; y++) {
          const a_0y = newMatrix[0][y];
          const a_0x = newMatrix[0][x];
          const exactVal = a_0y / a_0x;
          newMatrix[x][y] = exactVal;
          newMatrix[y][x] = 1 / exactVal;
        }
      }
    }
    
    setLocalMatrix(newMatrix);
  };

  // Auto-calculate on smart mode toggle
  useEffect(() => {
    if (isSmartMode) {
      const newMatrix = localMatrix.map(row => [...row]);
      for(let x = 1; x < CRITERIA_LABELS.length; x++) {
        for(let y = x + 1; y < CRITERIA_LABELS.length; y++) {
          const a_0y = newMatrix[0][y];
          const a_0x = newMatrix[0][x];
          const exactVal = a_0y / a_0x;
          newMatrix[x][y] = exactVal;
          newMatrix[y][x] = 1 / exactVal;
        }
      }
      setLocalMatrix(newMatrix);
    }
  }, [isSmartMode]);

  const handleSave = () => {
    if (!results.isConsistent) {
      triggerToast('Matriks tidak konsisten (CR ≥ 0.10). Harap perbaiki sebelum menyimpan.', 'error');
      return;
    }
    setAhpMatrix(localMatrix);
    triggerToast('Bobot AHP berhasil diperbarui dan diterapkan ke seluruh pasien!', 'success');
    
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleReset = () => {
    setLocalMatrix(ahpMatrix);
    triggerToast('Matriks dikembalikan ke pengaturan terakhir yang tersimpan.', 'info');
  };



  // Calculate heatmap logic
  const getInconsistentPairs = () => {
    if (results.isConsistent || results.weights.length === 0) return { redPair: null, yellowPairs: [] };
    
    let maxDeviation = 0;
    let redPair: { i: number, j: number } | null = null;
    const deviations: { pair: {i: number, j: number}, dev: number }[] = [];

    PAIRS.forEach(pair => {
      const { i, j } = pair;
      const actual = localMatrix[i][j];
      const ideal = results.weights[i] / results.weights[j];
      
      const deviation = Math.max(actual / ideal, ideal / actual);
      deviations.push({ pair, dev: deviation });
      
      if (deviation > maxDeviation) {
        maxDeviation = deviation;
        redPair = pair;
      }
    });

    const yellowPairs = deviations
      .filter(d => d.dev > 1.4 && d.pair !== redPair)
      .map(d => d.pair);

    return { redPair, yellowPairs };
  };

  const { redPair, yellowPairs } = getInconsistentPairs();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Pengaturan Bobot Kriteria (AHP)</h2>
          <p className="text-slate-500 text-sm mt-1">Tentukan prioritas dengan membandingkan antar kriteria kesehatan.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!results.isConsistent || isSaved}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-sm ${
              !results.isConsistent
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : isSaved
                  ? 'bg-emerald-500 text-white cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer'
            }`}
          >
            {isSaved ? <CheckCircle className="w-4 h-4 animate-[bounce_1s_ease-in-out_infinite]" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Tersimpan!' : 'Simpan & Terapkan'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Natural Language Input & Read-Only Matrix (Spans 8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tips Box */}
          <div className="bg-blue-50/80 rounded-2xl p-4 sm:p-5 border border-blue-100 flex gap-4">
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600 h-fit">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-blue-800 text-sm mb-1">Tips Mengisi AHP</h4>
              <p className="text-xs text-blue-700/80 leading-relaxed">
                Jaga konsistensi logika Anda. Jika <strong>A</strong> lebih penting dari <strong>B</strong>, dan <strong>B</strong> lebih penting dari <strong>C</strong>, maka pastikan <strong>A</strong> juga lebih penting dari <strong>C</strong>. 
                Gunakan <strong>Mode Smart AHP</strong> jika Anda ingin sistem menghitung otomatis logika sisa kartunya.
              </p>
            </div>
          </div>

          {/* Natural Language Dropdown Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col relative z-10">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Perbandingan Kriteria Berpasangan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Pilih tingkat kepentingan antara dua kriteria.</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsSmartMode(!isSmartMode)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors border shadow-sm ${
                  isSmartMode 
                    ? 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isSmartMode ? 'fill-amber-500' : ''}`} />
                Mode Smart AHP {isSmartMode ? 'ON' : 'OFF'}
              </button>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col gap-4 bg-slate-50">
              {PAIRS.map((pair, idx) => {
                const leftLabel = CRITERIA_LABELS[pair.i];
                const rightLabel = CRITERIA_LABELS[pair.j];
                const val = localMatrix[pair.i][pair.j];
                
                const isRed = redPair && redPair.i === pair.i && redPair.j === pair.j;
                const isYellow = yellowPairs.some(p => p.i === pair.i && p.j === pair.j);
                const isSmartDisabled = isSmartMode && pair.i !== 0;

                let cardStyle = 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md';
                if (isSmartDisabled) cardStyle = 'bg-slate-50 border-slate-200 opacity-70 pointer-events-none';
                else if (isRed) cardStyle = 'bg-red-50 border-red-300 shadow-md ring-1 ring-red-200';
                else if (isYellow) cardStyle = 'bg-amber-50 border-amber-300 shadow-md ring-1 ring-amber-200';

                return (
                  <div key={idx} className={`flex flex-col gap-3 p-4 sm:p-5 rounded-2xl border transition-all relative ${cardStyle}`}>
                    <div className="flex justify-between items-center px-1">
                      <span className="font-bold text-slate-800 text-sm">{leftLabel}</span>
                      
                      {isSmartDisabled ? (
                        <span className="text-[10px] font-black text-slate-400 bg-slate-200 px-2 py-0.5 rounded uppercase tracking-wider">
                          AUTO
                        </span>
                      ) : isRed ? (
                        <span className="text-[10px] font-black text-white bg-red-500 px-2 py-1 rounded flex items-center gap-1 shadow-sm animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          KRITIS
                        </span>
                      ) : isYellow ? (
                        <span className="text-[10px] font-black text-amber-800 bg-amber-300 px-2 py-1 rounded flex items-center gap-1 shadow-sm">
                          <AlertTriangle className="w-3 h-3" />
                          TINJAU
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">VS</span>
                      )}

                      <span className="font-bold text-slate-800 text-sm">{rightLabel}</span>
                    </div>
                    
                    <CustomSelect 
                      value={val} 
                      onChange={(v) => handleMatrixChange(pair.i, pair.j, v)}
                      options={getDynamicOptions(leftLabel, rightLabel)}
                      recommendedValues={
                        (isRed || isYellow) 
                          ? [getDynamicOptions(leftLabel, rightLabel).reduce((prev, curr) => 
                              Math.abs(curr.value - (results.weights[pair.i] / results.weights[pair.j])) < Math.abs(prev.value - (results.weights[pair.i] / results.weights[pair.j])) ? curr : prev
                            ).value]
                          : []
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Read-Only Matrix for Academic Purpose */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto flex flex-col opacity-90">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3 min-w-max">
              <div>
                <h3 className="font-bold text-slate-700 text-sm">Tabel Matriks Keputusan (AHP)</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Dihasilkan otomatis dari isian di atas (Untuk tinjauan akademis)</p>
              </div>
              <div className="px-2 py-1 bg-slate-200 text-slate-500 text-[10px] font-bold rounded uppercase">
                Read-Only
              </div>
            </div>
            
            <div className="p-4 min-w-max">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border border-slate-200 bg-slate-100 text-slate-600 font-bold">Kriteria</th>
                    {CRITERIA_LABELS.map((label, idx) => (
                      <th key={idx} className="p-2 border border-slate-200 bg-slate-100 text-slate-600 font-bold whitespace-nowrap">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA_LABELS.map((rowLabel, i) => (
                    <tr key={i}>
                      <td className="p-2 border border-slate-200 bg-slate-50 text-slate-700 font-bold whitespace-nowrap text-left px-3">
                        {rowLabel}
                      </td>
                      {CRITERIA_LABELS.map((colLabel, j) => {
                        const val = localMatrix[i][j];
                        let displayVal = val.toString();
                        if (val < 1 && val > 0) {
                          displayVal = `1/${Math.round(1/val)}`;
                        }
                        
                        let bgColor = 'bg-white';
                        let textColor = 'text-slate-600';
                        if (i === j) {
                          bgColor = 'bg-slate-200';
                          textColor = 'text-slate-400 font-bold';
                        } else if (val > 1) {
                          bgColor = 'bg-blue-50/30';
                          textColor = 'text-blue-700 font-semibold';
                        }
                        
                        return (
                          <td key={j} className={`p-2 border border-slate-200 ${bgColor} ${textColor}`}>
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Real-time Results (4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">Evaluasi AHP</h3>
              <p className="text-xs text-slate-500 mt-0.5">Hasil perhitungan otomatis</p>
            </div>
            <div className="p-5 flex flex-col items-center justify-center py-6 border-b border-slate-100">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${
                results.isConsistent ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}>
                {results.isConsistent ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
              </div>
              
              <div className="text-3xl font-black mb-1 text-slate-800">
                {(results.cr * 100).toFixed(1)}%
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
                Consistency Ratio
              </div>

              {results.isConsistent ? (
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg text-center w-full">
                  KONSISTEN (Valid digunakan)
                </div>
              ) : (
                <div className="px-4 py-2 bg-red-50 text-red-700 text-[11px] font-bold rounded-lg text-center w-full animate-pulse">
                  TIDAK KONSISTEN (Perbaiki kartu merah)
                </div>
              )}
            </div>
            
            <div className="p-5 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Bobot Prioritas Akhir</h4>
              <div className="space-y-4">
                {CRITERIA_LABELS.map((label, idx) => {
                  const weight = results.weights[idx];
                  const percent = (weight * 100).toFixed(1);
                  return (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{label}</span>
                        <span className="text-blue-600">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
