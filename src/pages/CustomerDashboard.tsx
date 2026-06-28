import React, { useState, useRef } from 'react';
import { CheckCircle2, Calendar, MessageSquare, Info } from 'lucide-react';
import ConfirmModal from '../components/ui/ConfirmModal';
import DocChecklistItem from '../components/DocChecklistItem';
import { validateFile } from '../utils';
import { Customer, Document } from '../types';

interface CustomerDashboardProps {
  customer: Customer;
  onUploadDocument: (customerId: string, docId: string, fileName: string, fileSize: string) => void;
  onDeleteDocument: (customerId: string, docId: string) => void;
  selectedVisaType: string;
  showToast?: (message: string, type: 'success' | 'warning' | 'info' | 'error') => void;
}

export default function CustomerDashboard({ 
  customer, 
  onUploadDocument, 
  onDeleteDocument, 
  selectedVisaType, 
  showToast 
}: CustomerDashboardProps) {
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragActive, setDragActive] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Confirmation Modal State
  const [deletingDoc, setDeletingDoc] = useState<Document | null>(null);

  // Trigger simulated upload
  const simulateUpload = (docId: string, fileName: string, fileSize: string) => {
    setUploadProgress(prev => ({ ...prev, [docId]: 10 }));
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[docId] || 10;
        if (current >= 100) {
          clearInterval(interval);
          onUploadDocument(customer.id, docId, fileName, fileSize);
          
          if (showToast) {
            showToast(`Document "${fileName}" uploaded successfully.`, 'success');
          }

          setTimeout(() => {
            setUploadProgress(p => {
              const updated = { ...p };
              delete updated[docId];
              return updated;
            });
          }, 500);
          return prev;
        }
        return { ...prev, [docId]: current + 25 };
      });
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file, showToast)) {
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      simulateUpload(docId, file.name, sizeStr);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>, docId: string, activeState: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [docId]: activeState }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [docId]: false }));

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file, showToast)) {
      const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      simulateUpload(docId, file.name, sizeStr);
    }
  };

  const triggerFileInput = (docId: string) => {
    const ref = fileInputRefs.current[docId];
    if (ref) ref.click();
  };

  const triggerDeleteConfirm = (doc: Document) => {
    setDeletingDoc(doc);
  };

  const executeDelete = () => {
    if (deletingDoc) {
      onDeleteDocument(customer.id, deletingDoc.id);
      if (showToast) {
        showToast(`Document Checklist item "${deletingDoc.name}" cleared.`, 'info');
      }
      setDeletingDoc(null);
    }
  };

  // Document calculation for circular progress
  const totalDocs = customer?.documents.length || 7;
  const completedDocs = customer?.documents.filter(d => d.fileName !== null).length || 0;
  const completionPercentage = Math.round((completedDocs / totalDocs) * 100);

  // SVG parameters for circular meter
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * completionPercentage) / 100;

  return (
    <div className="flex-grow bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 animate-slide-in">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Welcome Card & Circular Progress Meter */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-slide-in">
          <div className="space-y-2">
            <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
              Customer Portal Workspace
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl leading-none">
              Welcome back, {customer.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Manage your visa requirements, check documents validation, and coordinate with your executive.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
            {/* SVG Circular Progress */}
            <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
              <svg className="h-full w-full transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  fill="transparent"
                  stroke="#e2e8f0"
                  strokeWidth="4.5"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="4.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute text-[10px] font-extrabold text-slate-800">
                {completionPercentage}%
              </span>
            </div>
            <div>
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">Checklist Uploaded</span>
              <span className="text-xs font-bold text-slate-700 mt-0.5 block">{completedDocs} of {totalDocs} Documents</span>
            </div>
          </div>
        </div>

        {/* Selected Visa Prompt Banner */}
        {selectedVisaType && (
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4.5 shadow-md flex items-center justify-between animate-slide-in">
            <div className="flex items-center space-x-3">
              <Info className="h-5 w-5 shrink-0 text-blue-200" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block">Initiated Route</span>
                <span className="text-sm font-bold block mt-0.5">{selectedVisaType}</span>
              </div>
            </div>
          </div>
        )}

        {/* Dash Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: File Upload Checklist */}
          <div className="lg:col-span-2 space-y-6 animate-slide-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Visa & Passport Documents Checklist</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload all required documentation scans. File types accepted: PDF, JPG, PNG up to 5MB.
                </p>
              </div>

              {/* Doc checklist list */}
              <div className="space-y-4">
                {customer.documents.map((doc) => (
                  <DocChecklistItem
                    key={doc.id}
                    doc={doc}
                    isExpanded={activeDocId === doc.id}
                    onToggle={() => setActiveDocId(activeDocId === doc.id ? null : doc.id)}
                    uploadProgress={uploadProgress[doc.id]}
                    isDragging={dragActive[doc.id]}
                    onDragEnter={(e) => handleDrag(e, doc.id, true)}
                    onDragOver={(e) => handleDrag(e, doc.id, true)}
                    onDragLeave={(e) => handleDrag(e, doc.id, false)}
                    onDrop={(e) => handleDrop(e, doc.id)}
                    onFileInputTrigger={() => triggerFileInput(doc.id)}
                    onDeleteTrigger={() => triggerDeleteConfirm(doc)}
                    fileInputRef={el => fileInputRefs.current[doc.id] = el}
                    onFileChange={(e) => handleFileChange(e, doc.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stepper Timeline & Comments */}
          <div className="space-y-6 animate-slide-in">
            
            {/* Timeline Stepper */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-6 space-y-6">
              <h2 className="text-base font-bold text-slate-900">Application Tracking Timeline</h2>
              
              <div className="relative border-l border-slate-200 pl-6 ml-2 space-y-6">
                {customer.timeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-9 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border ${
                      step.completed 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-slate-400 border-slate-200'
                    }`}>
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.status}
                        </span>
                        {step.date && (
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                            <Calendar className="h-2.5 w-2.5" />
                            <span>{step.date}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Feed */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-premium p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <MessageSquare className="h-4.5 w-4.5 text-blue-500" />
                <h2 className="text-sm font-bold text-slate-900 leading-none">Advisor Comments & Feedback</h2>
              </div>

              <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                {customer.comments && customer.comments.length > 0 ? (
                  customer.comments.map((comment, idx) => {
                    const isAdmin = comment.sender.includes('Admin');
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-2xl border text-xs leading-relaxed ${
                          isAdmin 
                            ? 'bg-slate-50 border-slate-200/80 text-slate-600' 
                            : 'bg-blue-50/40 border-blue-100 text-blue-700'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1 font-semibold">
                          <span className="font-bold">{comment.sender}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{comment.date}</span>
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No advisor comments recorded yet.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Confirmation Dialog Modal overlay */}
      <ConfirmModal
        isOpen={deletingDoc !== null}
        title="Clear Checklist Item"
        message={`Are you sure you want to clear "${deletingDoc?.name}" checklist file? This will reset the verification status back to pending.`}
        confirmText="Remove File"
        cancelText="Cancel"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeletingDoc(null)}
      />
    </div>
  );
}
