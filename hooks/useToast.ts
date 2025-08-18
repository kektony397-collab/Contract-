
import { useState, useCallback, useRef } from 'react';
import { ToastState, ToastType } from '../types';

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', visible: false });
  const timeoutRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast({ message, type, visible: true });

    timeoutRef.current = window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  return { toast, showToast };
};
