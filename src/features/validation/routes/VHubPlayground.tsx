// src/features/validation/routes/VHubPlayground.tsx
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProject } from '../../projects/api/getProject'; 
import { getDeployments } from '../../deployments/api/getDeployments';
import { InferenceArena } from '../components/InferenceArena'; 
import { FeedbackHistory } from '../components/FeedbackHistory';
import { DeploymentList } from '../../deployments/components/DeploymentList'; 

export const VHubPlayground = () => {
  const { projectId } = useParams();
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ['project-detail', projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId
  });

  // Mantenemos esta consulta activa para la auto-selección y para extraer el objeto completo
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

  if (isLoadingProject || isLoadingDeps) {
    return <div className="p-12 text-center text-emerald-500 animate-pulse">Sincronizando entorno UAT...</div>;
  }

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
        
        {/* COLUMNA IZQUIERDA: Maestro (Micro-tarjetas reutilizadas) */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Entornos Disponibles</h3>
          {/* Aquí inyectamos el componente refactorizado */}
          <DeploymentList 
            projectId={projectId as string} 
            selectedId={selectedDeploymentId} 
            onSelect={setSelectedDeploymentId} 
          />
        </aside>

        {/* COLUMNA DERECHA: La Arena de Inferencia */}
        <main className="flex-1 w-full min-w-0">
          {activeDeployment ? (
           <div className="space-y-8">
              {/* La zona de pruebas */}
              <section>
                <InferenceArena deployment={activeDeployment} projectDescription={project?.description ?? ""}  /> 
              </section>

              {/* La bitácora histórica */}
              <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-users-viewfinder text-blue-400"></i> Auditoría de Stakeholders
                </h2>
                <FeedbackHistory deploymentId={activeDeployment.id} />
              </section>
            </div>
          ) : (
            <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
              <span className="text-4xl mb-4">🎯</span>
              <p>Selecciona un despliegue para comenzar la validación.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};