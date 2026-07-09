// src/features/experiments/components/CreateExperimentModal.tsx
import { useEffect, useState } from 'react';
import { useCreateExperiment } from '../api/createExperiment';
import { useHubModels } from '../api/getModelsHub';
import { Modal } from '../../../components/ui/Modal'; // Importamos el cascarón oficial
import { Construction, Play, Cpu } from 'lucide-react'; // Iconografía táctil

interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const CreateExperimentModal = ({ isOpen, onClose, projectId }: CreateExperimentModalProps) => {
  const [name, setName] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [epochs, setEpochs] = useState(10);

  const { data: models, isLoading: isLoadingModels } = useHubModels();
  const { mutateAsync: createExperiment, isPending } = useCreateExperiment(projectId);

  useEffect(() => {
    if (models && models.length > 0 && !selectedModelId) {
      setSelectedModelId(models[0].id);
    }
  }, [models, selectedModelId]);

  const selectedModel = models?.find(m => m.id === selectedModelId);
  const isSupported = selectedModel?.is_supported ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupported) return;

    try {
      await createExperiment({
        name: name || 'Experimento sin nombre',
        model_source_uri: `hf://${selectedModelId}`,
        task_type: selectedModel?.task_type,
        hyperparameters: {
          epochs: epochs,
          batch_size: 32,
          learning_rate: 0.0001
        }
      });

      setName('');
      setEpochs(10);
      onClose();
    } catch (error) {
      console.error("Fallo en la secuencia de lanzamiento:", error);
    }
  };

  return (
    /* Delegamos toda la física del contenedor al Modal global */
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Entrenamiento">
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">

        {/* Input: Hendidura física */}
        <div>
          <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1">
            Nombre del Experimento
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Prueba Alfa - NLP"
            className="w-full bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner focus:shadow-sm"
          />
        </div>

        {/* Selector de Modelo */}
        <div>
          <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1">
            Modelo Base
          </label>
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            disabled={isLoadingModels}
            className="w-full bg-white border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm disabled:bg-[#F7F7F5] disabled:text-[#A1A19A] appearance-none cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoadingModels ? (
              <option>Sincronizando con el Hub...</option>
            ) : (
              models?.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Campo Inmutable: Tipo de Tarea (Metadato Técnico) */}
        <div>
          <label className="flex text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1 items-center gap-1">
            <Cpu size={12} className="text-[#A1A19A]" />
            Tipo de Tarea
          </label>
          <input
            type="text"
            readOnly
            value={selectedModel?.task_type || 'No seleccionado'}
            className="w-full bg-[#F7F7F5] border border-[#EAEAE8] text-[#5A5855] font-mono font-bold text-xs rounded-xl px-4 py-3 select-all cursor-not-allowed shadow-inner"
            title="Este valor se inyecta automáticamente en el payload de telemetría"
          />
          {selectedModel && (
            <p className="text-xs text-[#5A5855] font-medium mt-2 leading-relaxed ml-1 border-l-2 border-[#D1D1CD] pl-3">
              {selectedModel.description}
            </p>
          )}
        </div>


        {/* LA MAGIA DE LA DEGRADACIÓN ELEGANTE (Refactorizada) */}
        {selectedModel && !isSupported && (
          <div className="bg-brand-surface border border-brand-accent rounded-xl p-5 shadow-sm animate-in slide-in-from-top-2">
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-white rounded-lg border border-brand-accent shadow-sm shrink-0">
                <Construction className="text-[#D46077]" size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#D46077] mb-1 font-display">Arquitectura en el Astillero</h4>
                <p className="text-xs text-[#D46077]/80 leading-relaxed font-medium">
                  El soporte para <strong className="uppercase font-bold text-[#D46077]">{selectedModel.task_type.replace('_', ' ')}</strong> está en desarrollo. Nuestro motor actual procesa exclusivamente Clasificación de Textos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Input Numérico */}
        <div>
          <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1">
            Iteraciones (Epochs)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={epochs}
            onChange={(e) => setEpochs(Number(e.target.value))}
            className="w-full bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-bold font-mono focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner focus:shadow-sm"
          />
        </div>

        {/* Pie del Formulario */}
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
            disabled={isPending || !isSupported || isLoadingModels}
            className="px-5 py-2.5 flex items-center gap-2 font-bold text-white bg-brand-primary hover:bg-[#D46077] disabled:bg-[#F7F7F5] disabled:text-[#A1A19A] disabled:border disabled:border-[#D1D1CD] border border-transparent rounded-xl transition-all active:scale-95 shadow-sm"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Iniciando...
              </>
            ) : (
              <>
                <Play size={16} strokeWidth={2.5} />
                Iniciar Entrenamiento
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
};