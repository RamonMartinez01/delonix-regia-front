// src/features/deployments/components/DeploymentList.tsx
import { useDeployments } from '../api/getDeployments';
import type { DeploymentStatus } from '../types';
import { Cpu, Rocket, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }: { status: DeploymentStatus }) => {
  const isActive = status === 'active';
  
  // Utilizamos nuestra paleta mate: Verde Salvia para activo, Gris Estructural para inactivo
  return (
   <span className={`inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border transition-colors ${
     isActive 
      ? 'bg-role-validator/10 text-role-validator border-role-validator/20' 
      : 'bg-brand-surface text-[#A1A19A] border-[#EAEAE8]'
    }`}>
      <span className="text-[8px] animate-pulse">{isActive ? '●' : '○'}</span>
      <span>{isActive ? 'Activo' : 'Detenido'}</span>
    </span>
  );
};

interface DeploymentListProps {
  projectId: string;
  selectedId?: string | null;
  onSelect?: (deploymentId: string) => void;
}

export const DeploymentList = ({ projectId, selectedId, onSelect }: DeploymentListProps) => {
  const { data: deployments, isLoading, isError } = useDeployments(projectId);

  if (isLoading) {
    return (
      <div className="p-6 bg-white border border-[#EAEAE8] rounded-2xl flex flex-col items-center justify-center gap-3 text-[#A1A19A]">
        <div className="w-5 h-5 border-2 border-[#EAEAE8] border-t-brand-primary rounded-full animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5855] animate-pulse">
          Sincronizando vitrinas...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5 bg-brand-surface border border-brand-accent rounded-2xl flex flex-col items-center justify-center gap-2 text-center shadow-sm">
        <AlertCircle className="text-[#D46077]" size={20} strokeWidth={2.5} />
        <span className="text-sm font-bold text-[#D46077]">Error de telemetría</span>
      </div>
    );
  }

  if (!deployments || deployments.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-[#D1D1CD] bg-[#F7F7F5] rounded-2xl text-center flex flex-col items-center justify-center gap-2">
        <Rocket size={20} strokeWidth={2} className="text-[#A1A19A] mb-1" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5A5855]">Plataforma Vacía</span>
        <span className="text-xs font-medium text-[#A1A19A]">No hay entornos UAT activos en este proyecto.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 custom-scrollbar overflow-y-auto max-h-200 pr-2">
      {deployments.map((dep) => {
        const isSelected = selectedId === dep.id;

        return (
          <button
            key={dep.id}
            onClick={() => onSelect && onSelect(dep.id)}
            className={`p-5 rounded-2xl border text-left transition-all duration-300 w-full group outline-none ${
              isSelected
                ? 'bg-white border-brand-primary shadow-md ring-1 ring-brand-primary/10'
                : 'bg-white border-[#EAEAE8] hover:border-[#D1D1CD] hover:bg-[#F7F7F5] shadow-sm'
            }`}
          >
            {/* Fila 1: Título y Estatus */}
            <div className="flex justify-between items-start mb-2 gap-2">
              <p className={`text-sm font-bold font-display truncate transition-colors ${
                isSelected ? 'text-brand-primary' : 'text-[#111111] group-hover:text-brand-primary'
              }`}>
                {dep.name}
              </p>
              <StatusBadge status={dep.status} />
            </div>
            
            {/* Fila 2: Tarea técnica (Metadato estructural) */}
            <p className="text-[10px] text-[#A1A19A] font-bold uppercase tracking-widest mb-4 truncate">
              {dep.task_type?.replace('_', ' ') || 'Tarea Desconocida'}
            </p>

            {/* Fila 3: Hardware y Fecha */}
            <div className="flex items-center justify-between pt-3 border-t border-[#EAEAE8]">
              <div className="flex items-center gap-1.5 text-[10px] text-[#5A5855] font-bold uppercase tracking-widest bg-[#F7F7F5] px-2 py-1 rounded-md border border-[#D1D1CD]">
                <Cpu size={12} strokeWidth={2.5} className="text-[#A1A19A]" />
                {dep.hardware_target === 'shared_cpu' ? 'CPU' : dep.hardware_target?.replace('nvidia_', 'GPU ').toUpperCase() || 'N/A'}
              </div>
              <span className="text-[10px] text-[#A1A19A] font-bold uppercase tracking-widest">
                {new Date(dep.created_at).toLocaleDateString('es-ES', { 
                  day: '2-digit', month: 'short', year: 'numeric' 
                }).replace('.', '')}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};