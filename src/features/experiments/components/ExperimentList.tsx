// src/features/experiments/components/ExperimentList.tsx
import { useExperiments } from '../api/getExperiments';
import type { ExperimentStatus } from '../types';

// 1. Componente de Presentación Puro
const StatusBadge = ({ status }: { status: ExperimentStatus }) => {
  const styles: Record<ExperimentStatus, string> = {
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse',
    queued: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const labels: Record<ExperimentStatus, string> = {
    completed: 'Completado',
    processing: 'En Ejecución',
    queued: 'En Cola',
    failed: 'Fallido',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// 2. Componente Contenedor de la Tabla
interface ExperimentListProps {
  projectId: string;
}

export const ExperimentList = ({ projectId }: ExperimentListProps) => {
  const { data: experiments, isLoading, isError } = useExperiments(projectId);

  if (isLoading) {
    return (
      <div className="space-y-3 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-800 rounded-lg animate-pulse border border-slate-700"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
        Error crítico al intentar recuperar la telemetría del clúster.
      </div>
    );
  }

  if (!experiments || experiments.length === 0) {
    return (
      <div className="mt-6 text-center p-12 border border-dashed border-slate-700 rounded-lg bg-slate-800/30">
        <p className="text-slate-400">No hay experimentos registrados en la bitácora de este proyecto.</p>
        <p className="text-slate-500 text-sm mt-2">Inicia un nuevo entrenamiento para ver las métricas aquí.</p>
      </div>
    );
  }

  // 3. Renderizado de la Tabla de Datos Mejorada
  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-slate-700 shadow-xl">
      <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700">
          <tr>
            <th className="px-6 py-4 font-semibold">Experimento</th>
            <th className="px-6 py-4 font-semibold">Estado</th>
            <th className="px-6 py-4 font-semibold">Métricas (Botín)</th> {/* 👇 NUEVA COLUMNA */}
            <th className="px-6 py-4 font-semibold">Tiempo</th>
            <th className="px-6 py-4 font-semibold">Modelo Base</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 bg-slate-800/30">
          {experiments.map((exp) => (
            <tr key={exp.id} className="hover:bg-slate-700/30 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-200">{exp.name || 'Sin nombre'}</div>
                <div className="text-xs text-slate-500 font-mono mt-1">ID: {exp.id.split('-')[0]}</div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={exp.status} />
              </td>
              {/* 👇 RENDERIZADO DEL BOTÍN */}
              <td className="px-6 py-4">
                {exp.metrics ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-emerald-400 font-mono text-xs">
                      Acc: {exp.metrics.accuracy !== undefined
                        ? `${(exp.metrics.accuracy * 100).toFixed(1)}%`
                        : '-'}
                    </span>
                    <span className="text-amber-400 font-mono text-xs">
                    Loss: {exp.metrics.loss !== undefined 
                        ? exp.metrics.loss.toFixed(4) 
                        : '—'}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-500 text-xs italic">Pendiente...</span>
                )}
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