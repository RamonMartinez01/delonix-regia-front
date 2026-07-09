// src/components/ui/Modal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; // Nueva API para modularidad
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  if (!isOpen) return null;

  // Diccionario de calibres para el ancho
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#111111]/40 animate-in fade-in duration-200">
      
      {/* 1. Inyectamos el ancho dinámico (maxWidthClass).
        2. flex flex-col y max-h-[90vh] evitan que choque con los bordes de la pantalla.
      */}
      <div className={`bg-white border border-[#EAEAE8] w-full mt-8 ${maxWidthClass} rounded-2xl shadow-xl overflow-hidden relative flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200`}>
        
        {/* Header: shrink-0 garantiza que la cabecera jamás colapse ni se desplace */}
        <div className="flex justify-between items-center p-6 border-b border-[#EAEAE8] shrink-0 bg-white z-20">
          <h2 className="text-lg font-bold font-display text-[#111111] tracking-tight flex items-center gap-2">
            <div className="w-1 h-4 bg-brand-primary rounded-full" /> 
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#A1A19A] hover:text-[#111111] hover:bg-[#F7F7F5] rounded-xl transition-all active:scale-95"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body: overflow-y-auto asume el control del desplazamiento interno */}
        <div className="p-6 relative z-10 text-[#5A5855] text-sm overflow-y-auto custom-scrollbar">
          {children}
        </div>

      </div>
    </div>
  );
};