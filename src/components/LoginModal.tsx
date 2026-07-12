import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { X, Mail, Lock, User, Sparkles, LogIn, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, login, triggerToast } = useHealth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [email, setEmail] = useState('pasien@cardiocare.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regGender, setRegGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [regAge, setRegAge] = useState(35);

  // Google Login Sub-flow States
  const [showGoogleAccounts, setShowGoogleAccounts] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Suggested user email from metadata
  const suggestedEmail = "benerbenerakunsandi34@gmail.com";

  if (!showLoginModal) return null;

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerToast('Silakan isi alamat email dan kata sandi Anda.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Login standard as Budi Santoso or Siti Rahma
      login('Budi Santoso', 'Laki-laki', 58);
      setIsLoading(false);
      setShowLoginModal(false);
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      triggerToast('Silakan masukkan nama lengkap Anda.', 'error');
      return;
    }
    if (regAge < 1 || regAge > 120) {
      triggerToast('Silakan masukkan usia yang valid (1-120 tahun).', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(regName, regGender, regAge);
      setIsLoading(false);
      setShowLoginModal(false);
    }, 1200);
  };

  const startGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      setShowGoogleAccounts(true);
    }, 1000);
  };

  const selectGoogleAccount = (accEmail: string) => {
    setShowGoogleAccounts(false);
    setIsLoading(true);
    
    // derive a readable name from email
    const cleanName = accEmail.split('@')[0];
    const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    setTimeout(() => {
      login(formattedName, 'Laki-laki', 34);
      setIsLoading(false);
      setShowLoginModal(false);
      triggerToast(`Berhasil masuk menggunakan Google: ${accEmail}`, 'success');
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9900] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isLoading && setShowLoginModal(false)}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Modal Window Container */}
        <motion.div
          id="login-modal"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-base font-sans font-bold text-slate-800">Portal Pasien CardioCare</h3>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Akses Data Kardiovaskular</p>
            </div>
            <button
              onClick={() => !isLoading && setShowLoginModal(false)}
              disabled={isLoading}
              className="p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Google Authentication Dialog Overlay Sub-flow */}
            {showGoogleAccounts ? (
              <div className="space-y-4 py-4 animate-fade-in text-center">
                {/* Simulated Google SSO interface */}
                <div className="flex justify-center mb-3">
                  <svg className="h-8 w-8" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.783 5.783 0 0 1 8.21 12.73a5.783 5.783 0 0 1 5.78-5.785c1.47 0 2.82.52 3.885 1.385l3.116-3.11A9.927 9.927 0 0 0 13.99 2.83a9.99 9.99 0 0 0-9.99 9.9a9.99 9.99 0 0 0 9.99 9.9c5.184 0 9.81-3.69 9.81-9.9a10.9 10.9 0 0 0-.17-2.37H12.24z"
                    />
                  </svg>
                </div>
                <h4 className="text-sm font-bold text-slate-800">Pilih akun Google Anda</h4>
                <p className="text-xs text-slate-500 mb-4">untuk melanjutkan ke sistem CardioCare</p>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {/* Suggested Google email based on real metadata */}
                  <button
                    onClick={() => selectGoogleAccount(suggestedEmail)}
                    className="flex items-center gap-3 w-full p-3 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {suggestedEmail[0].toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate">Sandi User</p>
                      <p className="text-[10px] text-slate-500 truncate">{suggestedEmail}</p>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Pilih
                    </span>
                  </button>

                  {/* Standard demo option */}
                  <button
                    onClick={() => selectGoogleAccount('pasien.demo@gmail.com')}
                    className="flex items-center gap-3 w-full p-3 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 rounded-xl text-left transition-all group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                      P
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-slate-800 truncate">Pasien Demo</p>
                      <p className="text-[10px] text-slate-500 truncate">pasien.demo@gmail.com</p>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Pilih
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => setShowGoogleAccounts(false)}
                  className="mt-4 text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Kembali ke form login
                </button>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('login')}
                    disabled={isLoading}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Masuk Akun
                  </button>
                  <button
                    onClick={() => setActiveTab('register')}
                    disabled={isLoading}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Daftar Baru
                  </button>
                </div>

                {/* Tab content: Login */}
                {activeTab === 'login' && (
                  <form onSubmit={handleStandardSubmit} className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Alamat Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            placeholder="nama@email.com"
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl text-xs font-medium transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Kata Sandi
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl text-xs font-medium transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102 active:scale-98 disabled:opacity-75 disabled:scale-100"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Memvalidasi...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4" />
                          <span>Masuk Portal</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Tab content: Register */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Nama Lengkap Anda
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            disabled={isLoading}
                            placeholder="Contoh: Budi Santoso"
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl text-xs font-medium transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Jenis Kelamin
                          </label>
                          <select
                            value={regGender}
                            onChange={(e) => setRegGender(e.target.value as any)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl text-xs font-semibold transition-colors"
                          >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Usia (Tahun)
                          </label>
                          <input
                            type="number"
                            required
                            min={1}
                            max={120}
                            value={regAge}
                            onChange={(e) => setRegAge(parseInt(e.target.value) || 0)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl text-xs font-semibold transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102 active:scale-98 disabled:opacity-75"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Membuat Akun...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Daftar & Masuk</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Divider for SSO */}
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Atau</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={startGoogleLogin}
                  disabled={isLoading || googleLoading}
                  className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer hover:border-slate-300 disabled:opacity-70"
                >
                  {googleLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                  ) : (
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.77-.07-1.54-.2-2.27H12v4.51h6.6c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.58-5.16 3.58-8.82z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-4.99H1.24v3.09C3.21 21.2 7.32 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.24 14.26a7.22 7.22 0 0 1 0-4.52V6.65H1.24a11.94 11.94 0 0 0 0 10.7l4-3.09z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.21 2.8 1.24 6.65l4 3.09c.95-2.86 3.61-4.99 6.76-4.99z"
                      />
                    </svg>
                  )}
                  <span>{googleLoading ? 'Memulai Google SSO...' : 'Masuk dengan Google'}</span>
                </button>

                {/* Quick login bypass button */}
                <div className="bg-blue-50/40 rounded-xl p-3 border border-blue-500/10 text-center">
                  <p className="text-[10px] text-slate-500 font-semibold mb-1">Butuh akses cepat untuk uji coba?</p>
                  <button
                    type="button"
                    onClick={() => {
                      login('Budi Santoso', 'Laki-laki', 58);
                      setShowLoginModal(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-500 font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Masuk Instan sebagai Pasien Demo</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
