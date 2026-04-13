// src/features/projects/routes/ProjectDetail.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ExperimentList } from "../../experiments/components/ExperimentList";
import { CreateExperimentModal } from "../../experiments/components/CreateExperimentModal";
import { DeploymentList } from "../../deployments/components/DeploymentList"; // <-- Importamos los ladrillos nuevos

// Pestañas de navegación
type TabType = 'experiments' | 'deployments';

export const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // 1. Estados de la interfaz
  const [activeTab, setActiveTab] = useState<TabType>('experiments');
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  if (!projectId) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navegación Superior */}
        <div className="mb-6">
          <Link to="/" className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2">
            &larr; Volver al Centro de Comando
          </Link>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Detalles del Proyecto</h1>
            <p className="text-slate-400 mt-1 font-mono text-sm uppercase tracking-tighter">
              ID: {projectId}
            </p>
          </div>
          
          {/* Botón de acción contextual: solo se muestra si estamos en experimentos */}
          {activeTab === 'experiments' && (
            <button 
              onClick={() => setIsExpModalOpen(true)}
              className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
            >
              + Nuevo Experimento
            </button>
          )}
        </header>

        {/* 2. Sistema de Pestañas (Tabs) */}
        <div className="flex gap-8 border-b border-slate-800 mb-8">
          <button
            onClick={() => setActiveTab('experiments')}
            className={`pb-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'experiments' 
                ? 'border-emerald-500 text-emerald-400' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Bitácora de Experimentos
          </button>
          <button
            onClick={() => setActiveTab('deployments')}
            className={`pb-4 text-sm font-semibold transition-all border-b-2 ${
              activeTab === 'deployments' 
                ? 'border-emerald-500 text-emerald-400' 
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Escaparates UAT (Despliegues)
          </button>
        </div>

        <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* 3. Renderizado Condicional de Contenido */}
          {activeTab === 'experiments' ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-200">Laboratorio de Modelos</h2>
                <p className="text-slate-400 text-sm">Telemetría de entrenamiento y métricas de rendimiento.</p>
              </div>
              <ExperimentList projectId={projectId} />
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-200">Centro de Despliegues</h2>
                <p className="text-slate-400 text-sm">Gestión de vitrinas activas para Stakeholders.</p>
              </div>
              <DeploymentList projectId={projectId} />
            </>
          )}
        </main>

        <CreateExperimentModal 
          isOpen={isExpModalOpen} 
          onClose={() => setIsExpModalOpen(false)} 
          projectId={projectId} 
        />
      </div>
    </div>
  );
};