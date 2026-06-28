import React from 'react';
import { Plane, User as UserIcon, Shield, LogOut, LogIn } from 'lucide-react';
import { User } from '../types';
import { VIEWS } from '../constants';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  currentView: string;
  setView: (view: any) => void;
}

export default function Navbar({ currentUser, onLogout, currentView, setView }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer select-none" 
          onClick={() => {
            if (!currentUser) setView(VIEWS.HOME);
            else if (currentUser.role === 'admin') setView(VIEWS.ADMIN_DASHBOARD);
            else setView(VIEWS.CUSTOMER_DASHBOARD);
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
            <Plane className="h-5 w-5 rotate-45" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Atlas<span className="text-blue-600">Visa</span>
            </span>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase leading-none">
              Travel Services
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-1">
          {/* Guest Links */}
          {!currentUser && (
            <>
              <button
                onClick={() => setView(VIEWS.HOME)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  currentView === VIEWS.HOME 
                    ? 'bg-slate-100 text-blue-600 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setView(VIEWS.SERVICES)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  currentView === VIEWS.SERVICES 
                    ? 'bg-slate-100 text-blue-600 font-bold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Visa Services
              </button>
            </>
          )}

          {/* Customer Workspace Links */}
          {currentUser && currentUser.role === 'customer' && (
            <button
              onClick={() => setView(VIEWS.CUSTOMER_DASHBOARD)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === VIEWS.CUSTOMER_DASHBOARD 
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              My Visa Application
            </button>
          )}

          {/* Admin Workspace Links */}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => setView(VIEWS.ADMIN_DASHBOARD)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                currentView === VIEWS.ADMIN_DASHBOARD 
                  ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              CRM Console
            </button>
          )}
        </nav>

        {/* Dynamic user status session options */}
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <div className="flex items-center space-x-3.5 animate-slide-in">
              {/* User profile tags */}
              <div className="hidden xs:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md mt-0.5 border select-none ${
                  currentUser.role === 'admin' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {currentUser.role}
                </span>
              </div>

              {/* Avatar Icon */}
              <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-white select-none ${
                currentUser.role === 'admin' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}>
                {currentUser.role === 'admin' ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <UserIcon className="h-4 w-4" />
                )}
              </div>

              {/* Sign Out Button */}
              <button
                onClick={onLogout}
                title="Sign Out Workspace"
                className="flex items-center justify-center p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            /* Sign In Button */
            <button
              onClick={() => setView(VIEWS.LOGIN)}
              className="inline-flex items-center space-x-1 px-4.5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] shadow-sm text-xs font-bold transition-all cursor-pointer"
            >
              <LogIn className="h-4.5 w-4.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
