// src/features/validation/routes/VHubPlayground.tsx
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProject } from '../../projects/api/getProject'; 
import { getDeployments } from '../../deployments/api/getDeployments';
import { InferenceArena } from '../components/InferenceArena'; 
import { FeedbackHistory } from '../components/FeedbackHistory';

export const VHubPlayground = () => {
  const { projectId } = useParams();
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project-detail', projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId
  });

  const { data: deployments, isLoading: isLoadingDeps } = useQuery({
    queryKey: ['project-deployments', projectId],
    queryFn: () => getDeployments(projectId!),
    enabled: !!projectId
  });

  // Efecto para seleccionar automáticamente el primer despliegue activo al cargar
  useEffect(() => {
    if (deployments && deployments.length > 0 && !selectedDeploymentId) {
      const active = deployments.find(d => d.status === 'active') || deployments[0];
      setSelectedDeploymentId(active.id);
    }
  }, [deployments, selectedDeploymentId]);

  if (isLoadingProject || isLoadingDeps) return <div className="p-12 text-center text-emerald-500 animate-pulse">Sincronizando...</div>;

  const activeDeployment = deployments?.find(d => d.id === selectedDeploymentId);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Botón Volver */}
      <div className="mb-6">
        <Link to="/v-hub" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-2">
          ← Volver a Proyectos
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* COLUMNA IZQUIERDA: Micro-Tarjetas */}
        <aside className="w-full lg:w-80 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Despliegues Disponibles</h3>
          {deployments?.map((dep) => (
            <button
              key={dep.id}
              onClick={() => setSelectedDeploymentId(dep.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-300 ${
                selectedDeploymentId === dep.id 
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/5' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <p className={`text-sm font-bold mb-1 ${selectedDeploymentId === dep.id ? 'text-emerald-400' : 'text-slate-300'}`}>
                {dep.name}
              </p>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dep.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                <span className="text-[10px] text-slate-500 uppercase font-medium">{dep.status}</span>
              </div>
            </button>
          ))}
        </aside>

        {/* COLUMNA DERECHA: La Arena de Inferencia */}
        <main className="flex-1 w-full">
          {activeDeployment ? (
           <>
              {/* La zona de pruebas */}
              <InferenceArena deployment={activeDeployment} projectDescription={project?.description ?? ""}  /> 

              {/* La bitácora histórica */}
              <FeedbackHistory deploymentId={activeDeployment.id} />
            </>
          ) : (
            <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl text-center text-slate-600">
              Selecciona un despliegue para comenzar la validación.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};