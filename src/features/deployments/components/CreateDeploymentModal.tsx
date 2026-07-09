// src/features/deployments/components/CreateDeploymentModal.tsx
import { useState } from 'react';
import { useCreateDeployment } from '../api/createDeployment';
import { Modal } from '../../../components/ui/Modal';
import { AlertCircle, Rocket, Cpu, Sliders, Database } from 'lucide-react';
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
    /* Utilizamos nuestro cascarón global purificado. 
       Como el padre (ProjectDetail) condiciona su renderizado, le pasamos isOpen={true} directamente */
    <Modal isOpen={true} onClose={onClose} title="Configurar Escaparate de UAT" size="2xl">
      
      <p className="text-sm text-[#5A5855] mb-6 font-medium border-b border-[#EAEAE8] pb-4">
        Define la interfaz y los recursos para la validación del stakeholder.
      </p>

      <form id="deployment-form" onSubmit={handleSubmit} className="space-y-8">
        
        {/* Alerta de Error: Neutra y estructurada */}
        {isError && (
          <div className="p-4 bg-brand-surface border border-brand-accent rounded-xl flex items-center gap-3 text-[#D46077] text-sm font-medium shadow-sm animate-in shake duration-300">
            <AlertCircle size={18} strokeWidth={2.5} />
            <p>Error de telemetría: No se pudo forjar el despliegue en el backend.</p>
          </div>
        )}

        {/* SECCIÓN 1: METADATOS PÚBLICOS */}
        <div className="space-y-5">
          <h4 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#F7F7F5] border border-[#D1D1CD] flex items-center justify-center text-[#5A5855] text-[9px]">1</span>
            Metadatos del Escaparate
          </h4>
          
          <div>
            <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1">
              Nombre Comercial del Modelo
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="w-full bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner focus:shadow-sm"
              placeholder="Ej. Clasificador de Tickets V2"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1">
              Instrucciones para Stakeholders (Contexto)
            </label>
            <textarea
              required
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={isPending}
              className="w-full bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner focus:shadow-sm resize-none custom-scrollbar"
              placeholder="Ej. Por favor, escriban quejas de clientes usando sarcasmo..."
            />
          </div>
        </div>

        {/* SECCIÓN 2: CONFIGURACIÓN DEL MOTOR */}
        <div className="space-y-5">
          <h4 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#F7F7F5] border border-[#D1D1CD] flex items-center justify-center text-[#5A5855] text-[9px]">2</span>
            Configuración del Motor
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hardware */}
            <div>
              <label className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1 flex items-center gap-1.5">
                <Cpu size={12} strokeWidth={2.5} /> Entorno de Ejecución
              </label>
              <select
                value={hardwareTarget}
                onChange={(e) => setHardwareTarget(e.target.value as HardwareTarget)}
                disabled={isPending}
                className="w-full bg-white border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm appearance-none cursor-pointer disabled:cursor-not-allowed disabled:bg-[#F7F7F5]"
              >
                <option value="shared_cpu">CPU Compartida (Económico)</option>
                <option value="nvidia_t4">NVIDIA T4 (Balanceado)</option>
                <option value="nvidia_a100">NVIDIA A100 (Alto Rendimiento)</option>
              </select>
            </div>

            {/* Umbral de Confianza */}
            <div>
              <label className="flex justify-between items-center text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1">
                <span className="flex items-center gap-1.5">
                  <Sliders size={12} strokeWidth={2.5} /> Umbral de Confianza
                </span>
                <span className="text-brand-primary font-mono">{Math.round(confidenceThreshold * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="0.99"
                step="0.01"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                disabled={isPending}
                className="w-full h-2 bg-[#EAEAE8] rounded-lg appearance-none cursor-pointer accent-brand-primary mt-3"
              />
              <p className="text-[9px] text-[#A1A19A] font-bold uppercase tracking-widest mt-2 ml-1">Mínimo para evitar advertencia.</p>
            </div>
          </div>

          {/* Data Flywheel Toggle: Estructurado como una tarjeta de configuración */}
          <div className="flex items-start gap-4 p-5 bg-white border border-[#EAEAE8] rounded-xl shadow-sm transition-colors hover:border-[#D1D1CD]">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="store-prompts"
                type="checkbox"
                checked={storePrompts}
                onChange={(e) => setStorePrompts(e.target.checked)}
                disabled={isPending}
                className="w-4 h-4 text-brand-primary bg-[#F7F7F5] border-[#D1D1CD] rounded focus:ring-brand-primary focus:ring-2 cursor-pointer"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="store-prompts" className="text-sm font-bold text-[#111111] cursor-pointer font-display flex items-center gap-2">
                <Database size={14} strokeWidth={2.5} className="text-[#A1A19A]" />
                Bucle de Datos (Data Flywheel)
              </label>
              <p className="text-xs text-[#5A5855] font-medium mt-1 leading-relaxed">
                Almacenar los prompts inyectados y las validaciones de los stakeholders para alimentar futuros ciclos de re-entrenamiento.
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER: Controles de Acción Coherentes */}
        <div className="pt-6 border-t border-[#EAEAE8] flex justify-end gap-3 mt-8">
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
            disabled={isPending || !name.trim() || !instructions.trim()}
            className="px-5 py-2.5 flex items-center gap-2 font-bold text-white bg-brand-primary hover:bg-[#D46077] disabled:bg-[#F7F7F5] disabled:text-[#A1A19A] disabled:border disabled:border-[#D1D1CD] border border-transparent rounded-xl transition-all active:scale-95 shadow-sm"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Forjando...
              </>
            ) : (
              <>
                <Rocket size={16} strokeWidth={2.5} />
                Publicar Despliegue
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
};