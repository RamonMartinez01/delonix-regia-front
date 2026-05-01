import { useExperiments } from '../api/getExperiments'; // Ajusta este import a tu gancho real

// 1. EL NUEVO CONTRATO DE COMUNICACIÓN
interface ExperimentListProps {
  projectId: string;
  selectedId?: string | null; // El padre nos dirá cuál está seleccionado
  onSelect?: (experimentId: string) => void; // Le avisaremos al padre cuando hagan clic
}

export const ExperimentList = ({ projectId, selectedId, onSelect }: ExperimentListProps) => {
  const { data: experiments, isLoading } = useExperiments(projectId);

  if (isLoading) return <div className="p-4 text-emerald-500 animate-pulse text-sm">Escaneando laboratorio...</div>;

  if (!experiments || experiments.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-sm">
        No hay modelos forjados en este proyecto.
      </div>
    );
  }

  // Diccionario visual de estados
  const statusColors: Record<string, string> = {
    queued: 'bg-amber-500',
    processing: 'bg-blue-400 animate-pulse',
    completed: 'bg-emerald-500',
    failed: 'bg-red-500',
  };

  return (
    <div className="flex flex-col gap-3">
      {experiments.map((exp) => (
        <button
          key={exp.id}
          onClick={() => onSelect && onSelect(exp.id)}
          className={`p-4 rounded-xl border text-left transition-all duration-300 w-full ${
            selectedId === exp.id
              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Fila 1: Título y Versión */}
          <div className="flex justify-between items-start mb-1">
            <p className={`text-sm font-bold truncate pr-2 ${selectedId === exp.id ? 'text-emerald-400' : 'text-slate-300'}`}>
              {exp.name || 'Sin nombre'}
            </p>
            <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-emerald-400">
              v{exp.version}
            </span>
          </div>
          
          {/* Fila 2: Tarea técnica */}
          <p className="text-[10px] text-slate-500 font-mono mb-3 truncate">
            {exp.task_type.replace('_', ' ')}
          </p>

          {/* Fila 3: Estatus y Métrica Rápida */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusColors[exp.status] || 'bg-slate-600'}`}></span>
              <span className="text-[10px] text-slate-400 uppercase font-medium">{exp.status}</span>
            </div>
            
            {/* El botín visual: si está completo, mostramos su precisión directamente en la tarjeta */}
            {exp.status === 'completed' && exp.metrics?.accuracy !== undefined && (
              <span className="text-[10px] text-emerald-500 font-bold tracking-wider">
                ACC: {((exp.metrics.accuracy || 0) * 100).toFixed(1)}%
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};