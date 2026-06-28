export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Document {
  id: string;
  name: string;
  fileName: string | null;
  size: string | null;
  status: string;
  uploadDate: string | null;
  rejectionReason: string | null;
}

export interface TimelineStep {
  status: string;
  desc: string;
  date: string | null;
  completed: boolean;
}

export interface Comment {
  sender: string;
  date: string;
  text: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  passportNumber: string;
  destination: string;
  visaType: string;
  applicationStatus: string;
  documents: Document[];
  timeline: TimelineStep[];
  comments: Comment[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  service: string;
  note: string;
  status: string;
}

export interface Task {
  id: string;
  text: string;
  dueDate: string;
  assignedTo: string;
  completed: boolean;
}

export interface HistoryLog {
  id: string;
  type: string;
  customer: string;
  detail: string;
  date: string;
  agent: string;
}

export interface Executive {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}
