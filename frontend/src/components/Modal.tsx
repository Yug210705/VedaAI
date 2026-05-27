'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  hideHeader?: boolean;
  noPadding?: boolean;
}

export default function Modal({ isOpen, onClose, title = '', children, maxWidth = 'max-w-md', hideHeader = false, noPadding = false }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Dialog */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={clsx(
              "relative w-full bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
              maxWidth
            )}
          >
            {/* Header */}
            {!hideHeader && (
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-[18px] font-extrabold text-[#1a1a1a] tracking-tight">{title}</h2>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            )}
            
            {/* Body */}
            <div className={clsx("overflow-y-auto hide-scrollbar", !noPadding && "p-6")}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
