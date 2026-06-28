import {
  initialCustomers,
  initialLeads,
  initialTasks,
  initialHistory
} from './mockData';
import { Customer, Lead, Task, HistoryLog, User } from './types';

let useFallback = false;

// Fallback LocalStorage Database Engines
const lsSeedData: Record<string, any> = {
  customers: initialCustomers,
  leads: initialLeads,
  tasks: initialTasks,
  history: initialHistory,
  session: null
};

function getLsStore(storeName: string): any {
  const key = `atlas_${storeName}`;
  const data = localStorage.getItem(key);
  if (!data) {
    // Seed on demand
    const seed = lsSeedData[storeName];
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
}

function putLsStore(storeName: string, record: any): void {
  const key = `atlas_${storeName}`;
  const store = getLsStore(storeName);
  
  if (storeName === 'session') {
    localStorage.setItem(key, JSON.stringify(record));
    return;
  }

  // Update array matching by ID
  let updatedStore: any = [];
  if (Array.isArray(store)) {
    const idx = store.findIndex(item => item.id === record.id);
    if (idx !== -1) {
      updatedStore = [...store];
      updatedStore[idx] = record;
    } else {
      updatedStore = [...store, record];
    }
  } else {
    updatedStore = record;
  }
  localStorage.setItem(key, JSON.stringify(updatedStore));
}

// Initialize Database connection (IndexedDB with LocalStorage Fallback)
export function initDB(): Promise<IDBDatabase | void> {
  return new Promise((resolve) => {
    try {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported. Falling back to LocalStorage...');
        useFallback = true;
        resolve();
        return;
      }

      const request = indexedDB.open('AtlasVisaDB', 1);

      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('customers')) {
          db.createObjectStore('customers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('leads')) {
          db.createObjectStore('leads', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('session')) {
          db.createObjectStore('session', { keyPath: 'key' });
        }
      };

      request.onsuccess = (e: any) => {
        const db = e.target.result;
        
        // Seed check transaction
        const transaction = db.transaction(['customers', 'leads', 'tasks', 'history'], 'readwrite');
        const customerStore = transaction.objectStore('customers');
        const countRequest = customerStore.count();

        countRequest.onsuccess = () => {
          if (countRequest.result === 0) {
            console.log('IndexedDB empty. Seeding starting...');
            initialCustomers.forEach((cust: any) => customerStore.put(cust));
            
            const leadsStore = transaction.objectStore('leads');
            initialLeads.forEach((lead: any) => leadsStore.put(lead));

            const tasksStore = transaction.objectStore('tasks');
            initialTasks.forEach((task: any) => tasksStore.put(task));

            const historyStore = transaction.objectStore('history');
            initialHistory.forEach((hist: any) => historyStore.put(hist));
          }
        };

        transaction.oncomplete = () => {
          console.log('IndexedDB setup complete.');
          resolve(db);
        };

        transaction.onerror = () => {
          console.warn('IndexedDB transaction failed. Fallback to LocalStorage.');
          useFallback = true;
          resolve();
        };
      };

      request.onerror = () => {
        console.warn('IndexedDB block flagged. Fallback to LocalStorage.');
        useFallback = true;
        resolve();
      };

    } catch (err) {
      console.warn('Error starting IndexedDB. Fallback to LocalStorage:', err);
      useFallback = true;
      resolve();
    }
  });
}

// Read records
export function getAllRecords<T>(storeName: string): Promise<T[]> {
  if (useFallback) {
    return Promise.resolve((getLsStore(storeName) || []) as T[]);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AtlasVisaDB', 1);

    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const getRequest = store.getAll();

      getRequest.onsuccess = () => resolve(getRequest.result as T[]);
      getRequest.onerror = () => reject(getRequest.error);
    };

    request.onerror = (e: any) => reject(e.target.error);
  });
}

// Save or Update record
export function putRecord(storeName: string, data: any): Promise<any> {
  if (useFallback) {
    putLsStore(storeName, data);
    return Promise.resolve(data);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AtlasVisaDB', 1);

    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const putRequest = store.put(data);

      putRequest.onsuccess = () => resolve(putRequest.result);
      putRequest.onerror = () => reject(putRequest.error);
    };

    request.onerror = (e: any) => reject(e.target.error);
  });
}

// Session: Retrieve current user
export function getSessionUser(): Promise<User | null> {
  if (useFallback) {
    const sess = localStorage.getItem('atlas_session');
    return Promise.resolve(sess ? JSON.parse(sess) as User : null);
  }

  return new Promise((resolve) => {
    const request = indexedDB.open('AtlasVisaDB', 1);

    request.onsuccess = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('session')) {
        resolve(null);
        return;
      }
      const tx = db.transaction('session', 'readonly');
      const store = tx.objectStore('session');
      const getRequest = store.get('currentUser');

      getRequest.onsuccess = () => {
        resolve(getRequest.result ? (getRequest.result.value as User) : null);
      };
      getRequest.onerror = () => resolve(null);
    };

    request.onerror = () => resolve(null);
  });
}

// Session: Save user
export function setSessionUser(user: User): Promise<any> {
  if (useFallback) {
    localStorage.setItem('atlas_session', JSON.stringify(user));
    return Promise.resolve(user);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AtlasVisaDB', 1);

    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction('session', 'readwrite');
      const store = tx.objectStore('session');
      const putRequest = store.put({ key: 'currentUser', value: user });

      putRequest.onsuccess = () => resolve(putRequest.result);
      putRequest.onerror = () => reject(putRequest.error);
    };

    request.onerror = (e: any) => reject(e.target.error);
  });
}

// Session: Delete User
export function clearSession(): Promise<void> {
  if (useFallback) {
    localStorage.removeItem('atlas_session');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AtlasVisaDB', 1);

    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction('session', 'readwrite');
      const store = tx.objectStore('session');
      const deleteRequest = store.delete('currentUser');

      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };

    request.onerror = (e: any) => reject(e.target.error);
  });
}
