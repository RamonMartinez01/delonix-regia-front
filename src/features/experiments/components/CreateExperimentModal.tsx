// src/features/experiments/components/CreateExperimentModal.tsx
import { useState } from 'react';
import { useCreateExperiment } from '../api/createExperiment';

interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const CreateExperimentModal = ({ isOpen, onClose, projectId }: CreateExperimentModalProps) => {
  // 1. Estados locales del formulario
  const [name, setName] = useState('');
  const [modelUri, setModelUri] = useState('hf://distilbert-base-uncased');
  const [epochs, setEpochs] = useState(10);

  // 2. Cargamos el misil en el tubo lanzador
  const { mutateAsync: createExperiment, isPending } = useCreateExperiment(projectId);

  // 3. La secuencia de ignición
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExperiment({
        name: name || 'Experimento sin nombre',
        model_source_uri: modelUri,
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

  // 4. La Interfaz Gráfica (UI)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <h3 className="text-lg font-bold text-slate-100">Nuevo Entrenamiento</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors text-xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Campo: Nombre */}
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

          {/* Campo: Modelo Base (Select) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Modelo Base (Arquitectura)
            </label>
            <select
              value={modelUri}
              onChange={(e) => setModelUri(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
            >
              <option value="hf://distilbert-base-uncased">DistilBERT (Clasificación de Texto)</option>
              <option value="hf://meta-llama/Llama-2-7b">Llama 2 7B (Generación de Texto)</option>
              <option value="s3://delonix-corp/vision-v1">Vision Transformer (Imágenes)</option>
            </select>
          </div>

          {/* Campo: Hiperparámetros (Epochs) */}
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
            <p className="text-xs text-slate-500 mt-1">
              A mayor número, más tiempo tomará el entrenamiento simulado.
            </p>
          </div>

          {/* Botonera de Acción */}
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
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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