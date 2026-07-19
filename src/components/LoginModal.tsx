import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { X, Mail, Lock, User, LogIn, ArrowRight, ShieldCheck, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, loginAdmin, loginDokter, triggerToast } = useHealth();
  const [activeTab, setActiveTab] = useState<'admin' | 'dokter'>('admin');
  
  // Login Form States
  const [email, setEmail] = useState('admin@puskesmas.go.id');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerToast('Silakan isi alamat email dan kata sandi Anda.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (activeTab === 'admin') {
        loginAdmin();
      } else {
        loginDokter();
      }
      setIsLoading(false);
      setShowLoginModal(false);
    }, 1200);
  };

  // Change default email when tab changes for convenience
  const handleTabChange = (tab: 'admin' | 'dokter') => {
    setActiveTab(tab);
    if (tab === 'admin') {
      setEmail('admin@puskesmas.go.id');
    } else {
      setEmail('ahmad.setiawan@rs.com');
    }
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
              <h3 className="text-base font-sans font-bold text-slate-800">Sistem Puskesmas CardioCare</h3>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Akses Portal Tenaga Medis</p>
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
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => handleTabChange('admin')}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'admin' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </button>
              <button
                onClick={() => handleTabChange('dokter')}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'dokter' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                Dokter
              </button>
            </div>

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
                className={`w-full py-2.5 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-102 active:scale-98 disabled:opacity-75 disabled:scale-100 ${
                  activeTab === 'admin' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memvalidasi...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Masuk sebagai {activeTab === 'admin' ? 'Admin' : 'Dokter'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
