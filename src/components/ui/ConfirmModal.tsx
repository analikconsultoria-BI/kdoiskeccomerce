"use client";

import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-100',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-100',
    info: 'bg-brand-700 hover:bg-brand-800 shadow-brand-100'
  };

  const iconStyles = {
    danger: 'bg-red-50 text-red-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-brand-50 text-brand-700'
  };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-warm-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onCancel}></div>
      
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden relative z-10 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-warm-50 flex justify-between items-center bg-warm-50/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${iconStyles[type]}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-warm-900 uppercase tracking-tight">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-warm-400 hover:text-warm-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <p className="text-warm-500 font-medium leading-relaxed">{message}</p>
        </div>

        <div className="p-6 bg-warm-50 flex gap-3">
          <button 
            onClick={onCancel} 
            className="flex-1 py-3 text-sm font-bold text-warm-500 hover:text-warm-700 transition-colors bg-white border border-warm-200 rounded-xl"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onCancel();
            }} 
            className={`flex-1 text-white py-3 rounded-xl font-bold uppercase tracking-wide text-xs shadow-lg transition-all active:scale-95 ${typeStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
