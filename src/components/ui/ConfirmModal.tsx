import React from 'react';
import { LogOut, Trash2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  type = 'danger', 
  onConfirm, 
  onCancel 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getStyle = () => {
    switch (type) {
      case 'info':
        return {
          buttonBg: 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-500 shadow-slate-200',
          iconBg: 'bg-slate-100 text-slate-700',
          icon: LogOut
        };
      default: // danger
        return {
          buttonBg: 'bg-rose-600 hover:bg-rose-500 focus:ring-rose-500 shadow-rose-200',
          iconBg: 'bg-rose-100 text-rose-600',
          icon: Trash2
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        onClick={onCancel}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl scale-100 transition-all duration-300 animate-slide-in space-y-6">
        <div className="flex items-start space-x-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.iconBg} shadow-sm`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <h3 className="text-sm font-bold text-slate-900 leading-none truncate">
              {title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all cursor-pointer ${style.buttonBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
