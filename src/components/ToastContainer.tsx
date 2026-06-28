import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Toast as ToastType } from '../types';

interface ToastProps {
  id: number;
  message: string;
  type?: 'success' | 'warning' | 'info' | 'error';
  onClose: (id: number) => void;
}

export function Toast({ id, message, type = 'success', onClose }: ToastProps) {
  // Auto-dismiss after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getStyle = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-rose-50 border-rose-200',
          text: 'text-rose-800',
          icon: XCircle,
          iconColor: 'text-rose-500',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200',
          text: 'text-amber-800',
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          text: 'text-blue-800',
          icon: Info,
          iconColor: 'text-blue-500',
        };
      default: // success
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-800',
          icon: CheckCircle2,
          iconColor: 'text-emerald-500',
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl border shadow-lg max-w-sm w-80 transition-all duration-300 animate-slide-in ${style.bg} ${style.text}`}>
      <div className="flex items-center space-x-3 min-w-0">
        <Icon className={`h-5 w-5 shrink-0 ${style.iconColor}`} />
        <span className="text-xs font-semibold leading-relaxed truncate select-none">
          {message}
        </span>
      </div>
      <button 
        onClick={() => onClose(id)}
        className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded cursor-pointer shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  removeToast: (id: number) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
}
