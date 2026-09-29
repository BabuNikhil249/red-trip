import React from 'react';
import { useBookingContext } from '../../context/BookingContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useBookingContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            t.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-700 text-white'
              : t.type === 'error'
              ? 'bg-red-900/90 border-red-700 text-white'
              : 'bg-slate-900/90 border-slate-700 text-white'
          }`}
        >
          {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}

          <p className="text-sm font-medium leading-snug flex-1">{t.message}</p>

          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
