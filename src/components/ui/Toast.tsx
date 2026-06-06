// src/components/ui/Toast.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback((msg: string, dur?: number) => toast(msg, 'success', dur), [toast]);
  const error = useCallback((msg: string, dur?: number) => toast(msg, 'error', dur), [toast]);
  const warning = useCallback((msg: string, dur?: number) => toast(msg, 'warning', dur), [toast]);
  const info = useCallback((msg: string, dur?: number) => toast(msg, 'info', dur), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      
      {/* Toast Render stack Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 p-4 rounded-md shadow-2xl border bg-iron-mid text-smoke pointer-events-auto animate-slideIn"
            style={{
              borderColor:
                t.type === 'success'
                  ? '#16A34A'
                  : t.type === 'error'
                  ? '#DC2626'
                  : t.type === 'warning'
                  ? '#D97706'
                  : '#6B7280',
            }}
          >
            {/* Status Icons */}
            {t.type === 'success' && <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
            {t.type === 'error' && <AlertCircle size={20} className="text-red-500 flex-shrink-0" />}
            {t.type === 'warning' && <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />}
            {t.type === 'info' && <Info size={20} className="text-blue-400 flex-shrink-0" />}

            <span className="text-xs font-medium tracking-wide flex-1">
              {t.message}
            </span>

            <button
              onClick={() => removeToast(t.id)}
              className="text-steel-light hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
