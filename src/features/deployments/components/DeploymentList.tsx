import { useDeployments } from '../api/getDeployments';
import type { DeploymentStatus } from '../types';

const StatusBadge = ({ status }: { status: DeploymentStatus }) => {
  const isActive = status === 'active';
  return (
   <span className={`inline-flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
      <span className="text-[8px]">{isActive ? '●' : '○'}</span>
      <span>{isActive ? 'Activo' : 'Detenido'}</span>
    </span>
  );
};

// 1. EL NUEVO CONTRATO DE COMUNICACIÓN
interface DeploymentListProps {
  projectId: string;
  selectedId?: string | null;
  onSelect?: (deploymentId: string) => void;
}

export const DeploymentList = ({ projectId, selectedId, onSelect }: DeploymentListProps) => {
  const { data: deployments, isLoading, isError } = useDeployments(projectId);

  if (isLoading) {
    return <div className="p-4 text-emerald-500 animate-pulse text-sm">Escaneando escaparates...</div>;
  }

  if (isError) {
    return <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">Error de telemetría.</div>;
  }

  if (!deployments || deployments.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-sm">
        No hay escaparates UAT activos en este proyecto.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {deployments.map((dep) => (
        <button
          key={dep.id}
          onClick={() => onSelect && onSelect(dep.id)}
          className={`p-4 rounded-xl border text-left transition-all duration-300 w-full ${
            selectedId === dep.id
              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          {/* Fila 1: Título y Estatus */}
          <div className="flex justify-between items-start mb-2">
            <p className={`text-sm font-bold truncate pr-2 ${selectedId === dep.id ? 'text-emerald-400' : 'text-slate-300'}`}>
              {dep.name}
            </p>
            <StatusBadge status={dep.status} />
          </div>
          
          {/* Fila 2: Tarea técnica */}
          <p className="text-[10px] text-slate-500 font-mono mb-3 truncate">
            {dep.task_type?.replace('_', ' ') || 'Tarea Desconocida'}
          </p>

          {/* Fila 3: Hardware y Fecha */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/50">
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
              <i className="fa-solid fa-microchip"></i>
              {dep.hardware_target === 'shared_cpu' ? 'CPU' : dep.hardware_target?.replace('nvidia_', 'GPU ').toUpperCase() || 'N/A'}
            </div>
            <span className="text-[10px] text-slate-500">
              {new Date(dep.created_at).toLocaleDateString()}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};