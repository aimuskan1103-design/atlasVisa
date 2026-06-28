import React, { useState } from 'react';
import { Search, TrendingUp, Users, AlertTriangle, Briefcase, Clock, Check, X, FileText, Mail, Phone, CheckSquare, Square, Plus } from 'lucide-react';
import LeadCard from '../components/LeadCard';
import TextInput from '../components/ui/TextInput';
import { PIPELINE_STAGES } from '../constants';
import { getStatusStyle } from '../utils';
import { Customer, Lead, Task, HistoryLog, Executive } from '../types';

interface AdminDashboardProps {
  customers: Customer[];
  leads: Lead[];
  tasks: Task[];
  history: HistoryLog[];
  executives: Executive[];
  onApproveDocument: (customerId: string, docId: string) => void;
  onRejectDocument: (customerId: string, docId: string, reason: string) => void;
  onAddComment: (customerId: string, sender: string, text: string) => void;
  onMoveLead: (leadId: string, newStage: string) => void;
  onAddTask: (text: string, dueDate: string, assignedTo: string) => void;
  onToggleTask: (taskId: string) => void;
  onAddHistory: (type: string, customerName: string, details: string, agent: string) => void;
  showToast?: (message: string, type: 'success' | 'warning' | 'info' | 'error') => void;
}

