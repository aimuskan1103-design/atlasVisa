import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  price: string;
  time: string;
  desc: string;
  checklist: readonly string[] | string[];
  featured: boolean;
}

interface ServiceCardProps {
  svc: ServiceItem;
  isSelected?: boolean;
  onSelect: () => void;
  onApply: (serviceName: string) => void;
}

export default function ServiceCard({
  svc,
  isSelected = false,
  onSelect,
  onApply
}: ServiceCardProps) {
  const Icon = svc.icon;

  return (
    <div 
      onClick={onSelect}
      className={`relative rounded-3xl bg-white p-8 border shadow-premium transition-all duration-300 hover:shadow-hover hover:-translate-y-1 flex flex-col justify-between space-y-6 cursor-pointer ${
        isSelected 
          ? 'border-blue-500 ring-4 ring-blue-100 scale-[1.01]' 
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      {svc.featured && (
        <span className="absolute top-0 right-8 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white flex items-center space-x-1 shadow-sm">
          <Star className="h-3 w-3 fill-current text-amber-300" />
          <span>Featured Selection</span>
        </span>
      )}

      <div className="space-y-4">
        {/* Icon */}
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${svc.color} shadow-sm`}>
          <Icon className="h-6 w-6" />
        </div>

        {/* Title & Info */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-none">{svc.title}</h3>
          <div className="flex items-center space-x-2 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            <span>{svc.price}</span>
            <span className="text-slate-300">•</span>
            <span>{svc.time}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed font-medium">{svc.desc}</p>
      </div>

      {/* Document Checklist */}
      <div className="border-t border-slate-100 pt-4 space-y-2.5">
        <h4 className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Key Documents Required</h4>
        <ul className="grid grid-cols-2 gap-2 text-2xs text-slate-500 font-semibold">
          {svc.checklist.map((item, idx) => (
            <li key={idx} className="flex items-center space-x-1.5 min-w-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Apply Action */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // prevent card selection trigger
          if (onApply) onApply(svc.title);
        }}
        className={`w-full rounded-2xl py-3 text-xs font-bold transition-all cursor-pointer text-center ${
          isSelected 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-[1.01] hover:shadow-indigo-100' 
            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
        }`}
      >
        Apply Now
      </button>
    </div>
  );
}
