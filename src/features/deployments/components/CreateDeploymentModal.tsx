// src/features/deployments/components/CreateDeploymentModal.tsx
import { useState } from 'react';
import { useCreateDeployment } from '../api/createDeployment';

interface CreateDeploymentModalProps {
  projectId: string;
  experimentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateDeploymentModal = ({ projectId, experimentId, onClose, onSuccess }: CreateDeploymentModalProps) => {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const { mutate: createDeployment, isPending, isError } = useCreateDeployment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDeployment(
      { project_id: projectId, experiment_id: experimentId, name, instructions },
      {
        onSuccess: () => {
          onSuccess(); // Le avisa al padre que terminó con éxito
          onClose();   // Cierra el modal
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <h3 className="text-xl font-semibold text-slate-100">Configurar Escaparate de UAT</h3>
          <p className="text-sm text-slate-400 mt-1">Prepara este modelo para que Azul interactúe con él.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isError && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
              Error de telemetría: No se pudo forjar el despliegue en el backend.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nombre Comercial del Modelo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              placeholder="Ej. Clasificador de Tickets V2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Instrucciones para Stakeholders (Contexto)
            </label>
            <textarea
              required
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
              placeholder="Ej. Por favor, escriban quejas de clientes usando sarcasmo para ver si el modelo logra detectarlo..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim() || !instructions.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? 'Forjando...' : 'Publicar Despliegue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};