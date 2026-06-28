import React, { useState } from 'react';
import { Plane, Mail, Lock, AlertCircle, Shield, User as UserIcon } from 'lucide-react';
import TextInput from '../components/ui/TextInput';
import { isEmailValid } from '../utils';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !password) {
      setError('Please fill in both email and password.');
      triggerShake();
      return;
    }

    if (!isEmailValid(cleanEmail)) {
      setError('Please enter a valid email address.');
      triggerShake();
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      triggerShake();
      return;
    }

    setLoading(true);

    // Simulate login verification delay
    setTimeout(() => {
      if (cleanEmail === 'admin@atlasvisa.com' && password === 'password') {
        onLoginSuccess({
          id: 'admin-ex',
          name: 'Alex Rivera',
          email: 'admin@atlasvisa.com',
          role: 'admin'
        });
      } else if (cleanEmail === 'muskan@example.com' && password === 'password') {
        onLoginSuccess({
          id: 'cust-101',
          name: 'Muskan Kanani',
          email: 'muskan@example.com',
          role: 'customer'
        });
      } else if (cleanEmail === 'liam@example.com' && password === 'password') {
        onLoginSuccess({
          id: 'cust-102',
          name: 'Liam O\'Connor',
          email: 'liam@example.com',
          role: 'customer'
        });
      } else {
        setError('Incorrect email address or password combination.');
        triggerShake();
        setLoading(false);
      }
    }, 600);
  };

  const handleQuickLogin = (roleType: 'customer' | 'admin') => {
    setError('');
    if (roleType === 'admin') {
      setEmail('admin@atlasvisa.com');
      setPassword('password');
    } else {
      setEmail('muskan@example.com');
      setPassword('password');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-md w-full space-y-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-premium transition-all duration-300 ${isShaking ? 'animate-shake border-rose-400 ring-4 ring-rose-100' : ''
          }`}
      >

        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-200">
            <Plane className="h-6 w-6 rotate-45" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">AtlasVisa Login</h2>
          <p className="text-xs text-slate-500">Access your travel documents portal and advisor CRM dashboard.</p>
        </div>

        {/* Validation Errors warning alert */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 flex items-start space-x-2 text-rose-800 text-xs animate-slide-in">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-500" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <TextInput
              label="Email Address"
              type="email"
              placeholder="name@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              icon={Mail}
              isValid={isEmailValid(email)}
            />

            <TextInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              icon={Lock}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white hover:scale-[1.01] hover:shadow-md hover:shadow-indigo-100 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Quick Credentials Seeder Box */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <span className="block text-2xs font-bold text-slate-400 uppercase tracking-wider text-center">Quick Demonstration Login</span>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="flex items-center justify-center space-x-1.5 p-3 rounded-xl border border-blue-100 bg-blue-50/40 text-blue-700 hover:bg-blue-50 transition-colors text-xs font-bold cursor-pointer"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Customer Demo</span>
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="flex items-center justify-center space-x-1.5 p-3 rounded-xl border border-emerald-100 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 transition-colors text-xs font-bold cursor-pointer"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Advisor CRM Demo</span>
            </button>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-[10px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block uppercase">Database Seed Credentials:</span>
            <div className="flex justify-between">
              <span>Customer ID:</span>
              <span className="font-mono text-slate-700 font-bold">muskan@example.com / password</span>
            </div>
            <div className="flex justify-between">
              <span>Advisor ID:</span>
              <span className="font-mono text-slate-700 font-bold">admin@atlasvisa.com / password</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
