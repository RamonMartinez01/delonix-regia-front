// src/features/projects/routes/ProjectDetail.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ExperimentList } from "../../experiments/components/ExperimentList";
import { ExperimentDetail } from "../../experiments/routes/ExperimentDetail";
import { CreateExperimentModal } from "../../experiments/components/CreateExperimentModal";
import { DeploymentList } from "../../deployments/components/DeploymentList";
import { DeploymentDetail } from "../../deployments/routes/DeploymentDetail";
import { useProject } from '../hooks/useProject';
import { Modal } from '../../../components/ui/Modal';
import { CreateInvitationForm } from '../../invitations/components/CreateInvitationForm';
import { UserPlus, Plus, FlaskConical, Rocket } from 'lucide-react'; // Cambiamos emojis por iconografía técnica

type TabType = 'experiments' | 'deployments';

export const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: project, isLoading } = useProject(projectId);

  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>('experiments');
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  if (!projectId) return null;

  if (isLoading) {
    return (
      /* Estado de carga alineado con nuestra UI editorial */
      <div className="flex flex-col items-center justify-center h-64 text-[#5A5855]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#EAEAE8] border-t-brand-primary mb-4" />
        <p className="text-[10px] font-bold tracking-widest uppercase animate-pulse">Analizando arquitectura del proyecto...</p>
      </div>
    );
  }

  return (
    /* El fondo oscuro desaparece; heredamos la claridad del AppLayout */
    <div className="min-h-screen p-6 md:p-10 text-[#111111]">
      <div className="max-w-400 mx-auto animate-in fade-in duration-500">

        {/* Migas de Pan (Breadcrumb) Tácticas */}
        <div className="mb-3">
          <span className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Contexto de Proyecto
          </span>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-[#EAEAE8] pb-6 gap-6">
          {/* SECTOR IZQUIERDO: Identidad del Proyecto */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-[#111111] tracking-tight">
              {project?.name || 'Proyecto'}
            </h1>
            <p className="text-[#5A5855] text-[10px] font-bold mt-3 uppercase tracking-widest bg-[#F7F7F5] inline-block px-2.5 py-1 rounded-md border border-[#EAEAE8]">
              Operaciones ML
            </p>
          </div>

          {/* SECTOR DERECHO: Centro de Mandos */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

            {/* Botón de acción principal: Físico y anclado a la marca */}
            {activeTab === 'experiments' && (
              <button
                onClick={() => setIsExpModalOpen(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-[#D46077] text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 flex-1 md:flex-none"
              >
                <Plus size={16} strokeWidth={2.5} />
                Nuevo Experimento
              </button>
            )}

            {/* Botón de acción secundaria: Contorno impreso */}
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#D1D1CD] hover:bg-[#F7F7F5] hover:text-[#111111] text-[#5A5855] font-bold text-sm rounded-xl transition-all shadow-sm active:scale-95 flex-1 md:flex-none"
            >
              <UserPlus size={16} strokeWidth={2.5} />
              Añadir al Equipo
            </button>
          </div>
        </header>

        {/* 2. Sistema de Pestañas (Tabs) con Jerarquía Editorial */}
        <div className="flex gap-8 border-b border-[#EAEAE8] mb-8">
          <button
            onClick={() => setActiveTab('experiments')}
            className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === 'experiments'
                ? 'border-brand-primary text-[#111111]'
                : 'border-transparent text-[#A1A19A] hover:text-[#5A5855]'
            }`}
          >
            Bitácora de Experimentos
          </button>
          <button
            onClick={() => setActiveTab('deployments')}
            className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all border-b-2 ${
              activeTab === 'deployments'
                ? 'border-brand-primary text-[#111111]'
                : 'border-transparent text-[#A1A19A] hover:text-[#5A5855]'
            }`}
          >
            UAT (Despliegues)
          </button>
        </div>

        <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* 3. Renderizado Condicional de Contenido */}
          {activeTab === 'experiments' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-8 pb-4 border-b border-[#EAEAE8]">
                <h2 className="text-xl font-bold font-display text-[#111111] tracking-tight">Laboratorio de Modelos</h2>
                <p className="text-[#5A5855] text-sm mt-1 font-medium">Telemetría de entrenamiento y métricas de rendimiento.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <aside className="w-full lg:w-80 shrink-0">
                  <ExperimentList
                    projectId={projectId as string}
                    selectedId={selectedExperimentId}
                    onSelect={setSelectedExperimentId}
                  />
                </aside>

                <section className="flex-1 w-full min-w-0">
                  {selectedExperimentId ? (
                    <ExperimentDetail
                      projectId={projectId as string}
                      experimentId={selectedExperimentId}
                    />
                  ) : (
                    /* Estado Vacío Estructurado (Reemplaza al emoji con iconografía Lucide) */
                    <div className="p-12 border-2 border-dashed border-[#D1D1CD] bg-white rounded-2xl flex flex-col items-center justify-center text-[#A1A19A] min-h-100">
                      <FlaskConical size={48} strokeWidth={1.5} className="mb-4 text-[#D1D1CD]" />
                      <p className="font-medium text-[#5A5855]">Selecciona un experimento de la lista para inspeccionar su telemetría.</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 pb-4 border-b border-[#EAEAE8]">
                <h2 className="text-xl font-bold font-display text-[#111111] tracking-tight">Centro de Despliegues</h2>
                <p className="text-[#5A5855] text-sm mt-1 font-medium">Gestión de vitrinas activas para Stakeholders.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <aside className="w-full lg:w-80 shrink-0">
                  <DeploymentList
                    projectId={projectId as string}
                    selectedId={selectedDeploymentId}
                    onSelect={setSelectedDeploymentId} />
                </aside>

                <section className="flex-1 w-full min-w-0">
                  {selectedDeploymentId ? (
                    <DeploymentDetail
                      deploymentId={selectedDeploymentId}
                    />
                  ) : (
                    /* Estado Vacío Estructurado */
                    <div className="p-12 border-2 border-dashed border-[#D1D1CD] bg-white rounded-2xl flex flex-col items-center justify-center text-[#A1A19A] min-h-100">
                      <Rocket size={48} strokeWidth={1.5} className="mb-4 text-[#D1D1CD]" />
                      <p className="font-medium text-[#5A5855]">Selecciona un despliegue de la lista para inspeccionar su telemetría.</p>
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </main>

        <CreateExperimentModal
          isOpen={isExpModalOpen}
          onClose={() => setIsExpModalOpen(false)}
          projectId={projectId}
        />
      </div>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={`Invitar a ${project?.name || 'Proyecto'}`}
      >
        <CreateInvitationForm
          fixedProjectId={projectId}
          onSuccess={() => setIsInviteModalOpen(false)}
        />
      </Modal>
    </div>
  );
};