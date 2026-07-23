<div align="center">

# CardioCare MADM

### Sistem Pendukung Keputusan Prioritas Penanganan Pasien Kardiovaskular

**Menggunakan Metode AHP (*Analytic Hierarchy Process*) & TOPSIS (*Technique for Order Preference by Similarity to Ideal Solution*)**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[🌐 Live Demo](#-deployment) · [📖 Dokumentasi](#-tentang-proyek) · [🧮 Metodologi](#-metodologi-madm) · [📚 Referensi](#-referensi-akademik)

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Metodologi MADM](#-metodologi-madm)
- [Kriteria Evaluasi](#-kriteria-evaluasi)
- [Struktur Proyek](#-struktur-proyek)
- [Instalasi & Menjalankan](#-instalasi--menjalankan)
- [Hak Akses Pengguna](#-hak-akses-pengguna-rbac)
- [Screenshot](#-screenshot)
- [Referensi Akademik](#-referensi-akademik)
- [Tim Pengembang](#-tim-pengembang)
- [Lisensi](#-lisensi)

---

## 📖 Tentang Proyek

**CardioCare MADM** adalah Sistem Pendukung Keputusan (*Decision Support System*) berbasis web yang dirancang untuk membantu tenaga medis di fasilitas kesehatan tingkat pertama (Puskesmas) dalam menentukan **urutan prioritas penanganan pasien** berdasarkan tingkat risiko kardiovaskular secara **objektif, transparan, dan terukur**.

Penyakit kardiovaskular merupakan penyebab kematian nomor satu di Indonesia dan dunia (WHO, 2023). Sistem ini mengatasi permasalahan triase konvensional yang masih menggunakan pendekatan *First Come First Serve* dengan menerapkan pendekatan **Multi-Attribute Decision Making (MADM)** — menggabungkan metode **AHP** untuk pembobotan kriteria dan **TOPSIS** untuk perankingan pasien.

### 🎯 Tujuan Utama

| No | Tujuan |
|----|--------|
| 1 | Menghasilkan perankingan prioritas penanganan pasien berdasarkan skor risiko kardiovaskular |
| 2 | Memberikan rekomendasi tindakan medis otomatis (*Penanganan Segera / Konsultasi / Pantau Rutin*) |
| 3 | Menyediakan transparansi matematis (audit trail) di balik setiap keputusan perankingan |
| 4 | Mendukung integrasi data real-time dari perangkat IoT (*Smartwatch*) |

---

## ✨ Fitur Utama

### 🩺 Fitur Klinis
- **Dashboard Prioritas** — Ringkasan statistik pasien dengan distribusi risiko dan 3 pasien teratas
- **Tabel Perankingan TOPSIS** — Daftar lengkap pasien diurutkan berdasarkan skor preferensi (Ci)
- **Analisis Klinis Visual** — Grafik detak jantung real-time, gauge tekanan darah, indikator BMI
- **Catatan Konsultasi** — Form input catatan medis dan diagnosa dokter

### 🧮 Fitur Perhitungan
- **Pengaturan Bobot AHP** — Slider interaktif matriks perbandingan berpasangan dengan validator Consistency Ratio otomatis
- **Detail Perhitungan TOPSIS** — Tampilan step-by-step: Matriks Keputusan → Normalisasi → Terbobot → D⁺/D⁻ → Ci
- **Audit Trail Transparan** — Setiap angka dalam perhitungan dapat dilacak hingga 6 desimal

### 📱 Fitur Teknis
- **Responsive Design** — Optimal di Desktop (Admin) dan Mobile/HP (Dokter)
- **Role-Based Access Control (RBAC)** — Pemisahan hak akses Admin dan Dokter
- **Login Gate** — Sistem terkunci penuh sebelum autentikasi
- **Integrasi Smartwatch/IoT** — Panel sinkronisasi data real-time dari perangkat wearable
- **Failsafe Data** — 12 data pasien default otomatis muncul kembali jika data kosong
- **Panduan Pengguna** — Tutorial interaktif dengan diagram alur dan tabel perbandingan hak akses
- **12 Referensi Akademik Interaktif** — Daftar referensi yang dapat diklik, difilter, dan dieksplorasi

---

## 🛠 Tech Stack

| Kategori | Teknologi | Versi |
|----------|-----------|-------|
| **Framework** | React | 19.x |
| **Bahasa** | TypeScript | 5.8 |
| **Build Tool** | Vite | 6.x |
| **Styling** | Tailwind CSS | 4.x |
| **Animasi** | Motion (Framer Motion) | 12.x |
| **Ikon** | Lucide React | 0.546 |
| **Deployment** | Vercel | - |

---

## 🏗 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Desktop UI  │  │  Mobile UI   │  │  Login Gate  │  │
│  │  (Sidebar)   │  │ (Bottom Nav) │  │  (Auth Wall) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│  ┌──────┴─────────────────┴──────────────────┴───────┐  │
│  │              COMPONENT LAYER (19 Views)            │  │
│  │  Dashboard │ Ranking │ Analysis │ AHP Setup │ ... │  │
│  └──────────────────────┬────────────────────────────┘  │
├─────────────────────────┼───────────────────────────────┤
│                  BUSINESS LOGIC LAYER                    │
│  ┌──────────────────────┴────────────────────────────┐  │
│  │            HealthContext (State Manager)           │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌────────────┐ │  │
│  │  │  AHP Calc   │  │ TOPSIS Calc │  │  RBAC Auth │ │  │
│  │  │  (ahp.ts)   │  │ (topsis.ts) │  │  (Users)   │ │  │
│  │  └────────────┘  └─────────────┘  └────────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│                    DATA LAYER                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  LocalStorage + Hardcoded Failsafe (12 Patients)  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🧮 Metodologi MADM

### Alur Kerja Sistem

```
[INPUT]                    [PROSES]                    [OUTPUT]
                    ┌──────────────────┐
Admin input    ───► │  AHP: Hitung     │
data vital         │  bobot kriteria  │ ───► Dokter melihat
pasien             │  (W₁...W₅)       │      ranking prioritas
(Manual/IoT)       ├──────────────────┤      pasien + rekomendasi
                   │  TOPSIS: Hitung  │      tindakan medis
                   │  skor Ci setiap  │
                   │  pasien          │
                   └──────────────────┘
```

### 1. AHP — Pembobotan Kriteria

Bobot ditentukan menggunakan **Analytic Hierarchy Process** (Saaty, 1980) melalui matriks perbandingan berpasangan:

|  | C1 | C2 | C3 | C4 | C5 |
|--|----|----|----|----|-----|
| **C1** | 1 | 2 | 3 | 4 | 5 |
| **C2** | 1/2 | 1 | 2 | 3 | 4 |
| **C3** | 1/3 | 1/2 | 1 | 2 | 3 |
| **C4** | 1/4 | 1/3 | 1/2 | 1 | 2 |
| **C5** | 1/5 | 1/4 | 1/3 | 1/2 | 1 |

**Consistency Ratio = 0.016 < 0.10** ✅ Valid

### 2. TOPSIS — Perankingan Pasien

1. Matriks Keputusan (X) → 12 pasien × 5 kriteria
2. Normalisasi Vektor: `rᵢⱼ = xᵢⱼ / √(Σxᵢⱼ²)`
3. Matriks Terbobot: `vᵢⱼ = wⱼ × rᵢⱼ`
4. Solusi Ideal Positif (A⁺) & Negatif (A⁻)
5. Jarak Euclidean: D⁺ dan D⁻
6. **Skor Preferensi: `Cᵢ = D⁻ / (D⁺ + D⁻)`** — Range 0 hingga 1

---

## 📊 Kriteria Evaluasi

| Kode | Kriteria | Satuan | Sifat | Bobot |
|------|----------|--------|-------|-------|
| **C1** | Tekanan Darah (Sistolik/Diastolik) | mmHg | Cost ↑ | **35.4%** |
| **C2** | Detak Jantung (*Resting HR*) | BPM | Cost ↑ | **24.1%** |
| **C3** | Riwayat Medis & Komorbiditas | Skor 0–1 | Cost ↑ | **18.5%** |
| **C4** | Indeks Massa Tubuh (BMI) | kg/m² | Cost ↑ | **12.0%** |
| **C5** | Level Aktivitas Fisik | Skor 0–1 | Benefit ↓ | **10.0%** |

> **Cost** = semakin tinggi nilainya, semakin buruk (berisiko)  
> **Benefit** = semakin tinggi nilainya, semakin baik (sehat)

---

## 📁 Struktur Proyek

```
cardiocare-madm/
├── public/                     # Static assets
├── src/
│   ├── components/             # 19 React Components
│   │   ├── AboutSystemView.tsx       # Halaman tentang sistem + referensi
│   │   ├── AHPSetupView.tsx          # Pengaturan bobot AHP (Admin)
│   │   ├── AnalysisView.tsx          # Analisis klinis visual (Dokter)
│   │   ├── CalculationDetailView.tsx # Detail perhitungan TOPSIS
│   │   ├── ConsultationView.tsx      # Catatan konsultasi (Dokter)
│   │   ├── DashboardView.tsx         # Dashboard utama
│   │   ├── DeviceView.tsx            # Integrasi Smartwatch/IoT
│   │   ├── LoginModal.tsx            # Modal login Admin/Dokter
│   │   ├── ManualEntryView.tsx       # Input data pasien (Admin)
│   │   ├── MobileNav.tsx             # Bottom Navigation (Mobile)
│   │   ├── Navbar.tsx                # Top Navigation Bar
│   │   ├── ProfileView.tsx           # Profil pengguna
│   │   ├── RankingView.tsx           # Tabel perankingan TOPSIS
│   │   ├── Sidebar.tsx               # Desktop Sidebar Navigation
│   │   ├── TutorialView.tsx          # Panduan pengguna
│   │   └── ...                       # Toast, Confirm, Alert, ImageModal
│   ├── context/
│   │   └── HealthContext.tsx   # State Manager + Failsafe Logic
│   ├── utils/
│   │   ├── ahp.ts             # AHP calculation engine
│   │   └── topsis.ts          # TOPSIS calculation engine
│   ├── types.ts               # TypeScript type definitions
│   ├── App.tsx                # Root component + Login Gate
│   └── index.css              # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Instalasi & Menjalankan

### Prasyarat

- **Node.js** >= 18.x
- **npm** >= 9.x

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/Nadhif-Pramudya49/CardioCare_MADM.git

# 2. Masuk ke direktori proyek
cd CardioCare_MADM

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev
```

Buka browser dan akses `http://localhost:3000`

### Build untuk Production

```bash
npm run build
npm run preview
```

---

## 🔐 Hak Akses Pengguna (RBAC)

Sistem mengimplementasikan **Role-Based Access Control** dengan dua peran:

| Fitur | 🛡️ Admin | 🩺 Dokter |
|-------|----------|----------|
| Dashboard | ✅ | ✅ |
| Tabel Perankingan | ✅ | ✅ |
| Detail Perhitungan TOPSIS | ✅ | ✅ |
| Tentang Sistem & Referensi | ✅ | ✅ |
| Panduan Pengguna | ✅ | ✅ |
| Input Data Pasien | ✅ | ❌ |
| Integrasi Smartwatch | ✅ | ❌ |
| Pengaturan Bobot AHP | ✅ | ❌ |
| Analisis Klinis Visual | ❌ | ✅ |
| Catatan Konsultasi | ❌ | ✅ |

### Akun Demo

| Peran | Username | Password |
|-------|----------|----------|
| Admin | `admin` | `admin123` |
| Dokter | `dokter` | `dokter123` |

---

## 📸 Screenshot

### Login Gate
> Halaman pemblokir akses — pengguna wajib login sebelum mengakses sistem

### Dashboard (Desktop — Admin)
> Ringkasan statistik pasien, distribusi risiko, dan 3 pasien prioritas teratas

### Tabel Perankingan (Mobile — Dokter)
> Daftar pasien diurutkan berdasarkan skor TOPSIS dengan label risiko berwarna

### Pengaturan Bobot AHP (Admin Only)
> Slider interaktif matriks perbandingan berpasangan + validator CR otomatis

### Detail Perhitungan TOPSIS
> Step-by-step audit trail matematis dari matriks keputusan hingga skor akhir

---

## 📚 Referensi Akademik

| No | Penulis | Tahun | Judul | Relevansi |
|----|---------|-------|-------|-----------|
| 1 | Dawber, T.R., et al. | 1951 | Epidemiological Approaches to Heart Disease: The Framingham Study | Landasan etiologis faktor risiko kardiovaskular |
| 2 | Saaty, T.L. | 1980 | The Analytic Hierarchy Process | Fondasi teoretis metode AHP |
| 3 | Hwang, C.L., & Yoon, K. | 1981 | Multiple Attribute Decision Making | Fondasi teoretis metode TOPSIS |
| 4 | D'Agostino, R.B., et al. | 2008 | General Cardiovascular Risk Profile (Framingham) | Validasi pemilihan kriteria klinis |
| 5 | Liberatore, M.J., & Nydick, R.L. | 2008 | AHP in Medical and Health Care Decision Making | Validasi AHP untuk SPK medis |
| 6 | Schmidt, K., et al. | 2015 | AHP in Healthcare Research: Systematic Review | Metodologi AHP dalam riset kesehatan |
| 7 | WHO CVD Risk Chart Working Group | 2019 | WHO CVD Risk Charts for 8530 Populations | Konsensus global multikriteria kardiovaskular |
| 8 | Kumar & Raj | 2022 | AHP + ML Prediction Model for Heart Disease | Hibrida AHP + Machine Learning |
| 9 | Zhang et al. | 2023 | Fuzzy AHP + TOPSIS untuk Risiko Kardiovaskular | Bobot kriteria tekanan darah >55% |
| 10 | Aydın & Özkan | 2024 | Pythagorean Fuzzy AHP–TOPSIS untuk CVD | Fuzzy-MCDM pada epidemiologi |
| 11 | Nirwan et al. | 2024 | Komparatif AHP-TOPSIS vs AHP-SAW | TOPSIS lebih stabil dari SAW |
| 12 | Nasyuha et al. | 2025 | TOPSIS untuk Stratifikasi Risiko Pasien | Validasi score gap TOPSIS |

---

## 👨‍💻 Tim Pengembang

<div align="center">

| No | Nama | NIM |
|----|------|-----|
| 1 | **Sandi Ramadani** | 24523162 |
| 2 | **Aditya Fajar Aritama** | 24523163 |
| 3 | **Nadhif Pramudya** | 24523179 |
| 4 | **Muhammad Luthfi** | 24523234 |

**Universitas Islam Indonesia**  
Fakultas Teknologi Industri — Informatika  
Mata Kuliah: Sistem Cerdas dan Pendukung Keputusan  
Semester 4 — Tahun Ajaran 2025/2026

</div>

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan akademik pada mata kuliah **Sistem Cerdas dan Pendukung Keputusan** di **Universitas Islam Indonesia**.

---

<div align="center">

**CardioCare MADM** — *Prioritizing Lives Through Data-Driven Decisions*

Made by Kelompok Menuju Indonesia Emas — UII 2026

</div>
