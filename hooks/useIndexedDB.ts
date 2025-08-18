
import { useState, useEffect, useCallback } from 'react';
import { FareRecord } from '../types';

const DB_NAME = 'FareCalculatorDB_v2';
const STORE_NAME = 'fares';
const DB_VERSION = 1;

export const useIndexedDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [history, setHistory] = useState<FareRecord[]>([]);

  useEffect(() => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("Error opening IndexedDB:", request.error);
    };

    request.onsuccess = () => {
      setDb(request.result);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  }, []);

  const loadHistory = useCallback(() => {
    if (!db) return;
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
        const sortedHistory = request.result.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
        setHistory(sortedHistory as FareRecord[]);
    };
    request.onerror = () => {
        console.error("Error loading history:", request.error);
    };
  }, [db]);

  useEffect(() => {
    if (db) {
      loadHistory();
    }
  }, [db, loadHistory]);

  const saveFare = useCallback(async (fareData: FareRecord) => {
    if (!db) return;
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(fareData);
    
    return new Promise<void>((resolve, reject) => {
        request.onsuccess = () => {
            loadHistory();
            resolve();
        };
        request.onerror = () => {
            console.error("Error saving fare:", request.error);
            reject(request.error);
        };
    });
  }, [db, loadHistory]);

  const clearHistory = useCallback(async () => {
    if (!db) return;
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    return new Promise<void>((resolve, reject) => {
        request.onsuccess = () => {
            setHistory([]);
            resolve();
        };
        request.onerror = () => {
            console.error("Error clearing history:", request.error);
            reject(request.error);
        };
    });
  }, [db]);

  return { history, saveFare, clearHistory };
};
