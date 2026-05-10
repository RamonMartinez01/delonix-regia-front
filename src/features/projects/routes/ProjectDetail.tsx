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
import { UserPlus } from 'lucide-react';

// Pestañas de navegación
type TabType = 'experiments' | 'deployments';

export const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // los datos del proyecto
  const { data: project, isLoading } = useProject(projectId);

  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);

  // 1. Estados de la interfaz
  const [activeTab, setActiveTab] = useState<TabType>('experiments');
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  if (!projectId) return null;

  // Pantalla de carga sutil para no romper el layout
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 mb-4" />
        <p className="text-xs tracking-widest animate-pulse">Analizando arquitectura del proyecto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-[1600px] mx-auto">

        <div className="mb-2">
          <span className="text-emerald-500 text-sm font-medium flex items-center gap-2">
            Proyecto
          </span>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6">
          {/* SECTOR IZQUIERDO: Identidad del Proyecto */}
          <div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              {project?.name || 'Proyecto'}
            </h1>
            <p className="text-slate-500 text-xs font-medium mt-1 uppercase tracking-wider">
              Operaciones ML
            </p>
          </div>

          {/* SECTOR DERECHO: Centro de Mandos (Botones) */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

          {/* Botón de acción contextual: solo se muestra si estamos en experimentos */}
          {activeTab === 'experiments' && (
            <button
              onClick={() => setIsExpModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 
                bg-blue-500/10 hover:bg-blue-500/20 
                border border-blue-500/30 hover:border-blue-500/60 
                text-blue-400 font-bold text-sm 
                rounded-xl transition-all duration-200 
                active:scale-95"
            >
              + Nuevo Experimento
            </button>
          )}


          {/* BOTÓN DE INVITACIÓN EN CONTEXTO */}
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 
              bg-slate-700 hover:bg-slate-900 
              border border-emerald-500/30 hover:border-emerald-500/60 
              text-emerald-400 font-bold text-sm 
              rounded-xl transition-all duration-200 
              active:scale-95"
          >
            <UserPlus size={18} />
            Añadir al Equipo
          </button>
          </div>

        </header>

        {/* 2. Sistema de Pestañas (Tabs) */}
        <div className="flex gap-8 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('experiments')}
            className={`pb-4 text-sm font-semibold transition-all border-b-2 ${activeTab === 'experiments'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
          >
            Bitácora de Experimentos
          </button>
          <button
            onClick={() => setActiveTab('deployments')}
            className={`pb-4 text-sm font-semibold transition-all border-b-2 ${activeTab === 'deployments'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
          >
            UAT (Despliegues)
          </button>
        </div>

        <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* 3. Renderizado Condicional de Contenido */}
          {activeTab === 'experiments' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-8 pb-4 border-b border-slate-800/60">
                <h2 className="text-xl font-bold text-slate-200 tracking-tight">Laboratorio de Modelos</h2>
                <p className="text-slate-400 text-sm mt-1">Telemetría de entrenamiento y métricas de rendimiento.</p>
              </div>

              {/* EL PATRÓN MASTER-DETAIL */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* COLUMNA IZQUIERDA: Maestro (Micro-tarjetas) */}
                <aside className="w-full lg:w-80 flex-shrink-0">
                  <ExperimentList
                    projectId={projectId as string}
                    selectedId={selectedExperimentId}
                    onSelect={setSelectedExperimentId}
                  />
                </aside>

                {/* COLUMNA DERECHA: Detalle (Centro de Comando) */}
                <section className="flex-1 w-full min-w-0">
                  {selectedExperimentId ? (
                    <ExperimentDetail
                      projectId={projectId as string}
                      experimentId={selectedExperimentId}
                    />
                  ) : (
                    <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
                      <span className="text-4xl mb-4">🔬</span>
                      <p>Selecciona un experimento de la lista para inspeccionar su telemetría.</p>
                    </div>
                  )}
                </section>

              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 pb-4 border-b border-slate-800/60">
                <h2 className="text-xl font-bold text-slate-200 tracking-tight">Centro de Despliegues</h2>
                <p className="text-slate-400 text-sm mt-1">Gestión de vitrinas activas para Stakeholders.</p>
              </div>

              {/* EL PATRÓN MASTER-DETAIL */}
              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* COLUMNA IZQUIERDA: Maestro (Micro-tarjetas) */}
                <aside className="w-full lg:w-80 flex-shrink-0">
                  <DeploymentList
                    projectId={projectId as string}
                    selectedId={selectedDeploymentId}
                    onSelect={setSelectedDeploymentId} />
                </aside>

                {/* COLUMNA DERECHA: Detalle de Despliegue */}
                <section className="flex-1 w-full min-w-0">
                  {selectedDeploymentId ? (
                    <DeploymentDetail
                      deploymentId={selectedDeploymentId}
                    />
                  ) : (
                    <div className="p-12 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
                      <span className="text-4xl mb-4">🔬</span>
                      <p>Selecciona un despliegue de la lista para inspeccionar su telemetría.</p>
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