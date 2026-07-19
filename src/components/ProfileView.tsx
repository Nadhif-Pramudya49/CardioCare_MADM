import React from 'react';
import { useHealth } from '../context/HealthContext';
import { User, LogOut, CheckCircle, ShieldCheck, Mail, Building, MapPin } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, isLoggedIn, setShowLoginModal, logout } = useHealth();

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12 animate-fade-in">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Profil Terkunci</h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Silakan masuk menggunakan akun Tenaga Medis untuk melihat profil Anda.
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98"
        >
          Masuk Akun Sekarang
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Title block */}
      <div>
        <h1 className="font-sans text-2xl font-bold text-slate-800 tracking-tight">Profil Tenaga Medis</h1>
        <p className="text-sm text-slate-500 font-medium mt-0.5">
          Informasi kredensial dan pengaturan akun Anda di sistem CardioCare MADM.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-12 items-start relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full pointer-events-none -z-0"></div>

        {/* Left Side: Avatar */}
        <div className="flex flex-col items-center gap-4 z-10 shrink-0 mx-auto md:mx-0">
          <div className="w-40 h-40 rounded-full bg-slate-100 border-8 border-white shadow-lg flex items-center justify-center overflow-hidden">
            {currentUser.role === 'dokter' ? (
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&h=300&q=80" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-20 h-20 text-slate-400" />
            )}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Status: Online Aktif
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 space-y-8 z-10 w-full">
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-1">{currentUser.name}</h2>
            <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-wider text-xs">
              <ShieldCheck className="w-4 h-4" />
              Peran: {currentUser.role === 'dokter' ? 'Dokter Spesialis' : 'Administrator Sistem'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Institusi</span>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Mail className="w-4 h-4 text-slate-400" />
                {currentUser.email}
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unit Penugasan</span>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Building className="w-4 h-4 text-slate-400" />
                RS Kardiologi Terpadu
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lokasi Dinas</span>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <MapPin className="w-4 h-4 text-slate-400" />
                Jakarta Selatan, ID
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Izin Akses (MADM)</span>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Level Penuh (Edit Bobot AHP)
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => logout()}
              className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all border border-red-200 shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Keluar Sesi Aman
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
