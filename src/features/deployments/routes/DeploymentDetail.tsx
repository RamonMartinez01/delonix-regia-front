// src/features/deployments/routes/DeploymentDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';

export const DeploymentDetail = () => {
  const { projectId, deploymentId } = useParams<{ projectId: string; deploymentId: string }>();
  const navigate = useNavigate();

  if (!projectId || !deploymentId) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navegación Superior */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(`/projects/${projectId}`)}
            className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2"
          >
            &larr; Volver al Proyecto
          </button>
        </div>

        <header className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Centro de Mando del Despliegue</h1>
            <p className="text-slate-400 mt-1 font-mono text-sm uppercase tracking-tighter">
              ID: {deploymentId}
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-sm font-medium uppercase tracking-wider">
            Activo
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Izquierda (Principal): El Espejo y La Cosecha */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. El Espejo (UAT Preview) */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-400 mb-2">El Espejo (Preview)</h2>
              <p className="text-sm text-slate-400 mb-4">
                Interactúa con el modelo exactamente como lo verá el Stakeholder en su escaparate.
              </p>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                <span className="text-slate-500 text-sm italic">Componente de Sandbox en construcción...</span>
              </div>
            </div>

            {/* 2. La Cosecha (Feedback Loop) */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-emerald-400 mb-2">La Cosecha</h2>
              <p className="text-sm text-slate-400 mb-4">
                Calificaciones y correcciones realizadas por los usuarios (Ground Truth).
              </p>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 flex items-center justify-center min-h-[150px]">
                <span className="text-slate-500 text-sm italic">Tabla de retroalimentación en construcción...</span>
              </div>
            </div>

          </div>

          {/* Columna Derecha (Lateral): Accesos y Metadatos */}
          <div className="space-y-8">
            
            {/* 3. Control de Accesos (RBAC) */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-400 mb-2">Control de Accesos</h2>
              <p className="text-sm text-slate-400 mb-4">
                Stakeholders con permiso para utilizar este modelo.
              </p>
              
              {/* Mock de un usuario con acceso */}
              <ul className="space-y-3">
                <li className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg border border-slate-700">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                    AZ
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Azul (Cliente)</p>
                    <p className="text-xs text-slate-500">MEMBER</p>
                  </div>
                </li>
              </ul>
              
              <button className="w-full mt-4 py-2 border border-slate-600 rounded-lg text-slate-300 text-sm hover:bg-slate-700 hover:text-white transition-colors">
                + Gestionar Accesos
              </button>
            </div>

            {/* 4. Detalles Técnicos */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-300 mb-4">Detalles de Infraestructura</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">URL de Inferencia Pública</p>
                  <p className="text-sm font-mono text-slate-400 break-all select-all">
                    https://api.delonix.run/deployments/mock-url
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">ID del Experimento Origen</p>
                  <p className="text-sm font-mono text-slate-400 break-all select-all">
                    esperando-enlace-backend
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};