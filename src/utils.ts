import { STATUS } from './constants';

// Format date timestamp to YYYY-MM-DD HH:MM
export const getFormattedDate = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// Validate email format structure using standard Regex pattern
export const isEmailValid = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate file uploads size limit and format extensions
export const validateFile = (
  file: File, 
  showToast?: (message: string, type: 'success' | 'warning' | 'info' | 'error') => void
): boolean => {
  const validExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validExtensions.includes(extension)) {
    if (showToast) {
      showToast('Invalid format. Please select PDF, PNG, or JPG formats.', 'error');
    }
    return false;
  }

  if (file.size > maxSize) {
    if (showToast) {
      showToast('Size limit exceeded. Files must be smaller than 5MB.', 'error');
    }
    return false;
  }

  return true;
};

// Map document status strings to Tailwind CSS layout badge colors
export const getStatusStyle = (status: string): string => {
  switch (status) {
    case STATUS.UPLOADED:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case STATUS.PENDING:
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case STATUS.UNDER_REVIEW:
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case STATUS.APPROVED:
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case STATUS.REJECTED:
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      if (status === 'Approved') return 'bg-teal-50 text-teal-700 border-teal-200';
      if (status === 'Rejected') return 'bg-rose-50 text-rose-700 border-rose-200';
      return 'bg-slate-50 text-slate-500 border-slate-200';
  }
};
