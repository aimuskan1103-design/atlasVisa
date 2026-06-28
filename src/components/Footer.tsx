import React, { useState } from 'react';
import { Plane, Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface FooterProps {
  currentUser: User | null;
  setView: (view: any) => void;
  setSelectedVisaType?: (visaType: string) => void;
}

export default function Footer({ currentUser, setView, setSelectedVisaType }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  const handleVisaLinkClick = (serviceName: string) => {
    if (setSelectedVisaType) {
      setSelectedVisaType(serviceName);
    }
    if (setView) {
      setView('services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 1. Simplified Dashboard-Focused Footer for active user sessions
  if (currentUser) {
    return (
      <footer className="border-t border-slate-200 bg-slate-50 py-6 text-slate-500 text-xs mt-auto font-medium">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Left section: Copyright & Brand */}
          <div className="flex items-center space-x-2 select-none">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-100 shrink-0">
              <Plane className="h-3.5 w-3.5 rotate-45" />
            </div>
            <span className="text-slate-800 font-bold text-xs tracking-tight">
              Atlas<span className="text-blue-600">Visa</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-2xs text-slate-400">© {new Date().getFullYear()} AtlasVisa Workspace.</span>
          </div>

          {/* Right section: System health details & Help */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-semibold text-[10px] uppercase tracking-wider select-none">
            <div className="flex items-center space-x-1.5 text-emerald-600">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>DB connected</span>
            </div>
            <span>•</span>
            <div>
              <span>Role: </span>
              <span className="text-slate-700 font-bold">{currentUser.role}</span>
            </div>
            <span>•</span>
            <div>
              <span>Support: </span>
              <a href="mailto:support@atlasvisa.com" className="text-blue-600 hover:underline hover:text-blue-700 lowercase font-bold tracking-normal text-xs">
                support@atlasvisa.com
              </a>
            </div>
          </div>

        </div>
      </footer>
    );
  }

  // 2. Comprehensive Public Landing Page Footer for anonymous guest visitors
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-100">
                <Plane className="h-4.5 w-4.5 rotate-45" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Atlas<span className="text-blue-600">Visa</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              Global travel assistance, expedited visa processing, and secure passport facilitation. Travel with total confidence.
            </p>
            <div className="flex space-x-4 text-slate-400 text-xs font-bold">
              <span className="hover:text-blue-600 cursor-pointer">Facebook</span>
              <span className="hover:text-blue-600 cursor-pointer">Twitter</span>
              <span className="hover:text-blue-600 cursor-pointer">LinkedIn</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Visa Services</h3>
            <ul className="space-y-2 text-xs text-slate-500 font-semibold">
              <li><span onClick={() => handleVisaLinkClick('Tourist Visa Pathway')} className="hover:text-blue-600 cursor-pointer">Tourist Visa Assistance</span></li>
              <li><span onClick={() => handleVisaLinkClick('Business Visa Pathway')} className="hover:text-blue-600 cursor-pointer">Business Schengen Visas</span></li>
              <li><span onClick={() => handleVisaLinkClick('Student Visa Pathway')} className="hover:text-blue-600 cursor-pointer">Student Visa Processing</span></li>
              <li><span onClick={() => handleVisaLinkClick('Passport Services Desk')} className="hover:text-blue-600 cursor-pointer">Expedited Passport Renewal</span></li>
              <li><span onClick={() => handleVisaLinkClick('Travel Medical Insurance')} className="hover:text-blue-600 cursor-pointer">Corporate Group Travel</span></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-xs text-slate-500 font-semibold">
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                <span>101 Travel Plaza, New Delhi, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <span>+91 11 4050 6070</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                <span>support@atlasvisa.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-xs text-slate-500 mb-3 font-medium leading-relaxed">
              Subscribe for visa rule updates and early-bird destination deals.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white border border-slate-200 px-3.5 py-2.5 pr-12 text-xs text-slate-905 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 flex items-center justify-center rounded-lg bg-blue-600 px-3 text-white hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-emerald-600 font-bold animate-pulse">
                  Subscribed successfully! Thank you.
                </p>
              )}
            </form>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-200/80 pt-8 text-center text-2xs text-slate-400 font-semibold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} AtlasVisa Services Inc. Designed for MERN Developer Showcase. UI-only Prototype.</p>
        </div>
      </div>
    </footer>
  );
}
