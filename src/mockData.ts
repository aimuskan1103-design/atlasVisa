import { Customer, Lead, Task, HistoryLog, Executive } from './types';

export const initialExecutives: Executive[] = [
  { id: 'ex-1', name: 'Alex Rivera', role: 'Senior Visa Consultant', email: 'alex.r@travelvisa.com' },
  { id: 'ex-2', name: 'Sophia Chen', role: 'Documentation Specialist', email: 'sophia.c@travelvisa.com' },
  { id: 'ex-3', name: 'Marcus Vance', role: 'Relations Manager', email: 'marcus.v@travelvisa.com' },
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-101',
    name: 'Muskan Kanani',
    email: 'muskan.sharma@example.com',
    phone: '+91 98765 43210',
    passportNumber: 'Z1234567',
    destination: 'United States',
    visaType: 'B1/B2 Tourist Visa',
    applicationStatus: 'Under Review', // Under Review, Approved, Rejected, Action Required, Draft
    timeline: [
      { date: '2026-06-20', status: 'Application Created', desc: 'Portal access granted and profile setup complete.', completed: true },
      { date: '2026-06-22', status: 'Documents Uploaded', desc: 'Initial documents uploaded by the customer.', completed: true },
      { date: '2026-06-24', status: 'Under Review', desc: 'Assigned specialist is checking document compliance.', completed: true },
      { date: null, status: 'Interview Scheduling', desc: 'Awaiting consulate slot availability.', completed: false },
      { date: null, status: 'Visa Decision', desc: 'Final passport collection and visa stamp.', completed: false },
    ],
    documents: [
      { id: 'doc-1', name: 'Passport', fileName: 'passport_muskan_main.pdf', status: 'Approved', uploadDate: '2026-06-22', rejectionReason: null, size: '2.4 MB' },
      { id: 'doc-2', name: 'Visa Documents', fileName: 'us_visa_form_ds160.pdf', status: 'Under Review', uploadDate: '2026-06-22', rejectionReason: null, size: '1.8 MB' },
      { id: 'doc-3', name: 'Passport-size Photo', fileName: 'muskan_photo_us_spec.jpg', status: 'Approved', uploadDate: '2026-06-22', rejectionReason: null, size: '450 KB' },
      { id: 'doc-4', name: 'Identity Proof', fileName: 'national_id_card.pdf', status: 'Under Review', uploadDate: '2026-06-23', rejectionReason: null, size: '1.1 MB' },
      { id: 'doc-5', name: 'Address Proof', fileName: 'utility_bill_may2026.pdf', status: 'Rejected', uploadDate: '2026-06-23', rejectionReason: 'The bill is outdated. Please upload a utility bill from the last 3 months.', size: '920 KB' },
      { id: 'doc-6', name: 'Financial Documents', fileName: null, status: 'Pending', uploadDate: null, rejectionReason: null, size: null },
      { id: 'doc-7', name: 'Additional Documents', fileName: null, status: 'Pending', uploadDate: null, rejectionReason: null, size: null },
    ],
    comments: [
      { sender: 'Admin (Alex Rivera)', date: '2026-06-24 10:15 AM', text: 'Everything looks solid, but we need a newer Address Proof. The current one is from February.' },
      { sender: 'System', date: '2026-06-23 04:30 PM', text: 'Address Proof document marked as Rejected.' }
    ]
  },
  {
    id: 'cust-102',
    name: 'Liam O\'Connor',
    email: 'liam.oconnor@example.com',
    phone: '+353 87 123 4567',
    passportNumber: 'PB987654',
    destination: 'Japan',
    visaType: 'Student Visa (MEXT)',
    applicationStatus: 'Approved',
    timeline: [
      { date: '2026-05-10', status: 'Application Created', desc: 'Portal setup complete.', completed: true },
      { date: '2026-05-12', status: 'Documents Uploaded', desc: 'All academic and financial proof uploaded.', completed: true },
      { date: '2026-05-15', status: 'Under Review', desc: 'Document compliance verified by Sophia.', completed: true },
      { date: '2026-06-01', status: 'Interview Scheduling', desc: 'Interview completed at Dublin Japanese Embassy.', completed: true },
      { date: '2026-06-25', status: 'Visa Decision', desc: 'Visa Approved and passport returned with stamp.', completed: true },
    ],
    documents: [
      { id: 'doc-1', name: 'Passport', fileName: 'passport_scan.pdf', status: 'Approved', uploadDate: '2026-05-12', rejectionReason: null, size: '3.1 MB' },
      { id: 'doc-2', name: 'Visa Documents', fileName: 'coe_japan_uni.pdf', status: 'Approved', uploadDate: '2026-05-12', rejectionReason: null, size: '2.5 MB' },
      { id: 'doc-3', name: 'Passport-size Photo', fileName: 'photo_white_bg.jpg', status: 'Approved', uploadDate: '2026-05-12', rejectionReason: null, size: '350 KB' },
      { id: 'doc-4', name: 'Identity Proof', fileName: 'driver_license.pdf', status: 'Approved', uploadDate: '2026-05-12', rejectionReason: null, size: '1.2 MB' },
      { id: 'doc-5', name: 'Address Proof', fileName: 'bank_statement_address.pdf', status: 'Approved', uploadDate: '2026-05-12', rejectionReason: null, size: '1.5 MB' },
      { id: 'doc-6', name: 'Financial Documents', fileName: 'scholarship_letter.pdf', status: 'Approved', uploadDate: '2026-05-12', rejectionReason: null, size: '890 KB' },
      { id: 'doc-7', name: 'Additional Documents', fileName: 'medical_cert.pdf', status: 'Approved', uploadDate: '2026-05-14', rejectionReason: null, size: '600 KB' },
    ],
    comments: [
      { sender: 'Admin (Sophia Chen)', date: '2026-06-25 09:00 AM', text: 'Visa has been successfully stamped! Ready for pickup.' }
    ]
  },
  {
    id: 'cust-103',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techcorp.com',
    phone: '+1 415 555 2671',
    passportNumber: 'US440912',
    destination: 'Germany',
    visaType: 'Schengen Business Visa',
    applicationStatus: 'Pending Review',
    timeline: [
      { date: '2026-06-25', status: 'Application Created', desc: 'Business profile initiated.', completed: true },
      { date: '2026-06-27', status: 'Documents Uploaded', desc: 'Corporate invitation letter and details uploaded.', completed: true },
      { date: null, status: 'Under Review', desc: 'Awaiting admin clearance.', completed: false },
      { date: null, status: 'Interview Scheduling', desc: 'Priority corporate scheduling pending.', completed: false },
      { date: null, status: 'Visa Decision', desc: 'Schengen clearance process.', completed: false },
    ],
    documents: [
      { id: 'doc-1', name: 'Passport', fileName: 'passport_scan.pdf', status: 'Uploaded', uploadDate: '2026-06-27', rejectionReason: null, size: '3.4 MB' },
      { id: 'doc-2', name: 'Visa Documents', fileName: 'germany_invitation_letter.pdf', status: 'Uploaded', uploadDate: '2026-06-27', rejectionReason: null, size: '1.2 MB' },
      { id: 'doc-3', name: 'Passport-size Photo', fileName: 'biometric_photo.jpg', status: 'Uploaded', uploadDate: '2026-06-27', rejectionReason: null, size: '400 KB' },
      { id: 'doc-4', name: 'Identity Proof', fileName: 'company_id_card.pdf', status: 'Uploaded', uploadDate: '2026-06-27', rejectionReason: null, size: '850 KB' },
      { id: 'doc-5', name: 'Address Proof', fileName: null, status: 'Pending', uploadDate: null, rejectionReason: null, size: null },
      { id: 'doc-6', name: 'Financial Documents', fileName: 'bank_guarantee_letter.pdf', status: 'Uploaded', uploadDate: '2026-06-27', rejectionReason: null, size: '2.1 MB' },
      { id: 'doc-7', name: 'Additional Documents', fileName: null, status: 'Pending', uploadDate: null, rejectionReason: null, size: null },
    ],
    comments: [
      { sender: 'System', date: '2026-06-27 11:15 AM', text: 'Customer uploaded 5 essential documents.' }
    ]
  },
  {
    id: 'cust-104',
    name: 'Elena Rostova',
    email: 'elena.rostova@globaltravel.com',
    phone: '+44 7911 123456',
    passportNumber: 'GB882319',
    destination: 'United Kingdom',
    visaType: 'Passport Renewal',
    applicationStatus: 'Action Required',
    timeline: [
      { date: '2026-06-15', status: 'Application Created', desc: 'Renewal form opened.', completed: true },
      { date: '2026-06-16', status: 'Documents Uploaded', desc: 'Old passport data submitted.', completed: true },
      { date: '2026-06-18', status: 'Under Review', desc: 'Executive flagged photo quality.', completed: true },
      { date: null, status: 'Interview Scheduling', desc: 'Biometric capture appointment required.', completed: false },
      { date: null, status: 'Visa Decision', desc: 'New booklet issuance.', completed: false },
    ],
    documents: [
      { id: 'doc-1', name: 'Passport', fileName: 'old_expired_passport.pdf', status: 'Approved', uploadDate: '2026-06-16', rejectionReason: null, size: '5.2 MB' },
      { id: 'doc-2', name: 'Visa Documents', fileName: 'renewal_application_v2.pdf', status: 'Approved', uploadDate: '2026-06-16', rejectionReason: null, size: '1.4 MB' },
      { id: 'doc-3', name: 'Passport-size Photo', fileName: 'bad_lighting_selfie.jpg', status: 'Rejected', uploadDate: '2026-06-16', rejectionReason: 'The photo must have a plain light background and professional lighting (no selfies).', size: '2.1 MB' },
      { id: 'doc-4', name: 'Identity Proof', fileName: 'citizenship_cert.pdf', status: 'Approved', uploadDate: '2026-06-16', rejectionReason: null, size: '2.0 MB' },
      { id: 'doc-5', name: 'Address Proof', fileName: 'council_tax_bill.pdf', status: 'Approved', uploadDate: '2026-06-16', rejectionReason: null, size: '1.1 MB' },
      { id: 'doc-6', name: 'Financial Documents', fileName: null, status: 'Pending', uploadDate: null, rejectionReason: null, size: null },
      { id: 'doc-7', name: 'Additional Documents', fileName: null, status: 'Pending', uploadDate: null, rejectionReason: null, size: null },
    ],
    comments: [
      { sender: 'Admin (Marcus Vance)', date: '2026-06-18 02:40 PM', text: 'Photo does not meet UK government standards. Please take a high-res photo at a passport booth and re-upload.' }
    ]
  }
];

