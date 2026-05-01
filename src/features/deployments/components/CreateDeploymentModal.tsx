import { useState } from 'react';
import { useCreateDeployment } from '../api/createDeployment';
import type { HardwareTarget } from '../types';

interface CreateDeploymentModalProps {
  projectId: string;
  experimentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateDeploymentModal = ({ projectId, experimentId, onClose, onSuccess }: CreateDeploymentModalProps) => {
  // 1. Metadatos Públicos
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // 2. Configuración del Motor
  const [hardwareTarget, setHardwareTarget] = useState<HardwareTarget>('shared_cpu');
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.65);
  const [storePrompts, setStorePrompts] = useState<boolean>(true);

  const { mutate: createDeployment, isPending, isError } = useCreateDeployment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDeployment(
      { 
        project_id: projectId, 
        experiment_id: experimentId, 
        name, 
        instructions,
        hardware_target: hardwareTarget,
        confidence_threshold: confidenceThreshold,
        store_prompts: storePrompts
      },
      {
        onSuccess: () => {
          onSuccess(); 
          onClose();  
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex-shrink-0">
          <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <i className="fa-solid fa-rocket text-emerald-500"></i> Configurar Escaparate de UAT
          </h3>
          <p className="text-sm text-slate-400 mt-1">Define la interfaz y los recursos para la validación del stakeholder.</p>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form id="deployment-form" onSubmit={handleSubmit} className="space-y-8">
            {isError && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
                Error de telemetría: No se pudo forjar el despliegue en el backend.
              </div>
            )}

            {/* SECCIÓN 1: METADATOS PÚBLICOS */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                1. Metadatos del Escaparate
              </h4>
              
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
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                  placeholder="Ej. Por favor, escriban quejas de clientes usando sarcasmo..."
                />
              </div>
            </div>

            {/* SECCIÓN 2: CONFIGURACIÓN DEL MOTOR */}
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                2. Configuración del Motor
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hardware */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                    <i className="fa-solid fa-microchip text-slate-500"></i> Entorno de Ejecución
                  </label>
                  <select
                    value={hardwareTarget}
                    onChange={(e) => setHardwareTarget(e.target.value as HardwareTarget)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                  >
                    <option value="shared_cpu">CPU Compartida (Económico)</option>
                    <option value="nvidia_t4">NVIDIA T4 (Balanceado)</option>
                    <option value="nvidia_a100">NVIDIA A100 (Alto Rendimiento)</option>
                  </select>
                </div>

                {/* Umbral de Confianza */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1 flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <i className="fa-solid fa-sliders text-slate-500"></i> Umbral de Confianza
                    </span>
                    <span className="text-emerald-400 font-mono">{Math.round(confidenceThreshold * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="0.99"
                    step="0.01"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-3"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Mínimo requerido para no mostrar advertencia de duda.</p>
                </div>
              </div>

              {/* Data Flywheel Toggle */}
              <div className="flex items-start gap-3 p-4 bg-slate-950/50 border border-slate-800 rounded-lg">
                <div className="flex items-center h-5">
                  <input
                    id="store-prompts"
                    type="checkbox"
                    checked={storePrompts}
                    onChange={(e) => setStorePrompts(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="store-prompts" className="text-sm font-medium text-slate-300 cursor-pointer">
                    Bucle de Datos (Data Flywheel)
                  </label>
                  <p className="text-xs text-slate-500">
                    Almacenar los prompts y validaciones del stakeholder para futuros re-entrenamientos.
                  </p>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* FOOTER FIJO PARA BOTONES */}
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-800/50 flex items-center justify-end gap-3 flex-shrink-0">
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
            form="deployment-form"
            disabled={isPending || !name.trim() || !instructions.trim()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            {isPending ? 'Forjando...' : 'Publicar Despliegue'}
          </button>
        </div>

      </div>
    </div>
  );
};