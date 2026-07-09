// src/features/validation/routes/VHubPlayground.tsx
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProject } from '../../projects/api/getProject'; 
import { getDeployments } from '../../deployments/api/getDeployments';
import { InferenceArena } from '../components/InferenceArena'; 
import { FeedbackHistory } from '../components/FeedbackHistory';
import { DeploymentList } from '../../deployments/components/DeploymentList'; 
import { ChevronLeft, Target, History, MonitorPlay } from 'lucide-react'; // Iconografía técnica

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

  useEffect(() => {
    if (deployments && deployments.length > 0 && !selectedDeploymentId) {
      const active = deployments.find(d => d.status === 'active') || deployments[0];
      setSelectedDeploymentId(active.id);
    }
  }, [deployments, selectedDeploymentId]);

  if (isLoadingProject || isLoadingDeps) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 text-[#5A5855]">
        <div className="w-8 h-8 border-2 border-[#EAEAE8] border-t-brand-primary rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A19A] animate-pulse">
          Sincronizando entorno UAT...
        </span>
      </div>
    );
  }

  const activeDeployment = deployments?.find(d => d.id === selectedDeploymentId);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-400 mx-auto">
      
      {/* Botón Volver */}
      <div className="mb-8">
        <Link 
          to="/v-hub" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#A1A19A] hover:text-brand-primary transition-colors group"
        >
          <div className="w-6 h-6 rounded-full bg-white border border-[#EAEAE8] flex items-center justify-center group-hover:border-brand-primary transition-colors shadow-sm">
            <ChevronLeft size={14} strokeWidth={2.5} />
          </div>
          Volver a Proyectos
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* COLUMNA IZQUIERDA: Maestro (Expedientes de Despliegue) */}
        <aside className="w-full lg:w-85 shrink-0">
          <div className="flex items-center gap-2 mb-4 px-2">
            <MonitorPlay size={14} strokeWidth={2.5} className="text-[#111111]" />
            <h3 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest">
              Entornos Disponibles
            </h3>
          </div>

          <div className="bg-[#F7F7F5] rounded-2xl">
            <DeploymentList 
              projectId={projectId as string} 
              selectedId={selectedDeploymentId} 
              onSelect={setSelectedDeploymentId} 
            />
          </div>
        </aside>

        {/* COLUMNA DERECHA: Centro de Inferencia y Auditoría */}
        <main className="flex-1 w-full min-w-0 space-y-10">
          {activeDeployment ? (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              
              {/* La Arena de Pruebas */}
              <section>
                <InferenceArena 
                  deployment={activeDeployment} 
                  projectDescription={project?.description ?? ""}  
                /> 
              </section>

              {/* La Bitácora Histórica*/}
              <section className="bg-white border border-[#EAEAE8] rounded-2xl p-6 lg:p-8 shadow-sm">
                <h2 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-[#F7F7F5] pb-4">
                  <History size={14} strokeWidth={2.5} className="text-[#111111]" />
                  Auditoría de Stakeholders (Historial)
                </h2>
                <div className="min-h-50">
                  <FeedbackHistory deploymentId={activeDeployment.id} />
                </div>
              </section>
            </div>
          ) : (
            /* Estado Vacío: Troquelado Físico */
            <div className="p-16 border-2 border-dashed border-[#D1D1CD] bg-white rounded-2xl flex flex-col items-center justify-center text-[#A1A19A] min-h-125 shadow-inner">
              <div className="w-16 h-16 bg-[#F7F7F5] rounded-full flex items-center justify-center mb-5 border border-[#EAEAE8]">
                <Target size={32} strokeWidth={1.5} className="text-[#D1D1CD]" />
              </div>
              <p className="font-bold font-display text-[#111111] text-lg">Punto de Inferencia No Seleccionado</p>
              <p className="text-sm font-medium mt-1">Selecciona un despliegue de la lista lateral para comenzar la validación.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};