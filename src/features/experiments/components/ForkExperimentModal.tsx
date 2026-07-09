// src/features/experiments/components/ForkExperimentModal.tsx
import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { useForkExperiment } from '../api/forkExperiment';
import type { ExperimentForkType } from '../types';
import { AlertCircle, Brain, RefreshCw, GitFork } from 'lucide-react'; // Importamos iconografía técnica

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
          setEvolutionNotes(''); 
          onClose(); 
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bifurcar Modelo (Fork)">
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        
        {/* Identificador del Ancestro: Tarjeta física de registro */}
        <div className="bg-[#F7F7F5] p-4 rounded-xl border border-[#EAEAE8] flex items-center gap-3 shadow-inner">
          <div className="p-2 bg-white rounded-lg border border-[#D1D1CD] text-[#5A5855] shadow-sm shrink-0">
            <GitFork size={16} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold text-[#A1A19A] uppercase tracking-widest mb-0.5">Ancestro (Modelo Padre)</p>
            <p className="text-sm font-bold text-[#111111] truncate">{experimentName}</p>
          </div>
        </div>

        {/* Alerta de Error: Neutra y controlada */}
        {isError && (
          <div className="p-4 bg-brand-surface border border-brand-accent rounded-xl flex items-center gap-3 text-[#D46077] text-sm font-medium shadow-sm animate-in shake duration-300">
            <AlertCircle size={18} strokeWidth={2.5} />
            <p>Error de telemetría: No se pudo forjar el nuevo modelo en el backend.</p>
          </div>
        )}

        {/* Tipo de Bifurcación (Segmented Control Avanzado) */}
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest ml-1">
            Naturaleza de la Evolución
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Opción A: Ajuste Fino (Verde Salvia) */}
            <button
              type="button"
              onClick={() => setForkType('fine_tuning')}
              className={`p-4 rounded-xl border text-left transition-all outline-none flex flex-col h-full ${
                forkType === 'fine_tuning' 
                  ? 'bg-role-validator/10 border-role-validator shadow-sm' 
                  : 'bg-white border-[#D1D1CD] text-[#A1A19A] hover:border-[#5A5855] hover:bg-[#F7F7F5]'
              }`}
            >
              <Brain size={18} strokeWidth={2.5} className={`mb-2.5 ${forkType === 'fine_tuning' ? 'text-role-validator' : 'text-[#A1A19A]'}`} />
              <span className={`block text-sm font-bold font-display mb-1 transition-colors ${forkType === 'fine_tuning' ? 'text-[#111111]' : 'text-[#5A5855]'}`}>
                Ajuste Fino
              </span>
              <span className="text-[11px] font-medium leading-normal block opacity-90 text-[#5A5855]">
                Continúa entrenando optimizando los pesos matemáticos del ancestro.
              </span>
            </button>

            {/* Opción B: Re-Entrenamiento (Azul Pizarra) */}
            <button
              type="button"
              onClick={() => setForkType('re_training')}
              className={`p-4 rounded-xl border text-left transition-all outline-none flex flex-col h-full ${
                forkType === 're_training' 
                  ? 'bg-role-engineer/10 border-role-engineer shadow-sm' 
                  : 'bg-white border-[#D1D1CD] text-[#A1A19A] hover:border-[#5A5855] hover:bg-[#F7F7F5]'
              }`}
            >
              <RefreshCw size={18} strokeWidth={2.5} className={`mb-2.5 ${forkType === 're_training' ? 'text-role-engineer' : 'text-[#A1A19A]'}`} />
              <span className={`block text-sm font-bold font-display mb-1 transition-colors ${forkType === 're_training' ? 'text-[#111111]' : 'text-[#5A5855]'}`}>
                Re-Entrenamiento
              </span>
              <span className="text-[11px] font-medium leading-normal block opacity-90 text-[#5A5855]">
                Reinicia los pesos desde la arquitectura base (borrón y cuenta nueva).
              </span>
            </button>

          </div>
        </div>

        {/* Notas de Evolución: Caja de texto impresa */}
        <div>
          <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1">
            Notas de Evolución (Bitácora Obligatoria)
          </label>
          <textarea
            required
            rows={3}
            value={evolutionNotes}
            onChange={(e) => setEvolutionNotes(e.target.value)}
            className="w-full bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner focus:shadow-sm resize-none text-sm leading-relaxed"
            placeholder="Ej: Se requiere ajuste fino porque el modelo base presenta falsos positivos en el set de datos del municipio..."
          />
        </div>

        {/* Controles de Acción Coherentes */}
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
            disabled={isPending || !evolutionNotes.trim()}
            className="px-5 py-2.5 flex items-center gap-2 font-bold text-white bg-brand-primary hover:bg-[#D46077] disabled:bg-[#F7F7F5] disabled:text-[#A1A19A] disabled:border disabled:border-[#D1D1CD] border border-transparent rounded-xl transition-all active:scale-95 shadow-sm"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Forjando...
              </>
            ) : (
              <>
                <GitFork size={16} strokeWidth={2.5} />
                Iniciar Bifurcación
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};