export default function AdminDashboard({
  customers,
  leads,
  tasks,
  history,
  executives,
  onApproveDocument,
  onRejectDocument,
  onAddComment,
  onMoveLead,
  onAddTask,
  onToggleTask,
  onAddHistory,
  showToast
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'crm' | 'leads' | 'tasks' | 'overview'>('crm');
  
  // CRM state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customers[0]?.id || null);
  
  // Reject reason modal/input state
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  
  // Internal comment input state
  const [internalCommentText, setInternalCommentText] = useState('');
  
  // Task form state
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDue, setNewTaskDue] = useState('Today');
  const [newTaskAssignee, setNewTaskAssignee] = useState(executives[0]?.name || '');

  // Interaction logger form state
  const [newHistType, setNewHistType] = useState('Call');
  const [newHistDetails, setNewHistDetails] = useState('');

  // Kanban Drag and Drop active column state
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Selected customer data
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Filtered customers
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.applicationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // CRM: Handle document approval
  const handleApprove = (docId: string) => {
    if (!selectedCustomer) return;
    onApproveDocument(selectedCustomer.id, docId);
    
    // Log action to history
    onAddHistory(
      'System',
      selectedCustomer.name,
      `Document "${selectedCustomer.documents.find(d => d.id === docId)?.name}" was Approved by Alex Rivera.`,
      'Alex Rivera'
    );
    
    if (showToast) {
      showToast(`Approved document: ${selectedCustomer.documents.find(d => d.id === docId)?.name}`, 'success');
    }
  };

  // CRM: Open reject prompt
  const handleRejectPrompt = (docId: string) => {
    setRejectingDocId(docId);
    setRejectionReasonText('');
  };

  // CRM: Submit document rejection
  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanReason = rejectionReasonText.trim();
    if (!selectedCustomer || !rejectingDocId) return;

    if (!cleanReason) {
      if (showToast) showToast('Please enter a rejection reason.', 'error');
      return;
    }
    if (cleanReason.length < 4) {
      if (showToast) showToast('Rejection reason must be at least 4 characters long.', 'error');
      return;
    }

    onRejectDocument(selectedCustomer.id, rejectingDocId, cleanReason);
    
    // Log action to history
    onAddHistory(
      'System',
      selectedCustomer.name,
      `Document "${selectedCustomer.documents.find(d => d.id === rejectingDocId)?.name}" was Rejected. Reason: ${cleanReason}`,
      'Alex Rivera'
    );

    if (showToast) {
      showToast(`Rejected document with instruction: "${cleanReason}"`, 'warning');
    }

    setRejectingDocId(null);
    setRejectionReasonText('');
  };

  // CRM: Submit internal advisor note
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanComment = internalCommentText.trim();
    if (!selectedCustomer) return;

    if (!cleanComment) {
      if (showToast) showToast('Please write a feedback note.', 'error');
      return;
    }
    if (cleanComment.length < 3) {
      if (showToast) showToast('Advisor comment must be at least 3 characters long.', 'error');
      return;
    }

    onAddComment(selectedCustomer.id, 'Admin (Alex Rivera)', cleanComment);
    
    // Add to history list as a Note
    onAddHistory(
      'Note',
      selectedCustomer.name,
      `Internal Note added: "${cleanComment}"`,
      'Alex Rivera'
    );

    if (showToast) {
      showToast('Advisor comment logged to checklist details.', 'success');
    }

    setInternalCommentText('');
  };

  // Task: Submit task creator
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTask = newTaskText.trim();
    
    if (!cleanTask) {
      if (showToast) showToast('Please define a task text description.', 'error');
      return;
    }
    if (cleanTask.length < 3) {
      if (showToast) showToast('Task description must be at least 3 characters.', 'error');
      return;
    }

    onAddTask(cleanTask, newTaskDue, newTaskAssignee);
    if (showToast) {
      showToast(`Task created and assigned to ${newTaskAssignee.split(' ')[0]}.`, 'success');
    }
    setNewTaskText('');
  };

  // History: Log customer call/email interaction
  const handleHistorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDetails = newHistDetails.trim();
    if (!selectedCustomer) return;

    if (!cleanDetails) {
      if (showToast) showToast('Please describe the interaction details.', 'error');
      return;
    }
    if (cleanDetails.length < 5) {
      if (showToast) showToast('Interaction log must be at least 5 characters long.', 'error');
      return;
    }

    onAddHistory(newHistType, selectedCustomer.name, cleanDetails, 'Alex Rivera');
    if (showToast) {
      showToast(`Logged "${newHistType}" interaction detail for ${selectedCustomer.name}.`, 'success');
    }
    setNewHistDetails('');
  };

  const handleToggleTaskWithToast = (taskId: string, taskText: string, completed: boolean) => {
    onToggleTask(taskId);
    if (showToast) {
      showToast(completed ? `Task set to pending: "${taskText}"` : `Completed: "${taskText}"`, 'info');
    }
  };

  const handleMoveLeadWithToast = (leadId: string, leadName: string, nextStage: string) => {
    onMoveLead(leadId, nextStage);
    if (showToast) {
      showToast(`Lead "${leadName}" transitioned to ${nextStage}.`, 'success');
    }
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, stage: string) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (!leadId) return;

    const targetLead = leads.find(l => l.id === leadId);
    if (targetLead) {
      if (targetLead.status === targetStage) return; // avoid duplicates
      handleMoveLeadWithToast(leadId, targetLead.name, targetStage);
    }
  };

  return (
    <div className="flex-grow bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 animate-slide-in text-slate-800">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Dashboard Title & Tabs Console */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 select-none">
              CRM Controller Workspace
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mt-1 tracking-tight">
              Travel Logistics Dashboard
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1.5 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm select-none">
            {[
              { id: 'crm', label: 'CRM Directory' },
              { id: 'leads', label: 'Leads Board' },
              { id: 'tasks', label: 'Tasks Desk' },
              { id: 'overview', label: 'Admin Overview' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl px-4.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-slide-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Customers', val: customers.length, desc: 'Registered database profiles', icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' },
                { title: 'Active Applications', val: customers.filter(c => c.applicationStatus !== 'Approved').length, desc: 'Processing documentation pathways', icon: Briefcase, color: 'text-orange-600 bg-orange-50 border-orange-100' },
                { title: 'Pending Reviews', val: customers.filter(c => c.applicationStatus === 'Pending Review' || c.documents.some(d => d.status === 'Uploaded')).length, desc: 'Audits and corrections needed', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                { title: 'Est. Monthly Revenue', val: '$14,850', desc: 'Active travel bookings invoices', icon: TrendingUp, color: 'text-teal-600 bg-teal-50 border-teal-100' }
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-premium flex items-center justify-between transition-all hover:shadow-hover">
                    <div className="space-y-1.5">
                      <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider block">{card.title}</span>
                      <span className="text-2xl font-extrabold text-slate-900 block tracking-tight">{card.val}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block">{card.desc}</span>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${card.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Split feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Activity log (2 Cols) */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-premium space-y-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Recent CRM Activities Log</h2>
                  <p className="text-xs text-slate-400">Chronological history of communications and system changes.</p>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {history.map((hist) => (
                    <div key={hist.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                        hist.type === 'Call' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        hist.type === 'Email' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                        hist.type === 'Note' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}>
                        {hist.type[0]}
                      </div>
                      
                      <div className="flex-1 space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">
                            {hist.type} Log: {hist.customer}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                            <Clock className="h-2.5 w-2.5" />
                            <span>{hist.date}</span>
                          </span>
                        </div>
                        <p className="text-slate-500 leading-relaxed font-medium">{hist.detail}</p>
                        <span className="text-[10px] text-slate-400 font-bold block pt-1">
                          Logged by: {hist.agent}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff details */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-premium space-y-6">
                <h2 className="text-base font-bold text-slate-900">Active Consultative Staff</h2>
                
                <div className="space-y-4">
                  {executives.map((exec) => (
                    <div key={exec.id} className="p-4 border border-slate-100 rounded-2xl flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-slate-800 block">{exec.name}</span>
                        <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider block">{exec.role}</span>
                        <span className="text-[10px] text-slate-500 block">{exec.email}</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs">
                        {exec.name.split(' ')[0][0]}{exec.name.split(' ')[1]?.[0] || ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CRM Directory */}
        {activeTab === 'crm' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-in">
            
            {/* Customer Records Listing */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-premium space-y-4">
              <div className="space-y-2">
                <h2 className="text-base font-bold text-slate-900">Customer Directory</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name or passport..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-blue-500 transition-colors bg-slate-50"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-500 outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Action Required">Action Required</option>
                  </select>
                </div>
              </div>

              {/* Loop list */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(c => {
                    const isSelected = c.id === selectedCustomerId;
                    const requiresAudit = c.documents.some(d => d.status === 'Uploaded');
                    
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCustomerId(c.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex justify-between items-center ${
                          isSelected 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-sm' 
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold block truncate max-w-[120px]">{c.name}</span>
                            {requiresAudit && (
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 block shrink-0 animate-pulse" title="Needs document audit" />
                            )}
                          </div>
                          <span className={`text-[10px] block ${isSelected ? 'text-slate-400' : 'text-slate-500'} font-medium`}>
                            {c.destination} • {c.visaType.split(' ')[0]}
                          </span>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getStatusStyle(c.applicationStatus)}`}>
                            {c.applicationStatus}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-xs text-slate-400">
                    No customer records match filters.
                  </div>
                )}
              </div>
            </div>

            {/* Profile Inspector Drawer (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              {selectedCustomer ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium p-6 space-y-6 transition-all animate-slide-in">
                  
                  {/* Customer Header Details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
                    <div className="space-y-1">
                      <span className="text-2xs font-bold text-slate-400 uppercase tracking-wider">ID: {selectedCustomer.id}</span>
                      <h2 className="text-lg font-bold text-slate-950 tracking-tight">{selectedCustomer.name}</h2>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center space-x-1">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          <span>{selectedCustomer.email}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          <span>{selectedCustomer.phone}</span>
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-2.5 text-xs text-slate-600 bg-slate-50">
                      <span className="font-bold block text-[9px] text-slate-400 uppercase leading-none">Passport Details</span>
                      <span className="font-bold text-slate-700 block mt-1.5">{selectedCustomer.passportNumber}</span>
                    </div>
                  </div>

                  {/* Document Auditor */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-800">Uploaded Document Auditing</h3>
                    
                    <div className="space-y-3">
                      {selectedCustomer.documents.map((doc) => {
                        const hasFile = doc.fileName !== null;
                        const isRejectingThis = rejectingDocId === doc.id;
                        
                        return (
                          <div 
                            key={doc.id} 
                            className={`rounded-2xl border p-4 flex flex-col gap-3 transition-all ${
                              doc.status === 'Uploaded' ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200/60 bg-white'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                              <div className="flex items-center space-x-3">
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  doc.status === 'Approved' ? 'bg-teal-50 text-teal-600 border border-teal-100' :
                                  doc.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                  doc.status === 'Uploaded' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                  'bg-slate-50 text-slate-500 border border-slate-200'
                                }`}>
                                  <FileText className="h-4.5 w-4.5" />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-800 block">{doc.name}</span>
                                  {hasFile ? (
                                    <span className="text-[10px] text-slate-500 block truncate max-w-[200px] sm:max-w-xs font-medium">
                                      {doc.fileName} ({doc.size})
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 block italic font-semibold">Awaiting upload</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 shrink-0">
                                {/* Badges */}
                                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusStyle(doc.status)}`}>
                                  {doc.status}
                                </span>

                                {/* Audit Actions */}
                                {hasFile && doc.status !== 'Approved' && doc.status !== 'Rejected' && (
                                  <div className="flex space-x-1.5 animate-slide-in">
                                    <button
                                      onClick={() => handleApprove(doc.id)}
                                      title="Approve Document"
                                      className="h-7 w-7 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 border border-teal-200 flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleRejectPrompt(doc.id)}
                                      title="Reject & Write Correction Note"
                                      className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Rejection comment input */}
                            {isRejectingThis && (
                              <form onSubmit={handleRejectSubmit} className="border-t border-slate-100 pt-3 flex gap-2 animate-slide-in">
                                <TextInput
                                  placeholder="Specify correction instructions (e.g. Scan is cut off)..."
                                  value={rejectionReasonText}
                                  onChange={(e) => setRejectionReasonText(e.target.value)}
                                  className="flex-1"
                                />
                                <button
                                  type="submit"
                                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 transition-colors cursor-pointer shrink-0"
                                >
                                  Reject File
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectingDocId(null)}
                                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 shrink-0 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </form>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes & Logs Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                    
                    {/* Discussion Comments */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">Internal Discussion Notes</h4>
                      
                      <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                        {selectedCustomer.comments?.map((comment, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs leading-relaxed text-slate-600 font-medium">
                            <div className="flex justify-between items-center mb-0.5 font-bold">
                              <span className="text-slate-800">{comment.sender}</span>
                              <span className="text-slate-400 font-medium">{comment.date}</span>
                            </div>
                            <p>{comment.text}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleCommentSubmit} className="flex gap-2">
                        <TextInput
                          placeholder="Send feedback note..."
                          value={internalCommentText}
                          onChange={(e) => setInternalCommentText(e.target.value)}
                          className="flex-1"
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-blue-600 text-white px-3.5 py-1.5 text-xs font-bold hover:bg-blue-500 transition-colors cursor-pointer"
                        >
                          Send
                        </button>
                      </form>
                    </div>

                    {/* Logging Interactions */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">Log Customer Interaction</h4>
                      
                      <form onSubmit={handleHistorySubmit} className="space-y-2.5">
                        <div className="flex items-center space-x-2">
                          <label className="text-2xs font-bold text-slate-400 uppercase">Method:</label>
                          {['Call', 'Email', 'Note'].map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setNewHistType(type)}
                              className={`rounded px-2.5 py-1 text-2xs font-bold cursor-pointer transition-colors ${
                                newHistType === type 
                                  ? 'bg-slate-800 text-white shadow-sm' 
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Provide interaction specifics..."
                          value={newHistDetails}
                          onChange={(e) => setNewHistDetails(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-blue-500 bg-slate-50 text-slate-900"
                        />

                        <button
                          type="submit"
                          className="w-full rounded-lg bg-slate-900 text-white py-1.5 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Log Interaction Event
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 bg-white border border-slate-200/80 rounded-3xl shadow-premium">
                  Select a customer record to begin documentation auditing.
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 3: Leads Pipeline */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-premium space-y-6 animate-slide-in">
            <div>
              <h2 className="text-base font-bold text-slate-900">CRM Lead Pipeline Management</h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage incoming inquiries by dragging lead cards across column stages.
              </p>
            </div>

            {/* Kanban layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
              {PIPELINE_STAGES.map((stage) => {
                const stageLeads = leads.filter(l => l.status === stage);
                const isOver = dragOverStage === stage;
                
                return (
                  <div 
                    key={stage}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, stage)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, stage)}
                    className={`rounded-2xl border p-4 min-w-[200px] flex flex-col space-y-4 transition-colors ${
                      isOver 
                        ? 'bg-indigo-50/70 border-dashed border-indigo-300' 
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    
                    {/* Column Header */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2 select-none">
                      <span className="text-xs font-bold text-slate-700">{stage}</span>
                      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {stageLeads.length}
                      </span>
                    </div>

                    {/* Column Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
                      {stageLeads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onNextStage={() => {
                            const currentIndex = PIPELINE_STAGES.indexOf(stage as any);
                            handleMoveLeadWithToast(lead.id, lead.name, PIPELINE_STAGES[currentIndex + 1]);
                          }}
                          showNextStageButton={stage !== 'Closed'}
                        />
                      ))}

                      {stageLeads.length === 0 && (
                        <div className="text-center py-10 text-[10px] text-slate-400 italic">
                          No leads here
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Tasks Desk */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-in">
            
            {/* Task list */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-premium space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Task Scheduler List</h2>
                <p className="text-xs text-slate-400 mt-1">Track documentation task lists assigned to advisors.</p>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => handleToggleTaskWithToast(task.id, task.text, task.completed)}
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer select-none transition-colors ${
                      task.completed 
                        ? 'border-slate-100 bg-slate-50 text-slate-400 line-through' 
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {task.completed ? (
                        <CheckSquare className="h-5 w-5 text-blue-500 shrink-0" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold truncate max-w-[200px] sm:max-w-md">
                        {task.text}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs shrink-0 font-semibold">
                      <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] text-slate-600">
                        {task.assignedTo.split(' ')[0]}
                      </span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-md ${
                        task.dueDate === 'Today' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Create Task panel */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-premium space-y-6">
              <h2 className="text-base font-bold text-slate-900">Create New Task</h2>
              
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <TextInput
                  label="Task Definition"
                  placeholder="e.g. Review UK passport sizing..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-slate-400 uppercase mb-1">Due Date</label>
                    <select
                      value={newTaskDue}
                      onChange={(e) => setNewTaskDue(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 outline-none cursor-pointer"
                    >
                      <option value="Today">Today</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="In 2 days">In 2 days</option>
                      <option value="Next week">Next week</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-400 uppercase mb-1">Assign Executive</label>
                    <select
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 outline-none cursor-pointer"
                    >
                      {executives.map(exec => (
                        <option key={exec.id} value={exec.name}>{exec.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-slate-900 text-white py-2.5 text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-slate-100"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