export const initialLeads: Lead[] = [
  { id: 'lead-1', name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', service: 'Schengen Tourist Visa', status: 'New', note: 'Interested in traveling to France in August. Budget is moderate.' },
  { id: 'lead-2', name: 'Chloe Dubois', email: 'chloe.d@yahoo.com', service: 'US Student Visa', status: 'Contacted', note: 'Sent email with list of documents required for F1 visa.' },
  { id: 'lead-3', name: 'Daniel Kim', email: 'daniel.kim@corp.kr', service: 'Business Passport Express', status: 'In Progress', note: 'Corporate client looking for 3 express renewals. Sent proposal.' },
  { id: 'lead-4', name: 'Fatima Al-Sayed', email: 'fatima.s@outlook.com', service: 'UK Tourist Visa', status: 'Converted', note: 'Converted to Customer! Initiating profile cust-105.' },
  { id: 'lead-5', name: 'Robert Miller', email: 'robert.m@gmail.com', service: 'Travel Insurance Premium', status: 'Closed', note: 'Client went with bank-provided credit card insurance instead.' }
];

export const initialTasks: Task[] = [
  { id: 'task-1', text: 'Review US Visa form for Muskan Kanani', dueDate: 'Today', assignedTo: 'Alex Rivera', completed: false },
  { id: 'task-2', text: 'Call Chloe Dubois regarding F1 guidelines', dueDate: 'Tomorrow', assignedTo: 'Sophia Chen', completed: false },
  { id: 'task-3', text: 'Check UK renewal passport dimensions for Elena', dueDate: 'In 2 days', assignedTo: 'Marcus Vance', completed: true },
  { id: 'task-4', text: 'Generate monthly report on visa approval ratings', dueDate: 'June 30', assignedTo: 'Alex Rivera', completed: false },
];

export const initialHistory: HistoryLog[] = [
  { id: 'hist-1', type: 'Call', customer: 'Muskan Kanani', detail: 'Spoke with customer regarding Address Proof rejection. She will upload the new electric bill tonight.', date: '2026-06-28 11:30 AM', agent: 'Alex Rivera' },
  { id: 'hist-2', type: 'Email', customer: 'Liam O\'Connor', detail: 'Sent confirmation email for passport pickup and final receipt.', date: '2026-06-28 09:15 AM', agent: 'Sophia Chen' },
  { id: 'hist-3', type: 'Note', customer: 'Sarah Jenkins', detail: 'Initiated background verification on the German sponsoring organization.', date: '2026-06-27 04:45 PM', agent: 'Sophia Chen' },
  { id: 'hist-4', type: 'System', customer: 'Elena Rostova', detail: 'Triggered automated SMS notification for document correction.', date: '2026-06-18 02:45 PM', agent: 'System' }
];
