import React from 'react';
import { useHealth } from '../context/HealthContext';
import { HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ConfirmDialog: React.FC = () => {
  const { confirmDialog, setConfirmDialog } = useHealth();

  if (!confirmDialog) return null;

  const handleConfirm = () => {
    confirmDialog.onConfirm();
    setConfirmDialog(null);
  };

  const handleCancel = () => {
    if (confirmDialog.onCancel) {
      confirmDialog.onCancel();
    }
    setConfirmDialog(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCancel}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        />

        {/* Dialog Content */}
        <motion.div
          id="confirm-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="relative bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-200 shadow-xl z-10 flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
            <HelpCircle className="h-6 w-6" />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-2">Konfirmasi Tindakan</h3>
          <p className="text-slate-500 text-xs leading-relaxed mb-6">
            {confirmDialog.message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleCancel}
              className="flex-1 py-2 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Ya, Lanjutkan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
