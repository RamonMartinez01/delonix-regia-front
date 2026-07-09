// src/features/experiments/components/ExperimentList.tsx
import { useExperiments } from '../api/getExperiments'; 
import { Activity, Beaker } from 'lucide-react'; // Iconografía técnica

interface ExperimentListProps {
  projectId: string;
  selectedId?: string | null; 
  onSelect?: (experimentId: string) => void; 
}

export const ExperimentList = ({ projectId, selectedId, onSelect }: ExperimentListProps) => {
  const { data: experiments, isLoading } = useExperiments(projectId);

  if (isLoading) {
    return (
      /* Estado de carga: Alineado al sistema de metadatos */
      <div className="p-6 bg-white border border-[#EAEAE8] rounded-2xl flex flex-col items-center justify-center gap-3 text-[#A1A19A]">
        <div className="w-5 h-5 border-2 border-[#EAEAE8] border-t-brand-primary rounded-full animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5855] animate-pulse">
          Escaneando telemetría...
        </span>
      </div>
    );
  }

  if (!experiments || experiments.length === 0) {
    return (
      /* Estado vacío: Troquelado físico */
      <div className="p-8 border-2 border-dashed border-[#D1D1CD] bg-[#F7F7F5] rounded-2xl text-center flex flex-col items-center justify-center gap-2">
        <Beaker size={20} strokeWidth={2} className="text-[#A1A19A] mb-1" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5855]">Cámara Vacía</span>
        <span className="text-xs font-medium text-[#A1A19A]">No hay modelos forjados en este proyecto.</span>
      </div>
    );
  }

  /* Diccionario de estados: Traducido a nuestra paleta editorial mate */
  const statusColors: Record<string, string> = {
    queued: 'bg-[#A1A19A]', // Gris neutro (en espera)
    processing: 'bg-[#4B5E72] animate-pulse', // Azul Pizarra
    completed: 'bg-[#6B7A64]', // Verde Salvia
    failed: 'bg-[#D46077]', // Rosa/Salmón Oscuro
  };

  return (
    <div className="flex flex-col gap-3 custom-scrollbar overflow-y-auto max-h-200 pr-2">
      {experiments.map((exp) => {
        const isSelected = selectedId === exp.id;

        return (
          <button
            key={exp.id}
            onClick={() => onSelect && onSelect(exp.id)}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 w-full group outline-none ${
              isSelected
                ? 'bg-white border-brand-primary shadow-md ring-1 ring-brand-primary/10'
                : 'bg-white border-[#EAEAE8] hover:border-[#D1D1CD] hover:bg-[#F7F7F5] shadow-sm'
            }`}
          >
            {/* Fila 1: Título y Versión */}
            <div className="flex justify-between items-start mb-2">
              <p className={`text-sm font-bold font-display truncate pr-2 transition-colors ${
                isSelected ? 'text-brand-primary' : 'text-[#111111] group-hover:text-brand-primary'
              }`}>
                {exp.name || 'Sin nombre'}
              </p>
              <span className="px-2 py-1 bg-[#F7F7F5] border border-[#EAEAE8] rounded-md text-[9px] font-bold font-mono text-[#5A5855] tracking-widest shrink-0">
                v{exp.version}
              </span>
            </div>
            
            {/* Fila 2: Tarea técnica (Metadato estructural) */}
            <p className="text-[10px] text-[#A1A19A] font-bold uppercase tracking-widest mb-4 truncate">
              {exp.task_type.replace('_', ' ')}
            </p>

            {/* Fila 3: Estatus y Métrica Rápida */}
            <div className="flex items-center justify-between pt-3 border-t border-[#EAEAE8]">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statusColors[exp.status] || 'bg-[#D1D1CD]'}`} />
                <span className="text-[10px] text-[#5A5855] uppercase font-bold tracking-widest">
                  {exp.status}
                </span>
              </div>
              
              {/* El botín visual: Precisión sellada con nuestro Verde Salvia */}
              {exp.status === 'completed' && exp.metrics?.accuracy !== undefined && (
                <span className="text-[10px] text-role-validator font-bold font-mono tracking-widest bg-role-validator/10 px-2 py-0.5 rounded-md border border--role-validator/20 flex items-center gap-1">
                  <Activity size={10} strokeWidth={3} />
                  ACC: {((exp.metrics.accuracy || 0) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};