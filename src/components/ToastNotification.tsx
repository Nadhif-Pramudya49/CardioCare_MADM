import React, { useEffect } from 'react';
import { useHealth } from '../context/HealthContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastNotification: React.FC = () => {
  const { toast, setToast } = useHealth();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, setToast]);

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200 text-green-800',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200 text-red-800',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: <Info className="h-5 w-5 text-blue-600" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-sm w-full px-4 pointer-events-none">
      <AnimatePresence>
        <motion.div
          id="toast-notification"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${style.bg}`}
        >
          <div className="shrink-0 mt-0.5">{style.icon}</div>
          <div className="flex-1 text-xs font-semibold leading-relaxed">
            {toast.message}
          </div>
          <button
            onClick={() => setToast(null)}
            className="shrink-0 p-0.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
