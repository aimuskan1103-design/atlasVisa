import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface TextInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  isValid?: boolean;
  icon?: React.ComponentType<any>;
  required?: boolean;
  className?: string;
}

export default function TextInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  isValid = false,
  icon: Icon,
  required = false,
  className = ''
}: TextInputProps) {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="block text-2xs font-bold text-slate-400 uppercase tracking-wider select-none">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
        )}
        
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border px-4 py-2.5 text-xs text-slate-905 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${
            Icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-rose-500 bg-rose-50/20 focus:ring-2 focus:ring-rose-100' 
              : 'border-slate-200 bg-slate-50 focus:border-blue-500'
          }`}
        />

        {/* Validation Checkmark indicator */}
        {isValid && !error && (
          <Check className="absolute right-3 h-4 w-4 text-emerald-500 animate-pulse" />
        )}
      </div>

      {error && (
        <p className="text-[10px] text-rose-500 mt-1 flex items-center space-x-1 font-medium animate-slide-in">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
