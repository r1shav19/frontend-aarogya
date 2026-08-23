import React from 'react';
import { useAarogya } from '../context/AarogyaContext';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useAarogya();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const isEmergency = toast.type === 'emergency';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        let borderStyle = 'border-cyan-500/30 bg-slate-900/90 text-cyan-200';
        let icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;

        if (isEmergency) {
          borderStyle = 'border-rose-500/60 bg-slate-950/95 text-rose-100 glow-rose animate-pulse';
          icon = <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />;
        } else if (isWarning) {
          borderStyle = 'border-amber-500/50 bg-slate-900/90 text-amber-200';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (isSuccess) {
          borderStyle = 'border-emerald-500/50 bg-slate-900/90 text-emerald-200';
          icon = <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 flex items-start gap-3 ${borderStyle}`}
          >
            {icon}
            <div className="flex-1">
              <div className="font-bold text-sm leading-snug">{toast.title}</div>
              <div className="text-xs opacity-90 mt-1 leading-relaxed">{toast.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
