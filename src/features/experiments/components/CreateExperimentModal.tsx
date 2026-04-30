// src/features/experiments/components/CreateExperimentModal.tsx
import { useEffect, useState } from 'react';
import { useCreateExperiment } from '../api/createExperiment';
import { useHubModels } from '../api/getModelsHub';

interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const CreateExperimentModal = ({ isOpen, onClose, projectId }: CreateExperimentModalProps) => {
  // Estados locales del formulario
  const [name, setName] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [epochs, setEpochs] = useState(10);

  // Cargamos el misil en el tubo lanzador
  const { data: models, isLoading: isLoadingModels } = useHubModels();
  const { mutateAsync: createExperiment, isPending } = useCreateExperiment(projectId);

  // AUTO-SELECCIÓN: Cuando los modelos carguen, seleccionamos el primero por defecto
  useEffect(() => {
    if (models && models.length > 0 && !selectedModelId) {
      setSelectedModelId(models[0].id);
    }
  }, [models, selectedModelId]);

  // Buscamos el objeto completo del modelo seleccionado para saber si lo soportamos
  const selectedModel = models?.find(m => m.id === selectedModelId);
  const isSupported = selectedModel?.is_supported ?? false;

  // La secuencia de ignición
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupported) return; // Doble candado de seguridad

    try {
      await createExperiment({
        name: name || 'Experimento sin nombre',
        model_source_uri: `hf://${selectedModelId}`, // Formateamos el URI para el backend
        hyperparameters: {
          epochs: epochs,
          batch_size: 32, // Fijo por ahora, para simular realismo
          learning_rate: 0.0001
        }
      });
      
      // Limpiamos y cerramos al terminar
      setName('');
      setEpochs(10);
      onClose();
    } catch (error) {
      console.error("Fallo en la secuencia de lanzamiento:", error);
      // Aquí en el futuro podríamos poner un Toast de error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-100">Nuevo Entrenamiento</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nombre del Experimento
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Prueba Alfa - NLP"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Modelo Base (Arquitectura)
            </label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              disabled={isLoadingModels}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors appearance-none disabled:opacity-50"
            >
              {isLoadingModels ? (
                <option>Sincronizando con el Hub...</option>
              ) : (
                models?.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.task_type.replace('_', ' ').toUpperCase()})
                  </option>
                ))
              )}
            </select>
            
            {/* Descripción dinámica del modelo seleccionado */}
            {selectedModel && (
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {selectedModel.description}
              </p>
            )}
          </div>

          {/* 👇 LA MAGIA DE LA DEGRADACIÓN ELEGANTE 👇 */}
          {selectedModel && !isSupported && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <span className="text-amber-500 text-lg leading-none">⚠️</span>
                <div>
                  <h4 className="text-sm font-bold text-amber-500 mb-1">Arquitectura en el Astillero</h4>
                  <p className="text-xs text-amber-400/80 leading-relaxed">
                    El soporte para modelos de <strong className="text-amber-400 uppercase">{selectedModel.task_type.replace('_', ' ')}</strong> está actualmente en desarrollo. Nuestro motor MVP está optimizado exclusivamente para Clasificación de Textos.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Iteraciones (Epochs)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !isSupported || isLoadingModels}
              className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                !isSupported 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
              }`}
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Iniciando...
                </>
              ) : (
                'Iniciar Entrenamiento'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};