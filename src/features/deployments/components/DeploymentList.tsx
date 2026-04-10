// src/features/deployments/components/DeploymentList.tsx
import { useNavigate } from 'react-router-dom';
import { useDeployments } from '../api/getDeployments';
import type { DeploymentStatus } from '../types';

const StatusBadge = ({ status }: { status: DeploymentStatus }) => {
  const isObj = status === 'active';
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border uppercase tracking-wider ${isObj ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
      {status === 'active' ? 'Activo' : 'Detenido'}
    </span>
  );
};

interface DeploymentListProps {
  projectId: string;
}

export const DeploymentList = ({ projectId }: DeploymentListProps) => {
  const { data: deployments, isLoading, isError } = useDeployments(projectId);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-3 mt-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-slate-800 rounded-lg animate-pulse border border-slate-700"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">
        Error de telemetría: No se pudieron cargar los escaparates.
      </div>
    );
  }

  if (!deployments || deployments.length === 0) {
    return (
      <div className="mt-6 text-center p-12 border border-dashed border-slate-700 rounded-lg bg-slate-800/30">
        <p className="text-slate-400">No hay escaparates UAT activos en este proyecto.</p>
        <p className="text-slate-500 text-sm mt-2">Ve a la bitácora de experimentos y promueve un modelo para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-slate-700 shadow-xl">
      <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700">
          <tr>
            <th className="px-6 py-4 font-semibold">Escaparate (Nombre Comercial)</th>
            <th className="px-6 py-4 font-semibold">Estado</th>
            <th className="px-6 py-4 font-semibold">Fecha de Despliegue</th>
            <th className="px-6 py-4 font-semibold">URL de Inferencia</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 bg-slate-800/30">
          {deployments.map((dep) => (
            <tr key={dep.id} 
              className="hover:bg-slate-700/30 transition-colors cursor-pointer"
              onClick={() => navigate(`/projects/${projectId}/deployments/${dep.id}`)}
            >
              <td className="px-6 py-4">
                <div className="font-medium text-slate-200">{dep.name}</div>
                <div className="text-xs text-slate-500 mt-1 max-w-xs truncate" title={dep.instructions || ''}>
                  {dep.instructions || 'Sin instrucciones'}
                </div>
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={dep.status} />
              </td>
              <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                {new Date(dep.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 px-2 py-1 rounded text-xs border border-slate-700 text-slate-400 font-mono select-all">
                    {dep.endpoint_url || 'N/A'}
                  </span>
                  {dep.endpoint_url && (
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation();
                        navigator.clipboard.writeText(dep.endpoint_url!)
                      }}
                      className="text-slate-400 hover:text-emerald-400 transition-colors"
                      title="Copiar al portapapeles"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};