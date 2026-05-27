'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastCount = 0;
type ToastSubscriber = (toast: Toast) => void;
const subscribers: ToastSubscriber[] = [];

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
};

function addToast(message: string, type: ToastType) {
  const id = `toast-${toastCount++}`;
  const newToast: Toast = { id, message, type };
  subscribers.forEach(sub => sub(newToast));
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const subscriber = (toast: Toast) => {
      setToasts(prev => [...prev, toast]);
      // Auto dismiss after 3 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
    };
    
    subscribers.push(subscriber);
    return () => {
      const index = subscribers.indexOf(subscriber);
      if (index > -1) subscribers.splice(index, 1);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className="pointer-events-auto bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-3 min-w-[280px] max-w-[350px] animate-in slide-in-from-right-8 fade-in duration-300"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" />}
          {toast.type === 'error' && <XCircle className="w-5 h-5 text-[#dc2626] shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#2563eb] shrink-0" />}
          
          <span className="text-[13px] font-bold text-[#1a1a1a] flex-1">{toast.message}</span>
          
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
