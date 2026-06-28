import React from 'react';
import { UploadCloud, FileText, FileImage, RefreshCw, Trash2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Document } from '../types';
import { getStatusStyle } from '../utils';

interface DocChecklistItemProps {
  doc: Document;
  isExpanded?: boolean;
  onToggle: () => void;
  uploadProgress?: number;
  isDragging?: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileInputTrigger: () => void;
  onDeleteTrigger: () => void;
  fileInputRef: (el: HTMLInputElement | null) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DocChecklistItem({
  doc,
  isExpanded = false,
  onToggle,
  uploadProgress,
  isDragging = false,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileInputTrigger,
  onDeleteTrigger,
  fileInputRef,
  onFileChange
}: DocChecklistItemProps) {
  const hasFile = doc.fileName !== null;
  const fileType = doc.fileName?.split('.').pop()?.toLowerCase();

  return (
    <div 
      className={`rounded-2xl border transition-all ${
        isExpanded ? 'border-blue-500 shadow-sm bg-slate-50/20' : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      {/* Document Row Header */}
      <div 
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3 min-w-0">
          {hasFile ? (
            <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 relative group overflow-hidden">
              {fileType === 'pdf' ? (
                <FileText className="h-5 w-5 text-rose-500" />
              ) : (
                <FileImage className="h-5 w-5 text-indigo-500" />
              )}
            </div>
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <FileText className="h-5 w-5" />
            </div>
          )}
          
          <div className="min-w-0">
            <span className="text-sm font-semibold text-slate-800 block truncate">
              {doc.name === 'Visa Documents' ? 'Visa Application Form' : doc.name}
            </span>
            {hasFile ? (
              <span className="text-[11px] text-slate-500 block truncate max-w-[200px] sm:max-w-md font-medium">
                {doc.fileName} ({doc.size})
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 block font-semibold">
                Pending upload
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`rounded-full border px-2.5 py-0.5 text-2xs font-extrabold uppercase tracking-wider ${getStatusStyle(doc.status)}`}>
            {doc.status}
          </span>
          
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expanded Section (Uploader / Details) */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-4 bg-slate-50/30 space-y-4 animate-slide-in">
          
          {/* Rejection Warning Box */}
          {doc.status === 'Rejected' && doc.rejectionReason && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 flex items-start space-x-2 text-rose-800 text-xs animate-slide-in">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5 text-rose-500" />
              <div>
                <span className="font-bold">Reason for Rejection:</span>
                <p className="mt-0.5 leading-relaxed">{doc.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Progress Bar Layer */}
          {uploadProgress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Uploading file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Drop Zone */}
          {uploadProgress === undefined && (
            <div className="space-y-4">
              {!hasFile ? (
                <div
                  onDragEnter={onDragEnter}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={onFileInputTrigger}
                  className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50/40' 
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <UploadCloud className={`h-8 w-8 ${isDragging ? 'text-blue-500 animate-bounce' : 'text-slate-400'}`} />
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-blue-600 hover:underline">Click to upload</span> or drag and drop scans here
                  </div>
                  <p className="text-[10px] text-slate-400">PDF, JPG, PNG (Max 5MB)</p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={onFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              ) : (
                /* File Previews & Controls */
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="h-8 w-8 shrink-0 bg-blue-50 border border-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-700 block truncate max-w-[150px] sm:max-w-xs">
                        {doc.fileName}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-semibold">{doc.size} • Uploaded on {doc.uploadDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={onFileInputTrigger}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3 text-slate-500" />
                      <span>Replace</span>
                    </button>
                    <button
                      onClick={onDeleteTrigger}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3 text-rose-500" />
                      <span>Delete</span>
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={onFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
