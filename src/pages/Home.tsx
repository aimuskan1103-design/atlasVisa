import React, { useState, useEffect } from 'react';
import { Search, Globe, CheckCircle, Award, ShieldCheck, Heart, Mail, Phone, Send, ChevronRight, User, Check, AlertCircle, Plus, Minus, Compass, Plane } from 'lucide-react';
import TextInput from '../components/ui/TextInput';
import { isEmailValid } from '../utils';
import { DESTINATIONS, FAQS } from '../constants';

interface HomeProps {
  setView: (view: any) => void;
  setRole: (role: any) => void;
}

export default function Home({ setView, setRole }: HomeProps) {
  const [searchDest, setSearchDest] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  // FAQ Accordion active state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Consultation form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', msg: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Dynamic counting stats
  const [visasCount, setVisasCount] = useState(0);
  const [rateCount, setRateCount] = useState<any>(0);
  const [destsCount, setDestsCount] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);

  useEffect(() => {
    let step = 0;
    const duration = 1200; // 1.2s duration
    const steps = 50;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setVisasCount(Math.floor(progress * 45000));
      setRateCount((progress * 99.2).toFixed(1));
      setDestsCount(Math.floor(progress * 180));
      setPartnersCount(Math.floor(progress * 350));

      if (step >= steps) {
        clearInterval(timer);
        setVisasCount(45000);
        setRateCount(99.2);
        setDestsCount(180);
        setPartnersCount(350);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchDest.toLowerCase().trim();
    if (!query) return;

    if (query.includes('us') || query.includes('america') || query.includes('united states')) {
      setSearchResult({ country: 'United States', status: 'Visa Required', details: 'B1/B2 Visitor Visa requires DS-160 filing, fee validation, and in-person embassy interview. Academic routes require SEVIS tracking.', action: 'Apply for US Visa' });
    } else if (query.includes('japan') || query.includes('tokyo')) {
      setSearchResult({ country: 'Japan', status: 'eVisa Active', details: 'Allows stay up to 90 days. Online eVisa submissions processed within 5 business days for tourist streams.', action: 'Apply for Japan Visa' });
    } else if (query.includes('europe') || query.includes('germany') || query.includes('france') || query.includes('schengen')) {
      setSearchResult({ country: 'Schengen Area', status: 'Consulate Stamp Required', details: 'Access to 29 European countries. Requires travel insurance (min €30,000 coverage), bank statements, and flight itinerary.', action: 'Apply for Schengen Visa' });
    } else {
      setSearchResult({ country: searchDest, status: 'Standard Visa Processing', details: 'Full document assembly, pre-vetting checklist checks, and appointment scheduling supported. Average duration is 8-12 days.', action: 'Request Details' });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!contactForm.name || contactForm.name.length < 3) {
      errors.name = 'Name must be at least 3 characters.';
    }
    if (!contactForm.email || !isEmailValid(contactForm.email)) {
      errors.email = 'Please provide a valid email format.';
    }
    if (!contactForm.msg || contactForm.msg.length < 10) {
      errors.msg = 'Message details must be at least 10 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({ name: '', email: '', msg: '' });
    }, 3000);
  };

  return (
    <div className="flex-grow bg-white text-slate-800 overflow-hidden">

      {/* VIBRANT LIGHT HERO SECTION with floating background meshes */}
      <section className="relative overflow-hidden bg-slate-50 border-b border-slate-200/60 py-24 sm:py-32">

        {/* Glow ambient blobs */}
        <div className="absolute top-10 left-10 h-96 w-96 rounded-full bg-blue-400/10 blur-[100px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-10 right-20 h-[450px] w-[450px] rounded-full bg-indigo-400/10 blur-[120px] animate-float-reverse pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-cyan-400/10 blur-[90px] animate-float-slow pointer-events-none" />

        {/* Animated Flight Skies Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Radar ripple waves */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] border border-blue-500/5 rounded-full animate-radar-sweep" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] border border-indigo-500/5 rounded-full animate-radar-sweep [animation-delay:4s]" />

          {/* Plane 1: Ascent path */}
          <div className="absolute left-0 bottom-0 animate-fly-plane">
            <div className="relative flex items-center space-x-2">
              <div className="w-48 border-t-2 border-dashed border-blue-500/20" />
              <Plane className="h-6 w-6 text-blue-600/35 rotate-45" />
            </div>
          </div>

          {/* Plane 2: Descent path */}
          <div className="absolute right-0 top-0 animate-fly-plane-slow">
            <div className="relative flex items-center space-x-2">
              <Plane className="h-4.5 w-4.5 text-indigo-600/25 -rotate-135" />
              <div className="w-36 border-t border-dashed border-indigo-500/15" />
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-10 z-10">

          {/* Animated Header Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-700 border border-indigo-100 backdrop-blur-md animate-pulse">
            <Compass className="h-3.5 w-3.5 rotate-45 text-indigo-500" />
            <span>Trusted Global Visa Logistics Specialist</span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl leading-none text-slate-900">
            Simplify Your Global Journey. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Visa & Passports Made Easy.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-500 leading-relaxed">
            Expedited travel document processing, corporate Schengen coordination, and document compliance verifying. Handled by top legal visa experts.
          </p>

          {/* Frosted Glass Search Widget */}
          <div className="mx-auto max-w-2xl animate-slide-in">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-white/70 p-2 backdrop-blur-md border border-slate-200 shadow-premium focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Where are you traveling to? (e.g., Japan, USA, Europe)"
                  value={searchDest}
                  onChange={(e) => setSearchDest(e.target.value)}
                  className="w-full rounded-xl bg-transparent py-3 pl-12 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:placeholder-slate-500"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:scale-[1.01] hover:shadow-indigo-100 transition-all cursor-pointer"
              >
                Check Visa Status
              </button>
            </form>

            {/* Glass Result Panel */}
            {searchResult && (
              <div className="mt-4 text-left p-5 rounded-2xl bg-white text-slate-800 border border-slate-200 shadow-hover animate-slide-in space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-base text-slate-900">{searchResult.country}</h3>
                  <span className="rounded-full bg-blue-50 border border-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                    {searchResult.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{searchResult.details}</p>
                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    onClick={() => {
                      setSearchResult(null);
                      setSearchDest('');
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    Clear Search
                  </button>
                  <button
                    onClick={() => {
                      setView('login');
                    }}
                    className="inline-flex items-center space-x-1 font-bold text-blue-600 hover:text-blue-500 cursor-pointer animate-pulse"
                  >
                    <span>{searchResult.action}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DYNAMIC STATS SECTION (Counter trigger) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 -translate-y-8 relative z-10 animate-slide-in">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-premium">
          {[
            { label: 'Visas Approved', value: `${visasCount.toLocaleString()}+` },
            { label: 'Success Rating', value: `${rateCount}%` },
            { label: 'Destinations', value: `${destsCount}+` },
            { label: 'Corporate Partners', value: `${partnersCount}+` }
          ].map((stat, i) => (
            <div key={i} className="text-center p-4 border-r border-slate-100 last:border-r-0">
              <p className="text-3xl font-extrabold text-blue-600 sm:text-4xl">{stat.value}</p>
              <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED DESTINATIONS with vibrant layouts */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Featured Travel Pathways</h2>
          <p className="text-xs text-slate-500">
            Select standard travel routes. We manage full visa support, biometric scheduling, and file assembly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest, i) => (
            <div
              key={i}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 text-slate-800 shadow-premium hover:shadow-hover hover:-translate-y-2.5 transition-all duration-300 cursor-pointer bg-white ${dest.glow}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <Globe className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide border ${dest.badgeColor}`}>
                    {dest.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{dest.name}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{dest.visa}</p>
              </div>

              <div className="mt-8 space-y-2 border-t border-slate-100 pt-4 text-2xs text-slate-400">
                <div className="flex justify-between">
                  <span>Processing:</span>
                  <span className="font-bold text-slate-700">{dest.processing}</span>
                </div>
                <div className="flex justify-between">
                  <span>Consular Fee:</span>
                  <span className="font-bold text-slate-700">{dest.fee}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5">
                  <span>Rating:</span>
                  <span className="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-600 flex items-center space-x-0.5">
                    <Heart className="h-2.5 w-2.5 fill-current text-rose-500 shrink-0" />
                    <span>{dest.rating}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setView('login');
                }}
                className="mt-4 w-full rounded-2xl bg-slate-50 border border-slate-200 py-2.5 text-center text-xs font-bold text-slate-600 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all cursor-pointer shadow-xs"
              >
                Initiate Visa
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US with detailed icons */}
      <section className="bg-slate-50 border-y border-slate-200/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Why Global Travelers Trust AtlasVisa</h2>
            <p className="text-xs text-slate-500 font-medium">
              We replace complex paperwork and confusing consulate details with simple automated workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Expedited Review', desc: 'Our documentation experts pre-vet your scans to catch minor errors (blurry texts, sizing) before submission to consulates.', icon: ShieldCheck, color: 'bg-blue-50 text-blue-600 border border-blue-100 shadow-blue-100/10' },
              { title: 'Real-Time Timeline', desc: 'Secure CRM dashboard alerts you when documents are approved or need replacement, keeping you updated at every stage.', icon: CheckCircle, color: 'bg-teal-50 text-teal-600 border border-teal-100 shadow-teal-100/10' },
              { title: 'Premium Assistance', desc: 'Assigned account executives coordinate biometrics appointments, pay consulate vouchers, and prep you for interview loops.', icon: Award, color: 'bg-purple-50 text-purple-600 border border-purple-100 shadow-purple-100/10' }
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-premium flex flex-col items-start space-y-4 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${feat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{feat.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DYNAMIC FAQ ACCORDION SECTION */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8 animate-slide-in">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500">Everything you need to know about documentation and audits.</p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white shadow-premium overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 text-sm hover:bg-slate-50/50 transition-colors select-none"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 text-blue-600 shrink-0" />
                  ) : (
                    <Plus className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5 bg-slate-50/30 text-xs text-slate-500 leading-relaxed animate-slide-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">What Our Applicants Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { quote: 'Applying for a US Tourist Visa as an Indian entrepreneur seemed daunting. AtlasVisa corrected my financial uploads and organized my DS-160 package. I got approved within 15 days!', author: 'Muskan Kanani', title: 'Freelancer & Founder, New Delhi' },
            { quote: 'Getting my COE document approved by Tokyo MEXT was time-critical. The assigned specialist Sophia helped me compile medical forms and academic records perfectly. Outstanding interface.', author: 'Liam O\'Connor', title: 'Graduate Student, Dublin' }
          ].map((test, i) => (
            <div key={i} className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-premium flex flex-col justify-between space-y-6 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
              <p className="text-slate-600 italic leading-relaxed text-xs">"{test.quote}"</p>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm select-none shadow-sm">
                  {test.author[0]}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{test.author}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{test.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT/CONSULTATION with validations */}
      <section className="bg-slate-50 border-t border-slate-200 py-16 relative overflow-hidden">

        {/* Glow ambient blobs */}
        <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10 animate-slide-in">

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl leading-tight">Have Specific Travel Scenarios?</h2>
            <p className="text-slate-500 text-xs leading-relaxed">
              Our travel consultants provide custom solutions for corporate visa coordination, complex student clearances, and multi-country flight routing itineraries. Let us help you organize your documentation.
            </p>
            <div className="space-y-3 text-xs text-slate-700 font-semibold">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <span>+91 11 4050 6070</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <span>consult@atlasvisa.com</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-premium backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-900 mb-4">Request a Consultation</h3>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <TextInput
                label="Your Name"
                placeholder="Muskan Kanani"
                value={contactForm.name}
                onChange={(e) => {
                  setContactForm({ ...contactForm, name: e.target.value });
                  if (validationErrors.name) {
                    const updated = { ...validationErrors };
                    delete updated.name;
                    setValidationErrors(updated);
                  }
                }}
                icon={User}
                error={validationErrors.name}
                isValid={contactForm.name.length >= 3}
              />

              <TextInput
                label="Email Address"
                placeholder="muskan@example.com"
                value={contactForm.email}
                onChange={(e) => {
                  setContactForm({ ...contactForm, email: e.target.value });
                  if (validationErrors.email) {
                    const updated = { ...validationErrors };
                    delete updated.email;
                    setValidationErrors(updated);
                  }
                }}
                icon={Mail}
                error={validationErrors.email}
                isValid={isEmailValid(contactForm.email)}
              />

              {/* Message */}
              <div>
                <label className="block text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1">How can we help?</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your visa goals..."
                  value={contactForm.msg}
                  onChange={(e) => {
                    setContactForm({ ...contactForm, msg: e.target.value });
                    if (validationErrors.msg) {
                      const updated = { ...validationErrors };
                      delete updated.msg;
                      setValidationErrors(updated);
                    }
                  }}
                  className={`w-full rounded-xl bg-slate-50 border px-4 py-2.5 text-xs text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none transition-all ${validationErrors.msg ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-100' : 'border-slate-200 focus:border-blue-500'
                    }`}
                />
                {contactForm.msg.length >= 10 && !validationErrors.msg && (
                  <div className="flex justify-end pr-2 pt-1">
                    <Check className="h-4 w-4 text-emerald-500 animate-pulse" />
                  </div>
                )}
                {validationErrors.msg && (
                  <p className="text-[10px] text-rose-500 mt-1 flex items-center space-x-1 font-medium">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{validationErrors.msg}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs font-bold text-white hover:scale-[1.01] hover:shadow-md hover:shadow-indigo-100 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Send Consultation Inquiry</span>
                <Send className="h-3.5 w-3.5" />
              </button>

              {contactSuccess && (
                <p className="text-xs text-emerald-500 font-bold text-center animate-slide-in pt-1">
                  Inquiry Sent! A documentation expert will contact you shortly.
                </p>
              )}
            </form>
          </div>

        </div>
      </section>

    </div>
  );
}
