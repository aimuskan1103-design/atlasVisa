import React, { useState, useEffect } from 'react';
import { Globe, Briefcase, GraduationCap, FileText, Plane, ShieldCheck, Hotel } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

interface ServicesProps {
  setView: (view: any) => void;
  setRole?: (role: any) => void;
  setSelectedVisaType: (visaType: string) => void;
  selectedVisaType: string;
}

export default function Services({ setView, setRole, setSelectedVisaType, selectedVisaType }: ServicesProps) {
  const [selectedServiceId, setSelectedServiceId] = useState('tourist-visa');

  const serviceList = [
    {
      id: 'tourist-visa',
      title: 'Tourist Visa Pathway',
      icon: Globe,
      color: 'bg-blue-50 text-blue-600 border border-blue-100',
      price: 'Starting from $49',
      time: '5 - 12 Working Days',
      desc: 'Short-term leisure visas for exploring global destinations. Includes documentation checks, mock interviews, and submission.',
      checklist: ['Valid Passport', 'Travel Itinerary', 'Proof of Funds', 'Photographs'] as const,
      featured: true
    },
    {
      id: 'business-visa',
      title: 'Business Visa Pathway',
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      price: 'Starting from $99',
      time: '3 - 7 Working Days',
      desc: 'Priority visa assistance for corporate events, investor meetups, or client conferences. Expedited slots coordination.',
      checklist: ['Corporate Invitation', 'Employer NOC Letter', 'Tax Returns', 'Sponsorship Form'] as const,
      featured: false
    },
    {
      id: 'student-visa',
      title: 'Student Visa Pathway',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      price: 'Starting from $149',
      time: '15 - 30 Working Days',
      desc: 'Academic pathway support for undergraduate, graduate, or research programs. Help with COE and financial letters validation.',
      checklist: ['University Offer/COE', 'Sponsor Guarantee', 'Academic Transcripts', 'Language Certificates'] as const,
      featured: false
    },
    {
      id: 'passport-services',
      title: 'Passport Services Desk',
      icon: FileText,
      color: 'bg-amber-50 text-amber-600 border border-amber-100',
      price: 'Starting from $39',
      time: '2 - 5 Working Days',
      desc: 'Expedited passport renewals, first-time issuances, name modifications, or urgent booklet replacements.',
      checklist: ['Old Passport Booklet', 'Identity Verification', 'Address Verification', 'Biometric Receipt'] as const,
      featured: false
    },
    {
      id: 'flight-booking',
      title: 'Flight Itinerary Proof',
      icon: Plane,
      color: 'bg-sky-50 text-sky-600 border border-sky-100',
      price: 'Starting from $19',
      time: 'Instant Delivery',
      desc: 'Verifiable round-trip flight reservations reserved exclusively for visa compliance without buying full flight tickets.',
      checklist: ['Travel Dates', 'Passenger Details', 'Destination Routes', 'Stopover Preferences'] as const,
      featured: false
    },
    {
      id: 'hotel-booking',
      title: 'Hotel Booking Proof',
      icon: Hotel,
      color: 'bg-rose-50 text-rose-600 border border-rose-100',
      price: 'Starting from $15',
      time: 'Instant Delivery',
      desc: 'Official booking voucher confirmation for visa interview proof. Flexible modification allowed.',
      checklist: ['Travel Duration', 'Hotel Preferences', 'Guest Details', 'Budget Constraints'] as const,
      featured: false
    },
    {
      id: 'travel-insurance',
      title: 'Travel Medical Insurance',
      icon: ShieldCheck,
      color: 'bg-teal-50 text-teal-600 border border-teal-100',
      price: 'Starting from $29',
      time: 'Instant Policy PDF',
      desc: 'Schengen-compliant global travel medical insurance coverage up to €30,000 to protect against flight cancellations or emergencies.',
      checklist: ['Passport Scan', 'Travel Dates', 'Emergency Contacts', 'Coverage Multiplier'] as const,
      featured: false
    }
  ];

  // Synchronize internal selection highlights with parent selectedVisaType
  useEffect(() => {
    if (selectedVisaType) {
      const matched = serviceList.find(s => s.title === selectedVisaType);
      if (matched) {
        setSelectedServiceId(matched.id);
      }
    }
  }, [selectedVisaType]);

  const handleApply = (serviceName: string) => {
    if (setSelectedVisaType) {
      setSelectedVisaType(serviceName);
    }
    setView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-grow bg-slate-50 py-12 animate-slide-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Our Professional Services</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-semibold">
            Select a service to initiate your travel compliance checklist. Apply online to get assigned a dedicated document manager.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((svc) => (
            <ServiceCard
              key={svc.id}
              svc={svc}
              isSelected={selectedServiceId === svc.id}
              onSelect={() => setSelectedServiceId(svc.id)}
              onApply={handleApply}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
