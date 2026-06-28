import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ToastContainer from './components/ToastContainer';
import ConfirmModal from './components/ui/ConfirmModal';
import {
  initDB,
  getAllRecords,
  putRecord,
  getSessionUser,
  setSessionUser,
  clearSession
} from './db';
import { initialExecutives } from './mockData';
import { STATUS, VIEWS, ROLES } from './constants';
import { getFormattedDate } from './utils';
import { User, Customer, Lead, Task, HistoryLog, Toast, Document, TimelineStep } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<string>(VIEWS.HOME);
  const [loading, setLoading] = useState<boolean>(true);

  // Database States
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [selectedVisaType, setSelectedVisaType] = useState<string>('');

  // Global Toasts Queue State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Confirmation Modals State
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState<boolean>(false);

  // Open database connection & seed initial data on component mount
  useEffect(() => {
    async function loadDatabase() {
      try {
        console.log('Connecting to browser database wrapper...');
        await initDB();

        // Fetch all objects from stores
        const dbCustomers = await getAllRecords<Customer>('customers');
        const dbLeads = await getAllRecords<Lead>('leads');
        const dbTasks = await getAllRecords<Task>('tasks');
        const dbHistory = await getAllRecords<HistoryLog>('history');
        const sessionUser = await getSessionUser();

        setCustomers(dbCustomers);
        setLeads(dbLeads);
        setTasks(dbTasks);
        setHistory(dbHistory.reverse());

        // Restore active user session if exists
        if (sessionUser) {
          setCurrentUser(sessionUser);
          if (sessionUser.role === ROLES.ADMIN) {
            setView(VIEWS.ADMIN_DASHBOARD);
          } else {
            setView(VIEWS.CUSTOMER_DASHBOARD);
          }
        }
      } catch (err) {
        console.error('Database connection failed:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDatabase();
  }, []);

  // Toast emitter utility
  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    const newToast: Toast = {
      id: Date.now(),
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // State Handler: Login Success
  const handleLoginSuccess = async (user: User) => {
    await setSessionUser(user);
    setCurrentUser(user);
    if (user.role === ROLES.ADMIN) {
      setView(VIEWS.ADMIN_DASHBOARD);
    } else {
      setView(VIEWS.CUSTOMER_DASHBOARD);
    }
    showToast(`Logged in successfully. Welcome back, ${user.name}!`, 'success');
  };

  // State Handler: Logout
  const handleLogout = async () => {
    setConfirmLogoutOpen(false);
    await clearSession();
    setCurrentUser(null);
    setView(VIEWS.HOME);
    showToast('Signed out of session workspace.', 'info');
  };

  // State Handler: Upload Document (IndexedDB write + status check)
  const handleUploadDocument = async (customerId: string, docId: string, fileName: string, fileSize: string) => {
    const updatedCustomers = customers.map(cust => {
      if (cust.id === customerId) {
        const updatedDocs = cust.documents.map(doc => {
          if (doc.id === docId) {
            return {
              ...doc,
              fileName,
              size: fileSize,
              status: STATUS.UPLOADED, // Status resets to Uploaded
              uploadDate: getFormattedDate().split(' ')[0],
              rejectionReason: null
            };
          }
          return doc;
        });

        // Business Logic Check: Re-uploading approved documents resets overall application status
        let nextAppStatus = cust.applicationStatus;
        if (cust.applicationStatus === STATUS.APPROVED || cust.applicationStatus === 'Draft' || cust.applicationStatus === STATUS.ACTION_REQUIRED) {
          nextAppStatus = STATUS.UNDER_REVIEW;
        }

        const updatedComments = [
          {
            sender: 'System',
            date: getFormattedDate(),
            text: `Uploaded file for Checklist: "${updatedDocs.find(d => d.id === docId)?.name}"`
          },
          ...cust.comments
        ];

        return {
          ...cust,
          documents: updatedDocs,
          applicationStatus: nextAppStatus,
          comments: updatedComments
        };
      }
      return cust;
    });

    setCustomers(updatedCustomers);

    // Save to database
    const updatedCustObj = updatedCustomers.find(c => c.id === customerId);
    if (updatedCustObj) {
      await putRecord('customers', updatedCustObj);
    }
  };

  // State Handler: Delete Document (IndexedDB write)
  const handleDeleteDocument = async (customerId: string, docId: string) => {
    const updatedCustomers = customers.map(cust => {
      if (cust.id === customerId) {
        const targetDoc = cust.documents.find(d => d.id === docId);
        const updatedDocs = cust.documents.map(doc => {
          if (doc.id === docId) {
            return {
              ...doc,
              fileName: null,
              size: null,
              status: STATUS.PENDING,
              uploadDate: null,
              rejectionReason: null
            };
          }
          return doc;
        });

        // App status fallback review
        let nextAppStatus = cust.applicationStatus;
        if (cust.applicationStatus === STATUS.APPROVED) {
          nextAppStatus = STATUS.UNDER_REVIEW;
        }

        const updatedComments = [
          {
            sender: 'System',
            date: getFormattedDate(),
            text: `Removed Checklist item: "${targetDoc?.name}"`
          },
          ...cust.comments
        ];

        return {
          ...cust,
          documents: updatedDocs,
          applicationStatus: nextAppStatus,
          comments: updatedComments
        };
      }
      return cust;
    });

    setCustomers(updatedCustomers);

    // Save to database
    const updatedCustObj = updatedCustomers.find(c => c.id === customerId);
    if (updatedCustObj) {
      await putRecord('customers', updatedCustObj);
    }
  };

  // State Handler: Approve Document (IndexedDB write + automatic application state evaluation)
  const handleApproveDocument = async (customerId: string, docId: string) => {
    const updatedCustomers = customers.map(cust => {
      if (cust.id === customerId) {
        const targetDoc = cust.documents.find(d => d.id === docId);
        const updatedDocs = cust.documents.map(doc => {
          if (doc.id === docId) {
            return {
              ...doc,
              status: STATUS.APPROVED,
              rejectionReason: null
            };
          }
          return doc;
        });

        // Core validation loop: If all slots are approved, application status switches to Approved
        const allApproved = updatedDocs.every(d => d.status === STATUS.APPROVED);
        const nextAppStatus = allApproved ? STATUS.APPROVED : STATUS.UNDER_REVIEW;

        const updatedComments = [
          {
            sender: 'Admin (Alex Rivera)',
            date: getFormattedDate(),
            text: `Approved Checklist document: "${targetDoc?.name}"`
          },
          ...cust.comments
        ];

        const updatedTimeline = cust.timeline.map(step => {
          if (allApproved && step.status === 'Visa Decision') {
            return { ...step, date: getFormattedDate().split(' ')[0], completed: true };
          }
          if (step.status === 'Under Review' && !step.completed) {
            return { ...step, date: getFormattedDate().split(' ')[0], completed: true };
          }
          return step;
        });

        return {
          ...cust,
          documents: updatedDocs,
          applicationStatus: nextAppStatus,
          timeline: updatedTimeline,
          comments: updatedComments
        };
      }
      return cust;
    });

    setCustomers(updatedCustomers);

    // Save to database
    const updatedCustObj = updatedCustomers.find(c => c.id === customerId);
    if (updatedCustObj) {
      await putRecord('customers', updatedCustObj);
    }
  };

  // State Handler: Reject Document (IndexedDB write)
  const handleRejectDocument = async (customerId: string, docId: string, rejectionReason: string) => {
    const updatedCustomers = customers.map(cust => {
      if (cust.id === customerId) {
        const targetDoc = cust.documents.find(d => d.id === docId);
        const updatedDocs = cust.documents.map(doc => {
          if (doc.id === docId) {
            return {
              ...doc,
              status: STATUS.REJECTED,
              rejectionReason
            };
          }
          return doc;
        });

        const nextAppStatus = STATUS.ACTION_REQUIRED;

        const updatedComments = [
          {
            sender: 'Admin (Alex Rivera)',
            date: getFormattedDate(),
            text: `Rejected Checklist document: "${targetDoc?.name}". Correction Instruction: ${rejectionReason}`
          },
          ...cust.comments
        ];

        return {
          ...cust,
          documents: updatedDocs,
          applicationStatus: nextAppStatus,
          comments: updatedComments
        };
      }
      return cust;
    });

    setCustomers(updatedCustomers);

    // Save to database
    const updatedCustObj = updatedCustomers.find(c => c.id === customerId);
    if (updatedCustObj) {
      await putRecord('customers', updatedCustObj);
    }
  };

  // State Handler: Add Advisor Comment (IndexedDB write)
  const handleAddComment = async (customerId: string, sender: string, text: string) => {
    const updatedCustomers = customers.map(cust => {
      if (cust.id === customerId) {
        return {
          ...cust,
          comments: [
            {
              sender,
              date: getFormattedDate(),
              text
            },
            ...cust.comments
          ]
        };
      }
      return cust;
    });

    setCustomers(updatedCustomers);

    // Save to database
    const updatedCustObj = updatedCustomers.find(c => c.id === customerId);
    if (updatedCustObj) {
      await putRecord('customers', updatedCustObj);
    }
  };

  // State Handler: Move Lead Pipeline Stage (IndexedDB write)
  const handleMoveLead = async (leadId: string, newStatus: string) => {
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, status: newStatus };
      }
      return lead;
    });

    setLeads(updatedLeads);

    // Save to database
    const updatedLeadObj = updatedLeads.find(l => l.id === leadId);
    if (updatedLeadObj) {
      await putRecord('leads', updatedLeadObj);
    }
  };

  // State Handler: Create Task (IndexedDB write)
  const handleAddTask = async (text: string, dueDate: string, assignedTo: string) => {
    const newTask: Task = {
      id: `task-${tasks.length + 1}`,
      text,
      dueDate,
      assignedTo,
      completed: false
    };

    setTasks(prev => [...prev, newTask]);

    // Save to database
    await putRecord('tasks', newTask);
  };

  // State Handler: Check / Toggle Task (IndexedDB write)
  const handleToggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    setTasks(updatedTasks);

    // Save to database
    const updatedTaskObj = updatedTasks.find(t => t.id === taskId);
    if (updatedTaskObj) {
      await putRecord('tasks', updatedTaskObj);
    }
  };

  // State Handler: Append History Log (IndexedDB write)
  const handleAddHistory = async (type: string, customer: string, detail: string, agent: string) => {
    const newHist: HistoryLog = {
      id: `hist-${history.length + 1}`,
      type,
      customer,
      detail,
      date: getFormattedDate(),
      agent
    };

    setHistory(prev => [newHist, ...prev]);

    // Save to database
    await putRecord('history', newHist);
  };

  // Load active customer instance (Muskan Kanani cust-101 by default)
  const activeCustomer = customers.find(c => c.id === 'cust-101') || customers[0];

  // Loader View with shimmering skeletons while initializing database
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Initializing AtlasVisa database stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header navbar with dynamic links */}
      <Navbar
        currentUser={currentUser}
        onLogout={() => setConfirmLogoutOpen(true)}
        currentView={view}
        setView={setView}
      />

      {/* Screen Routing */}
      <main className="flex-grow flex flex-col">
        {view === VIEWS.HOME && (
          <Home
            setView={setView}
            setRole={(role) => handleLoginSuccess({ id: role === ROLES.ADMIN ? 'admin-ex' : 'cust-101', role: role as 'customer' | 'admin', name: role === ROLES.ADMIN ? 'Alex Rivera' : 'Muskan Kanani', email: role === ROLES.ADMIN ? 'admin@atlasvisa.com' : 'muskan@example.com' })}
          />
        )}

        {view === VIEWS.SERVICES && (
          <Services
            setView={setView}
            setRole={(role) => handleLoginSuccess({ id: role === ROLES.ADMIN ? 'admin-ex' : 'cust-101', role: role as 'customer' | 'admin', name: role === ROLES.ADMIN ? 'Alex Rivera' : 'Muskan Kanani', email: role === ROLES.ADMIN ? 'admin@atlasvisa.com' : 'muskan@example.com' })}
            setSelectedVisaType={setSelectedVisaType}
            selectedVisaType={selectedVisaType}
          />
        )}

        {view === VIEWS.LOGIN && (
          <Login
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {view === VIEWS.CUSTOMER_DASHBOARD && activeCustomer && (
          <CustomerDashboard
            customer={activeCustomer}
            onUploadDocument={handleUploadDocument}
            onDeleteDocument={handleDeleteDocument}
            selectedVisaType={selectedVisaType}
            showToast={showToast}
          />
        )}

        {view === VIEWS.ADMIN_DASHBOARD && (
          <AdminDashboard
            customers={customers}
            leads={leads}
            tasks={tasks}
            history={history}
            executives={initialExecutives}
            onApproveDocument={handleApproveDocument}
            onRejectDocument={handleRejectDocument}
            onAddComment={handleAddComment}
            onMoveLead={handleMoveLead}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onAddHistory={handleAddHistory}
            showToast={showToast}
          />
        )}
      </main>

      {/* Footer component */}
      <Footer currentUser={currentUser} setView={setView} setSelectedVisaType={setSelectedVisaType} />

      {/* Global Toast notifications layer */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Sign Out confirmation dialog */}
      <ConfirmModal
        isOpen={confirmLogoutOpen}
        title="Sign Out Session"
        message="Are you sure you want to end your active workspace session?"
        confirmText="Sign Out"
        cancelText="Cancel"
        type="info"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogoutOpen(false)}
      />

    </div>
  );
}

export default App;
