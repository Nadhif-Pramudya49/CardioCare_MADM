import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import {
  BookOpen, Info, ShieldCheck, Cpu, ArrowRight, ExternalLink,
  ChevronDown, ChevronUp, Users, Heart, Calculator, Award, BookMarked
} from 'lucide-react';

interface Reference {
  id: number;
  authors: string;
  year: number;
  title: string;
  description: string;
  foundation: string;
  url: string;
  journal: string;
  doi: string;
  tag: 'Medis' | 'AHP' | 'TOPSIS' | 'Hibrida' | 'WHO';
}

const references: Reference[] = [
  {
    id: 1,
    authors: 'Dawber, T. R., Meadors, G. F., & Moore, F. E.',
    year: 1951,
    title: 'Epidemiological Approaches to Heart Disease: The Framingham Study',
    description: 'Membuktikan bahwa penyakit kardiovaskular memiliki hubungan kausal langsung dengan faktor risiko spesifik (hipertensi, kolesterol, obesitas, merokok) dan bukan sekadar proses penuaan alami.',
    foundation: 'Landasan etiologis medis primer bahwa variabel risiko klinis dapat diidentifikasi dan diukur secara kuantitatif.',
    url: 'https://doi.org/10.2105/AJPH.41.3.279',
    journal: 'American Journal of Public Health',
    doi: '10.2105/AJPH.41.3.279',
    tag: 'Medis',
  },
  {
    id: 2,
    authors: "D'Agostino, R. B., et al.",
    year: 2008,
    title: 'General Cardiovascular Risk Profile for Use in Primary Care: The Framingham Heart Study',
    description: 'Membuktikan bahwa kombinasi beberapa variabel klinis baku (usia, tekanan darah, merokok, kolesterol, diabetes) dapat dikuantifikasi ke dalam satu model skoring matematis.',
    foundation: 'Landasan operasional dalam pemilihan himpunan kriteria/fitur yang baku dan tervalidasi medis untuk SPK.',
    url: 'https://doi.org/10.1161/CIRCULATIONAHA.107.699579',
    journal: 'Circulation — American Heart Association',
    doi: '10.1161/CIRCULATIONAHA.107.699579',
    tag: 'Medis',
  },
  {
    id: 3,
    authors: 'Aydın, G. Z., & Özkan, B.',
    year: 2024,
    title: 'Evaluation of Low- and Middle-Income Countries According to Cardiovascular Disease Risk Factors Using Interval-Valued Pythagorean Fuzzy AHP–TOPSIS',
    description: 'Membuktikan bahwa integrasi Fuzzy AHP dan TOPSIS sangat efektif dalam menangani ambiguitas dan ketidakpastian data kesehatan di negara berkembang.',
    foundation: 'Penerapan metode Fuzzy-MCDM tingkat lanjut pada pemodelan epidemiologi dan pengambilan keputusan klinis yang kompleks.',
    url: 'https://doi.org/10.1186/s12911-024-02769-9',
    journal: 'BMC Medical Informatics and Decision Making',
    doi: '10.1186/s12911-024-02769-9',
    tag: 'Hibrida',
  },
  {
    id: 4,
    authors: 'Zhang et al.',
    year: 2023,
    title: 'Fuzzy AHP + TOPSIS untuk Penilaian Faktor Risiko Kardiovaskular',
    description: 'Membuktikan bahwa variabel tekanan darah dan riwayat medis pasien mendominasi penentuan tingkat risiko kardiovaskular dengan akumulasi bobot melebihi 55%.',
    foundation: 'Penetapan besaran bobot prioritas untuk kriteria utama dalam matriks perbandingan berpasangan AHP.',
    url: 'https://doi.org/10.1016/j.cmpb.2023.107621',
    journal: 'Computer Methods and Programs in Biomedicine',
    doi: '10.1016/j.cmpb.2023.107621',
    tag: 'Hibrida',
  },
  {
    id: 5,
    authors: 'Kumar & Raj',
    year: 2022,
    title: 'AHP and Machine Learning Based Prediction Model for Heart Disease',
    description: 'Membuktikan bahwa mengintegrasikan bobot berbasis pakar (AHP) ke dalam model Machine Learning meningkatkan akurasi prediksi penyakit jantung sebesar 4,2%.',
    foundation: 'Pengembangan model hibrida SPK + Machine Learning yang menggabungkan domain knowledge pakar medis dengan pembelajaran berbasis data.',
    url: 'https://doi.org/10.1007/978-981-16-8892-8_45',
    journal: 'Springer — Advances in Intelligent Systems and Computing',
    doi: '10.1007/978-981-16-8892-8_45',
    tag: 'Hibrida',
  },
  {
    id: 6,
    authors: 'Nirwan et al.',
    year: 2024,
    title: 'Analisis Komparatif AHP-TOPSIS vs AHP-SAW',
    description: 'Membuktikan bahwa AHP-TOPSIS memiliki stabilitas keputusan yang jauh lebih tinggi dan tahan terhadap nilai ekstrem dibandingkan AHP-SAW pada data klinis pasien.',
    foundation: 'Pemilihan metode perankingan TOPSIS di atas metode additif sederhana (SAW) untuk menjaga keandalan sistem pada skenario medis krisis.',
    url: 'https://jutif.unsoed.ac.id',
    journal: 'Jurnal Teknik Informatika dan Sistem Informasi (JUTIF)',
    doi: 'JUTIF Vol.5',
    tag: 'TOPSIS',
  },
  {
    id: 7,
    authors: 'Nasyuha et al.',
    year: 2025,
    title: 'Penerapan Metode TOPSIS untuk Stratifikasi Risiko Pasien',
    description: 'Membuktikan bahwa kalkulasi nilai preferensi TOPSIS menghasilkan rentang skor (score gap) yang jelas dan tegas antara pasien berisiko tinggi dan sedang.',
    foundation: 'Stratifikasi dan klasifikasi kategori risiko pasien guna meminimalkan kesalahan batas (borderline error) pada penetapan tindakan klinis.',
    url: 'https://jurnal.mib.ac.id',
    journal: 'Media Informatika Budidarma (MIB)',
    doi: 'MIB Vol.9',
    tag: 'TOPSIS',
  },
  {
    id: 8,
    authors: 'Saaty, T. L.',
    year: 1980,
    title: 'The Analytic Hierarchy Process: Planning, Priority Setting, Resource Allocation',
    description: 'Membuktikan bahwa masalah keputusan multikriteria yang rumit dapat diselesaikan secara objektif melalui dekomposisi hierarki, perbandingan berpasangan, dan pengujian konsistensi logis (CR < 0.1).',
    foundation: 'Sumber primer teoretis matematis bagi seluruh prosedur dan rumus penentuan bobot kriteria AHP yang diimplementasikan di sistem ini.',
    url: 'https://doi.org/10.1016/0377-2217(82)90155-1',
    journal: 'McGraw-Hill, New York',
    doi: '10.1016/0377-2217(82)90155-1',
    tag: 'AHP',
  },
  {
    id: 9,
    authors: 'Hwang, C. L., & Yoon, K.',
    year: 1981,
    title: 'Multiple Attribute Decision Making: Methods and Applications',
    description: 'Membuktikan bahwa perankingan alternatif terbaik dapat dihitung berdasarkan jarak Euclidean terdekat dari Solusi Ideal Positif (PIS) dan jarak terjauh dari Solusi Ideal Negatif (NIS).',
    foundation: 'Sumber primer teoretis matematis bagi seluruh tahapan kalkulasi dan formula algoritma perankingan TOPSIS yang diimplementasikan di sistem ini.',
    url: 'https://doi.org/10.1007/978-3-642-48318-0',
    journal: 'Springer-Verlag, Berlin',
    doi: '10.1007/978-3-642-48318-0',
    tag: 'TOPSIS',
  },
  {
    id: 10,
    authors: 'WHO CVD Risk Chart Working Group',
    year: 2019,
    title: 'World Health Organization Cardiovascular Disease Risk Charts: Revised Charts for 8530 Regional Populations',
    description: 'Membuktikan bahwa penilaian risiko kardiovaskular secara akurat harus menggunakan pendekatan gabungan (multicriteria) melibatkan usia, tekanan darah, diabetes, merokok, dan BMI/kolesterol.',
    foundation: 'Konsensus medis tingkat dunia (WHO) yang memvalidasi bahwa penggunaan banyak kriteria secara bersamaan adalah standar ilmiah resmi.',
    url: 'https://doi.org/10.1016/S2214-109X(19)30318-3',
    journal: 'The Lancet Global Health',
    doi: '10.1016/S2214-109X(19)30318-3',
    tag: 'WHO',
  },
  {
    id: 11,
    authors: 'Schmidt, K., et al.',
    year: 2015,
    title: 'Applying the Analytic Hierarchy Process in Healthcare Research: A Systematic Literature Review and Evaluation of Reporting',
    description: 'Membuktikan bahwa AHP merupakan metode MCDM yang shahih, teruji, dan memiliki kerangka baku yang dapat dipertanggungjawabkan untuk riset medis.',
    foundation: 'Landasan metodologis untuk membenarkan penggunaan prosedur AHP (struktur hierarki hingga Consistency Ratio) dalam konteks penelitian kesehatan.',
    url: 'https://doi.org/10.1186/s12911-015-0157-x',
    journal: 'BMC Medical Informatics and Decision Making',
    doi: '10.1186/s12911-015-0157-x',
    tag: 'AHP',
  },
  {
    id: 12,
    authors: 'Liberatore, M. J., & Nydick, R. L.',
    year: 2008,
    title: 'The Analytic Hierarchy Process in Medical and Health Care Decision Making: A Literature Review',
    description: 'Membuktikan bahwa AHP secara empiris telah berhasil diterapkan luas untuk mengatasi berbagai masalah keputusan klinis, seperti triage prioritas pasien dan pemilihan prosedur terapi.',
    foundation: 'Tinjauan pustaka (state-of-the-art) yang mengonfirmasi efektivitas dan relevansi penerapan AHP dalam ranah sistem keputusan medis.',
    url: 'https://doi.org/10.1016/j.ejor.2007.05.001',
    journal: 'European Journal of Operational Research',
    doi: '10.1016/j.ejor.2007.05.001',
    tag: 'AHP',
  },
];

