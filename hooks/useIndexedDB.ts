
import { useState, useEffect, useCallback } from 'react';
import { FareRecord, ContractRecord } from '../types';

const DB_NAME = 'FareCalculatorDB_v2';
const FARE_STORE_NAME = 'fares';
const CONTRACT_STORE_NAME = 'contracts';
const DB_VERSION = 2; // Bumped version to add new object store

export const useIndexedDB = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [history, setHistory] = useState<FareRecord[]>([]);
  const [contractHistory, setContractHistory] = useState<ContractRecord[]>([]);

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
      if (!dbInstance.objectStoreNames.contains(FARE_STORE_NAME)) {
        dbInstance.createObjectStore(FARE_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!dbInstance.objectStoreNames.contains(CONTRACT_STORE_NAME)) {
        dbInstance.createObjectStore(CONTRACT_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  }, []);

  const loadHistory = useCallback(() => {
    if (!db) return;
    const transaction = db.transaction(FARE_STORE_NAME, 'readonly');
    const store = transaction.objectStore(FARE_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
        const sortedHistory = request.result.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
        setHistory(sortedHistory as FareRecord[]);
    };
    request.onerror = () => {
        console.error("Error loading history:", request.error);
    };
  }, [db]);

  const loadContracts = useCallback(() => {
    if (!db) return;
    const transaction = db.transaction(CONTRACT_STORE_NAME, 'readonly');
    const store = transaction.objectStore(CONTRACT_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
        const sortedContracts = request.result.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
        setContractHistory(sortedContracts as ContractRecord[]);
    };
    request.onerror = () => {
        console.error("Error loading contracts:", request.error);
    };
  }, [db]);

  useEffect(() => {
    if (db) {
      loadHistory();
      loadContracts();
    }
  }, [db, loadHistory, loadContracts]);

  const saveFare = useCallback(async (fareData: FareRecord) => {
    if (!db) return;
    const transaction = db.transaction(FARE_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(FARE_STORE_NAME);
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

  const saveContract = useCallback(async (contractData: ContractRecord): Promise<ContractRecord> => {
    if (!db) {
      return Promise.reject(new Error("Database not available."));
    }
    const transaction = db.transaction(CONTRACT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CONTRACT_STORE_NAME);
    const request = store.add(contractData);
    
    return new Promise<ContractRecord>((resolve, reject) => {
        request.onsuccess = () => {
            const savedRecord: ContractRecord = { ...contractData, id: request.result as number };
            loadContracts();
            resolve(savedRecord);
        };
        request.onerror = () => {
            console.error("Error saving contract:", request.error);
            reject(request.error);
        };
    });
  }, [db, loadContracts]);

  const clearHistory = useCallback(async () => {
    if (!db) return;
    const transaction = db.transaction(FARE_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(FARE_STORE_NAME);
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

  const clearContracts = useCallback(async () => {
    if (!db) return;
    const transaction = db.transaction(CONTRACT_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CONTRACT_STORE_NAME);
    const request = store.clear();

    return new Promise<void>((resolve, reject) => {
        request.onsuccess = () => {
            setContractHistory([]);
            resolve();
        };
        request.onerror = () => {
            console.error("Error clearing contracts:", request.error);
            reject(request.error);
        };
    });
  }, [db]);

  return { history, saveFare, clearHistory, contractHistory, saveContract, clearContracts };
};
