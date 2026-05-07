// src/features/experiments/components/ForkExperimentModal.tsx
import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { useForkExperiment } from '../api/forkExperiment';
import type { ExperimentForkType } from '../types';

interface ForkExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  experimentId: string;
  experimentName: string;
}

export const ForkExperimentModal = ({ isOpen, onClose, projectId, experimentId, experimentName }: ForkExperimentModalProps) => {
  const [forkType, setForkType] = useState<ExperimentForkType>('fine_tuning');
  const [evolutionNotes, setEvolutionNotes] = useState('');

  const { mutate: forkExperiment, isPending, isError } = useForkExperiment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forkExperiment(
      {
        projectId,
        data: {
          parent_id: experimentId,
          fork_type: forkType,
          evolution_notes: evolutionNotes,
        }
      },
      {
        onSuccess: () => {
          setEvolutionNotes(''); // Limpiamos la bitácora
          onClose(); // Cerramos las compuertas
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bifurcar Modelo (Fork)">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Identificador del Ancestro */}
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Ancestro (Padre)</p>
          <p className="text-sm font-medium text-slate-200">{experimentName}</p>
        </div>

        {isError && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
            Error de telemetría: No se pudo forjar el nuevo modelo en el backend.
          </div>
        )}

        {/* Tipo de Bifurcación */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">Naturaleza de la Evolución</label>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForkType('fine_tuning')}
              className={`p-3 rounded-lg border text-left transition-all ${
                forkType === 'fine_tuning' 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <i className="fa-solid fa-brain mb-2 block text-lg"></i>
              <span className="block text-sm font-bold">Ajuste Fino</span>
              <span className="text-[10px] opacity-80 mt-1 block leading-tight">Continúa entrenando sobre los pesos del padre.</span>
            </button>

            <button
              type="button"
              onClick={() => setForkType('re_training')}
              className={`p-3 rounded-lg border text-left transition-all ${
                forkType === 're_training' 
                  ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <i className="fa-solid fa-rotate-left mb-2 block text-lg"></i>
              <span className="block text-sm font-bold">Re-Entrenamiento</span>
              <span className="text-[10px] opacity-80 mt-1 block leading-tight">Reinicia desde el modelo base (borrón y cuenta nueva).</span>
            </button>
          </div>
        </div>

        {/* Notas de Evolución */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Notas de Evolución (Bitácora)
          </label>
          <textarea
            required
            rows={3}
            value={evolutionNotes}
            onChange={(e) => setEvolutionNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none text-sm"
            placeholder="Ej. Se requiere ajuste fino porque el modelo falla detectando sarcasmo en tickets de quejas..."
          />
        </div>

        {/* Controles de Acción */}
        <div className="pt-4 border-t border-slate-700 flex justify-end gap-3">
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
            disabled={isPending || !evolutionNotes.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? 'Forjando...' : 'Iniciar Bifurcación'}
          </button>
        </div>
      </form>
    </Modal>
  );
};