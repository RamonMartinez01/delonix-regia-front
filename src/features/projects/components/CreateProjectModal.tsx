// src/features/projects/components/CreateProjectModal.tsx
import { useState } from 'react';
import { useCreateProject } from '../api/createProject';
import { Modal } from '../../../components/ui/Modal'; // Importamos el cascarón oficial
import { AlertCircle, Plus } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const { mutate, isPending, isError } = useCreateProject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    mutate(
      { name, description },
      {
        onSuccess: () => {
          setName('');
          setDescription('');
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Proyecto">
      
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        
        {/* Alerta de Error: Neutra y clara, alineada con el resto del sistema */}
        {isError && (
          <div className="p-4 bg-brand-surface border border-brand-accent rounded-xl flex items-center gap-3 text-[#D46077] text-sm font-medium shadow-sm animate-in shake duration-300">
            <AlertCircle size={18} strokeWidth={2.5} />
            <p>Hubo un error al crear el proyecto. Verifica que el nombre no esté duplicado.</p>
          </div>
        )}

        {/* Input: Hendidura física */}
        <div>
          <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1" htmlFor="name">
            Nombre del Proyecto *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner focus:shadow-sm"
            placeholder="Ej. Modelo de Predicción v1"
            required
            disabled={isPending}
            autoFocus
          />
        </div>

        {/* Textarea: Misma física que el input */}
        <div>
          <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1" htmlFor="description">
            Descripción (Opcional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner focus:shadow-sm resize-none h-24 custom-scrollbar"
            placeholder="Propósito u objetivo de este modelo..."
            disabled={isPending}
          />
        </div>

        {/* Pie del Formulario (Controles de Acción) */}
        <div className="flex justify-end gap-3 pt-5 border-t border-[#EAEAE8] mt-8">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 font-bold text-[#111111] bg-white border border-[#D1D1CD] hover:bg-[#F7F7F5] rounded-xl transition-all active:scale-95 shadow-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="px-5 py-2.5 flex items-center gap-2 font-bold text-white bg-brand-primary hover:bg-[#D46077] disabled:bg-[#F7F7F5] disabled:text-[#A1A19A] disabled:border disabled:border-[#D1D1CD] border border-transparent rounded-xl transition-all active:scale-95 shadow-sm"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Plus size={16} strokeWidth={2.5} />
                Crear Proyecto
              </>
            )}
          </button>
        </div>
      </form>

    </Modal>
  );
};