import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
  lead: Lead;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onNextStage?: () => void;
  showNextStageButton?: boolean;
}

export default function LeadCard({
  lead,
  onDragStart,
  onNextStage,
  showNextStageButton = true
}: LeadCardProps) {
  return (
    <div 
      draggable
      onDragStart={onDragStart}
      className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm space-y-2.5 text-xs hover:border-slate-300 transition-colors animate-slide-in cursor-grab active:cursor-grabbing"
    >
      <div>
        <span className="font-bold text-slate-800 block truncate">{lead.name}</span>
        <span className="text-[10px] text-slate-400 block font-semibold truncate">{lead.email}</span>
      </div>
      
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md inline-block">
          {lead.service}
        </span>
        <p className="text-[10px] text-slate-500 leading-relaxed font-medium italic">{lead.note}</p>
      </div>

      {/* Quick pipeline stage move button */}
      {showNextStageButton && onNextStage && (
        <button
          onClick={onNextStage}
          className="w-full flex items-center justify-center space-x-1 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <span>Next Stage</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
