import React from 'react';
import { useHealth } from '../context/HealthContext';
import { 
  HelpCircle, Terminal, Stethoscope, ChevronRight, Activity, ArrowRight, Server, FileSignature,
  LayoutDashboard, Trophy, FileEdit, Scale, Calculator, Watch, FileText, User, Info, CheckCircle2, XCircle
} from 'lucide-react';

export const TutorialView: React.FC = () => {
  const { currentUser } = useHealth();
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Title block */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-sans text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          Panduan Penggunaan Sistem
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Langkah demi langkah dan penjelasan fitur khusus untuk peran Anda saat ini: 
          <strong className="text-blue-600 ml-1 uppercase">{currentUser?.role || 'Guest'}</strong>.
        </p>
      </div>

      {/* Keseluruhan Alur Kerja (Untuk Semua Role) */}
      <div className="pt-2 pb-6 border-b border-slate-200 mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-blue-600" />
          Alur Kerja Keseluruhan Sistem CardioCare
        </h2>
        
        <div className="bg-slate-900 rounded-2xl p-6 shadow-sm overflow-x-auto">
          <div className="flex items-start md:items-center min-w-max gap-4 p-4 text-white">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center max-w-[140px] text-center gap-3">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
                <Terminal className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-blue-300">1. Admin</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Input pasien & sinkronisasi Smartwatch</p>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-700 shrink-0 mt-4 md:mt-0" />

            {/* Step 2 */}
            <div className="flex flex-col items-center max-w-[140px] text-center gap-3">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
                <Server className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-purple-300">2. Sistem MADM</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">AHP menghitung bobot, TOPSIS menghitung ranking</p>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-700 shrink-0 mt-4 md:mt-0" />

            {/* Step 3 */}
            <div className="flex flex-col items-center max-w-[140px] text-center gap-3">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
                <Stethoscope className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-300">3. Dokter</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Melihat ranking dan menganalisis visualisasi data</p>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-700 shrink-0 mt-4 md:mt-0" />

            {/* Step 4 */}
            <div className="flex flex-col items-center max-w-[140px] text-center gap-3">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
                <FileSignature className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-300">4. Penanganan</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Pasien dirawat, catatan medis direkam ke DB</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Perbandingan Hak Akses */}
      <div className="pt-2 pb-6 border-b border-slate-200 mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Server className="w-6 h-6 text-indigo-600" />
          Pembagian Hak Akses Fitur (Role Permissions)
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Sistem ini menggunakan struktur keamanan role-based di mana setiap peran hanya dapat melihat dan menggunakan fitur yang relevan dengan tanggung jawab klinisnya.
        </p>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-slate-700 w-1/2">Nama Menu / Fitur</th>
                  <th className="p-4 font-bold text-slate-700 text-center w-1/4">Admin IT</th>
                  <th className="p-4 font-bold text-slate-700 text-center w-1/4">Dokter Medis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3 font-medium text-slate-700"><LayoutDashboard className="w-4 h-4 text-slate-400"/> Dashboard Utama</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3 font-medium text-slate-700"><Trophy className="w-4 h-4 text-slate-400"/> Tabel Perankingan (TOPSIS)</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50 bg-blue-50/30">
                  <td className="p-4 flex items-center gap-3 font-medium text-blue-900"><FileEdit className="w-4 h-4 text-blue-500"/> Data Pasien (Input Manual)</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 text-red-300 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50 bg-blue-50/30">
                  <td className="p-4 flex items-center gap-3 font-medium text-blue-900"><Watch className="w-4 h-4 text-blue-500"/> Integrasi Smartwatch</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 text-red-300 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50 bg-blue-50/30">
                  <td className="p-4 flex items-center gap-3 font-medium text-blue-900"><Scale className="w-4 h-4 text-blue-500"/> Pengaturan Bobot AHP</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 text-red-300 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3 font-medium text-slate-700"><Calculator className="w-4 h-4 text-slate-400"/> Detail Perhitungan Matematika</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50 bg-emerald-50/30">
                  <td className="p-4 flex items-center gap-3 font-medium text-emerald-900"><Activity className="w-4 h-4 text-emerald-500"/> Analisis Detail Klinis</td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 text-red-300 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50 bg-emerald-50/30">
                  <td className="p-4 flex items-center gap-3 font-medium text-emerald-900"><FileText className="w-4 h-4 text-emerald-500"/> Catatan Medis (Konsultasi)</td>
                  <td className="p-4 text-center"><XCircle className="w-5 h-5 text-red-300 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3 font-medium text-slate-700"><User className="w-4 h-4 text-slate-400"/> Profil Saya, Panduan, Tentang</td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAdmin ? (
        <div className="space-y-8">
          {/* Admin Tutorial */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-slate-600" />
              Alur Kerja Admin Puskesmas
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              
              <Step 
                number={1} 
                title="Data Pasien atau Sinkronisasi Smartwatch"
                desc="Admin bertanggung jawab mengumpulkan data vital pasien ke dalam sistem. Data bisa didapat dari pengukuran manual (di menu 'Data Pasien') atau secara real-time via IoT (di menu 'Integrasi Smartwatch')."
                features={[
                  "Menu: Integrasi Smartwatch -> Pilih pasien, lalu 'Sinkronkan Sekarang' untuk menarik data detak jantung & aktivitas.",
                  "Menu: Data Pasien -> Ketik tekanan darah, gula darah, dan keluhan manual."
                ]}
              />

              <Step 
                number={2} 
                title="Penyesuaian Bobot AHP (Opsional)"
                desc="Jika kebijakan medis atau kepala dokter mengubah prioritas parameter kesehatan (misalnya: Tekanan Darah dianggap jauh lebih penting daripada BMI bulan ini), Admin dapat mengatur ulang matriks AHP."
                features={[
                  "Menu: Pengaturan Bobot AHP -> Geser slider untuk mengatur perbandingan tingkat kepentingan antar kriteria (1 hingga 9).",
                  "Sistem otomatis menghitung Consistency Ratio (CR) untuk mencegah subjektivitas."
                ]}
              />

              <Step 
                number={3} 
                title="Pantau Tabel Perankingan (TOPSIS)"
                desc="Setelah data pasien masuk dan bobot AHP valid, sistem secara mandiri menghitung peringkat pasien. Pasien dengan skor TOPSIS tertinggi adalah pasien yang kondisinya paling butuh pertolongan segera."
                features={[
                  "Menu: Tabel Perankingan -> Tabel yang memilah pasien dari urutan 1 (kritis) sampai terakhir (sehat).",
                  "Admin bertugas memanggil pasien ke ruangan dokter berdasarkan urutan ranking ini, BUKAN berdasarkan urutan kedatangan (First Come First Serve)."
                ]}
              />

              <Step 
                number={4} 
                title="Audit Detail Perhitungan"
                desc="Bila ada dokter atau pimpinan yang mempertanyakan mengapa pasien A diurutkan lebih dulu dari B, Admin bisa membuka rincian matematika pengambilan keputusannya secara transparan."
                features={[
                  "Menu: Detail Perhitungan -> Menampilkan seluruh matriks keputusan dari awal hingga perhitungan D+ (Jarak Positif) dan D- (Jarak Negatif)."
                ]}
              />

            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Doctor Tutorial */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Alur Kerja Dokter
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              
              <Step 
                number={1} 
                title="Lihat Daftar Prioritas (Tabel Perankingan)"
                desc="Dokter tidak perlu pusing memikirkan siapa yang harus ditangani terlebih dahulu. Buka menu Tabel Perankingan untuk melihat antrean cerdas (smart queue) yang sudah disusun oleh AI berdasarkan MADM."
                features={[
                  "Menu: Tabel Perankingan -> Panggil pasien dengan Rank #1 (Skor TOPSIS tertinggi). Skor mendekati 1.0 berarti pasien berisiko tinggi (mendekati solusi ideal negatif penyakit)."
                ]}
              />

              <Step 
                number={2} 
                title="Analisis Kondisi Pasien (Analisis Detail)"
                desc="Sebelum pasien masuk, klik tombol panah kanan di tabel ranking untuk melihat visualisasi kesehatan pasien secara detail, termasuk komorbiditas dan riwayat keluhan."
                features={[
                  "Menu: Analisis Detail -> Memunculkan grafik Radar/Spider Chart yang membandingkan kondisi pasien saat ini dengan batas normal.",
                  "Dokter bisa langsung melihat apakah anomali terletak di Tekanan Darah atau Detak Jantung tanpa harus membaca angka mentah."
                ]}
              />

              <Step 
                number={3} 
                title="Beri Diagnosa dan Resep (Catatan Medis)"
                desc="Lakukan konsultasi dengan pasien. Setelah selesai, rekam catatan penanganan medis di sistem agar terekam ke dalam rekam jejak digital."
                features={[
                  "Menu: Catatan Medis -> Pilih pasien dari dropdown, ketik resep/diagnosa di area teks, lalu klik 'Simpan Catatan'.",
                  "Catatan ini akan diperbarui dan tersimpan permanen dalam rekam medis sang pasien."
                ]}
              />

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const Step: React.FC<{ number: number; title: string; desc: string; features: string[] }> = ({ number, title, desc, features }) => {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-600 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:bg-blue-600 group-hover:text-white transition-colors z-10">
        {number}
      </div>
      
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {desc}
        </p>
        <div className="space-y-2 border-t border-slate-200 pt-3 mt-2">
          {features.map((f, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
              <span className="text-[11px] text-slate-600 font-medium leading-relaxed">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
