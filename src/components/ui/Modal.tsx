// src/components/ui/Modal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; // Aquí es donde vive la magia del reciclaje
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

 return (
    // Backdrop: Aumentamos el desenfoque para aislar la zona de trabajo
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Contenedor del Modal: Estética de Cristal Oscuro */}
      <div className="bg-slate-900/90 border border-slate-700/50 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative backdrop-blur-xl animate-in zoom-in-95 duration-300">
        
        {/* Glow sutil de fondo para dar profundidad */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header: Más espaciado y tipografía refinada */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800/60 relative z-10">
          <h2 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-4 bg-emerald-500 rounded-full" /> {/* Acento visual */}
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: Espaciado optimizado para el contenido inyectado */}
        <div className="p-6 relative z-10">
          {children}
        </div>

      </div>
    </div>
  );
};