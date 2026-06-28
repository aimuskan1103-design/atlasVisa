export const STATUS = {
  UPLOADED: 'Uploaded',
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ACTION_REQUIRED: 'Action Required'
} as const;

export const VIEWS = {
  HOME: 'home',
  SERVICES: 'services',
  LOGIN: 'login',
  CUSTOMER_DASHBOARD: 'customer-dashboard',
  ADMIN_DASHBOARD: 'admin-dashboard'
} as const;

export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
} as const;

export const PIPELINE_STAGES = ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'] as const;

export const DESTINATIONS = [
  { 
    name: 'United States', 
    visa: 'B1/B2 Visitor, F1 Student', 
    processing: '12-15 Days', 
    fee: '$185', 
    rating: '4.90', 
    glow: 'border border-slate-200 bg-white hover:border-indigo-200', 
    badge: 'Popular Route',
    badgeColor: 'bg-indigo-50 text-indigo-600 border border-indigo-100'
  },
  { 
    name: 'Japan', 
    visa: 'Short-term Tourist, MEXT Student', 
    processing: '4-6 Days', 
    fee: '$30', 
    rating: '4.95', 
    glow: 'border border-slate-200 bg-white hover:border-purple-200', 
    badge: 'Fastest Review',
    badgeColor: 'bg-purple-50 text-purple-600 border border-purple-100'
  },
  { 
    name: 'Schengen Area', 
    visa: 'Business, Tourist Multi-Entry', 
    processing: '10-14 Days', 
    fee: '€80', 
    rating: '4.85', 
    glow: 'border border-slate-200 bg-white hover:border-teal-200', 
    badge: 'Consulate Entry',
    badgeColor: 'bg-teal-50 text-teal-600 border border-teal-100'
  },
  { 
    name: 'United Kingdom', 
    visa: 'Standard Visitor, Student Route', 
    processing: '8-10 Days', 
    fee: '£115', 
    rating: '4.88', 
    glow: 'border border-slate-200 bg-white hover:border-blue-200', 
    badge: 'Priority Slots',
    badgeColor: 'bg-blue-50 text-blue-600 border border-blue-100'
  }
] as const;

export const FAQS = [
  { q: 'How long does standard visa processing take?', a: 'Standard tourist visa processing averages 5-12 working days depending on the destination country and consulate queue times. Priority routes can expedite this to 2-3 business days.' },
  { q: 'What document formats are accepted for uploads?', a: 'We support high-resolution PDF, JPG, or PNG scans. Files must be clear, legible, and not exceed 5MB to ensure consulate compatibility.' },
  { q: 'How does real-time CRM advisor verification work?', a: 'Once you upload a document scan, our document specialists are notified instantly. They audit each file and mark them as Approved or request corrections with notes.' },
  { q: 'Can I cancel or replace documents after uploading?', a: 'Yes, you can replace or delete any pending, uploaded, or rejected documents directly from your customer checklist portal.' }
] as const;

export const DOCUMENT_CATEGORIES = [
  'Passport Bio-Page',
  'Visa Documents',
  'Passport-size Photo',
  'Identity Proof',
  'Address Proof',
  'Financial Documents',
  'Additional Documents'
] as const;
