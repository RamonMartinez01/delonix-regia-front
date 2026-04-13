// src/features/experiments/routes/ExperimentDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreateDeploymentModal } from '../../deployments/components/CreateDeploymentModal';

export const ExperimentDetail = () => {
  const { projectId, experimentId } = useParams();
  const navigate = useNavigate();
  // Estado para controlar el portal CreateDeploymentM
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Seguridad para TypeScript
  if (!projectId || !experimentId) return null;

  return (
    <div className="p-6 text-slate-200">
      {/* Cabecera y Navegación */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/projects/${projectId}`)}
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          &larr; Volver al Proyecto
        </button>
        <h1 className="text-2xl font-bold">Laboratorio del Experimento</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Metadatos (2/3 del ancho en pantallas grandes) */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-emerald-400 mb-4">Metadatos Tácticos</h2>
          <p className="font-mono text-xs text-slate-400">ID del Experimento: {experimentId}</p>
          <p className="font-mono text-xs text-slate-400">ID del Proyecto: {projectId}</p>
          {/* Aquí vendrán las métricas y el botón de Crear Despliegue UAT */}
        </div>

        {/* El Botón de Ignición (abre/cierra el modal
        ) */}
        <div className="mt-8 pt-6 border-t border-slate-700/50">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Promoción de Modelo</h3>
          <p className="text-xs text-slate-500 mb-4">
            Si este modelo cumple con los estándares, empaquétalo en un escaparate para las pruebas de los Stakeholders.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
          >
            Promover a UAT (Crear Despliegue)
          </button>
        </div>

        {/* Columna Derecha: El Futuro Sandbox (1/3 del ancho) */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
          <span className="text-4xl mb-4">🧪</span>
          <h2 className="text-slate-300 font-medium">Sandbox Efímero</h2>
          <p className="text-slate-500 text-sm text-center mt-2">Área de pruebas de inferencia interna en construcción.</p>
        </div>
      </div>

      {/* El Portal Renderizado Condicionalmente */}
      {isModalOpen && (
        <CreateDeploymentModal
          projectId={projectId}
          experimentId={experimentId}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            // Aquí en el futuro podríamos lanzar una notificación (Toast)
            console.log("¡Escaparate forjado en la base de datos!");
          }}
        />
      )}
    </div>
  );
};