const tagColors: Record<string, string> = {
  Medis: 'bg-red-50 text-red-600 border-red-200',
  AHP: 'bg-blue-50 text-blue-600 border-blue-200',
  TOPSIS: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  Hibrida: 'bg-purple-50 text-purple-600 border-purple-200',
  WHO: 'bg-green-50 text-green-600 border-green-200',
};

const teamMembers = [
  { no: 1, name: 'Sandi Ramadani', nim: '24523162' },
  { no: 2, name: 'Aditya Fajar Aritama', nim: '24523163' },
  { no: 3, name: 'Nadhif Pramudya', nim: '24523179' },
  { no: 4, name: 'Muhammad Luthfi', nim: '24523234' },
];

const ReferenceCard: React.FC<{ ref: Reference; index: number }> = ({ ref: r, index }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4 cursor-pointer"
      >
        {/* Number badge */}
        <span className="shrink-0 w-8 h-8 bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 rounded-xl flex items-center justify-center text-xs font-black transition-colors">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tagColors[r.tag]}`}>
              {r.tag}
            </span>
            <span className="text-xs text-slate-400 font-medium">{r.year}</span>
          </div>
          <p className="text-sm font-bold text-slate-800 leading-snug">{r.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">{r.authors}</p>
        </div>
        <span className="shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-3 animate-fade-in">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Deskripsi & Temuan</p>
            <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Landasan dalam Sistem</p>
            <p className="text-xs text-blue-700 leading-relaxed font-medium">{r.foundation}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div>
              <p className="text-[10px] text-slate-400 font-medium">{r.journal}</p>
              <p className="text-[10px] text-slate-400 font-mono">DOI: {r.doi}</p>
            </div>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-blue-300 active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Buka Referensi
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export const AboutSystemView: React.FC = () => {
  const { setActiveView } = useHealth();
  const [activeFilter, setActiveFilter] = useState<string>('Semua');
  const filters = ['Semua', 'Medis', 'AHP', 'TOPSIS', 'Hibrida', 'WHO'];
  const filtered = activeFilter === 'Semua' ? references : references.filter(r => r.tag === activeFilter);

  return (
    <div className="space-y-10 pb-16 animate-fade-in max-w-5xl mx-auto">

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">CardioCare MADM</h1>
            <p className="text-blue-300 font-semibold text-sm mt-0.5">Sistem Pendukung Keputusan Prioritas Pasien Kardiovaskular</p>
            <p className="text-slate-400 text-xs leading-relaxed mt-2 max-w-2xl">
              Sistem berbasis <strong className="text-white">Multi-Attribute Decision Making (MADM)</strong> yang mengintegrasikan metode 
              AHP untuk pembobotan kriteria dan TOPSIS untuk perankingan pasien, guna mendukung pengambilan 
              keputusan medis yang objektif dan terukur di fasilitas kesehatan tingkat pertama.
            </p>
          </div>
        </div>
      </div>

      {/* Methodology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AHP Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Metode AHP</h2>
                <p className="text-xs text-slate-400 font-medium">Analytic Hierarchy Process — Saaty (1980)</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Digunakan untuk menentukan bobot relatif dari setiap kriteria kesehatan kardiovaskular melalui perbandingan berpasangan (<em>pairwise comparison</em>) antar kriteria klinis oleh pakar medis.
            </p>
            <ul className="space-y-2">
              {['Memastikan konsistensi penilaian pakar (CR < 0.10)', 'Menghasilkan bobot eigenvector yang akurat', 'Mencegah subjektivitas dalam penentuan prioritas'].map(item => (
                <li key={item} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* TOPSIS Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Metode TOPSIS</h2>
                <p className="text-xs text-slate-400 font-medium">Hwang & Yoon (1981)</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Digunakan untuk meranking pasien berdasarkan kedekatan relatif ke solusi ideal. Pasien paling kritis adalah yang terdekat ke Solusi Ideal Negatif (kondisi terburuk).
            </p>
            <button
              onClick={() => setActiveView('calculation-detail')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Lihat Detail Perhitungan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Evaluation Criteria */}
      <div className="bg-slate-900 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5">
          <Info className="w-5 h-5 text-blue-400" />
          Kriteria Evaluasi & Bobot AHP
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            { code: 'C1', label: 'Tekanan Darah', weight: '35.4%', type: 'COST', color: 'red' },
            { code: 'C2', label: 'Detak Jantung', weight: '24.1%', type: 'COST', color: 'red' },
            { code: 'C3', label: 'Komorbiditas', weight: '18.5%', type: 'COST', color: 'red' },
            { code: 'C4', label: 'BMI', weight: '12.0%', type: 'COST', color: 'red' },
            { code: 'C5', label: 'Aktivitas Fisik', weight: '10.0%', type: 'BENEFIT', color: 'green' },
          ].map(c => (
            <div key={c.code} className="bg-slate-800 rounded-xl p-4 text-center border border-slate-700">
              <p className="text-xs font-black text-slate-400 mb-1">{c.code}</p>
              <p className="text-sm font-bold text-white leading-tight mb-2">{c.label}</p>
              <p className="text-xl font-black text-blue-400 mb-2">{c.weight}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.type === 'COST' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                {c.type}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-medium">
          Atribut <strong className="text-red-400">COST</strong> = semakin tinggi nilainya, semakin buruk kondisinya. 
          Atribut <strong className="text-green-400">BENEFIT</strong> = semakin tinggi nilainya, semakin baik kondisinya. 
          Consistency Ratio (CR) = <strong className="text-blue-400">0.016 &lt; 0.1</strong> ✓ Valid.
        </p>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-blue-600" />
          Anggota Kelompok
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {teamMembers.map(m => (
            <div key={m.nim} className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-2xl transition-all group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm group-hover:shadow-blue-300 transition-shadow">
                {m.no}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{m.name}</p>
                <p className="text-xs text-slate-400 font-mono font-medium">{m.nim}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4 font-medium">
          Universitas Islam Indonesia — Sistem Cerdas dan Pendukung Keputusan, Semester 4
        </p>
      </div>

      {/* References Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-blue-600" />
              Daftar Referensi
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {references.length} referensi akademik — klik untuk melihat detail & membuka tautan
            </p>
          </div>
          {/* Filter tags */}
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((r, i) => (
            <ReferenceCard key={r.id} ref={r} index={references.indexOf(r)} />
          ))}
        </div>
      </div>

    </div>
  );
};
