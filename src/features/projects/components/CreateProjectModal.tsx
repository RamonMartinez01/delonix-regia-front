// src/features/projects/components/CreateProjectModal.tsx
import { useState } from 'react';
import { useCreateProject } from '../api/createProject';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  // Estado local para los campos del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Nuestro misil asíncrono preparado para disparar
  const { mutate, isPending, isError } = useCreateProject();

  // Si el interruptor está apagado, no renderizamos absolutamente nada
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Disparamos la mutación hacia FastAPI
    mutate(
      { name, description },
      {
        onSuccess: () => {
          // ¡Éxito! Limpiamos los campos para la próxima vez y cerramos la ventana
          setName('');
          setDescription('');
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-emerald-400">Nuevo Proyecto</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            disabled={isPending}
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          
          {isError && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              Hubo un error al crear el proyecto. Verifica que el nombre no esté duplicado.
            </div>
          )}

          <div className="mb-4">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="name">
              Nombre del Proyecto *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              placeholder="Ej. Modelo de Predicción v1"
              required
              disabled={isPending}
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="description">
              Descripción (Opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors resize-none h-24"
              placeholder="Propósito u objetivo de este modelo..."
              disabled={isPending}
            />
          </div>

          {/* Pie del Modal (Botones) */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isPending ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};