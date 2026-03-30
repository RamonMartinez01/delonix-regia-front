// src/features/experiments/components/ExperimentList.tsx
import { useExperiments } from '../api/getExperiments';
import type { ExperimentStatus } from '../types';

// 1. Componente de Presentación Puro (Dumb Component) para las banderas de estado
const StatusBadge = ({ status }: { status: ExperimentStatus }) => {
  // Diccionario de estilos Tailwind para cada estado
  const styles: Record<ExperimentStatus, string> = {
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    running: 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse',
    queued: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  // Diccionario de traducciones para la interfaz
  const labels: Record<ExperimentStatus, string> = {
    completed: 'Completado',
    running: 'En Ejecución',
    queued: 'En Cola',
    failed: 'Fallido',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// 2. Componente Contenedor (Smart Component) de la Tabla
interface ExperimentListProps {
  projectId: string;
}

export const ExperimentList = ({ projectId }: ExperimentListProps) => {
  // Invocamos a nuestro radar asíncrono pasándole el ID del proyecto
  const { data: experiments, isLoading, isError } = useExperiments(projectId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {/* Skeletons en formato de filas de tabla */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-800 rounded-lg animate-pulse border border-slate-700"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
        Error crítico al intentar recuperar la telemetría del clúster.
      </div>
    );
  }

  if (!experiments || experiments.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-slate-700 rounded-lg bg-slate-800/30">
        <p className="text-slate-400">No hay experimentos registrados en la bitácora de este proyecto.</p>
      </div>
    );
  }

  // 3. Renderizado de la Tabla de Datos
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 shadow-xl">
      <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700">
          <tr>
            <th className="px-6 py-4 font-semibold">Experimento</th>
            <th className="px-6 py-4 font-semibold">Estado</th>
            <th className="px-6 py-4 font-semibold">Tiempo (s)</th>
            <th className="px-6 py-4 font-semibold">Modelo Base</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 bg-slate-800/30">
          {experiments.map((exp) => (
            <tr key={exp.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-200">{exp.name}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">ID: {exp.id.split('-')[0]}</div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={exp.status} />
              </td>
              <td className="px-6 py-4 font-mono text-slate-400">
                {exp.compute_time_seconds ? `${exp.compute_time_seconds}s` : '—'}
              </td>
              <td className="px-6 py-4 text-slate-400">
                <span className="bg-slate-900 px-2 py-1 rounded text-xs border border-slate-700">
                  {exp.model_source_uri.replace('hf://', '')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};