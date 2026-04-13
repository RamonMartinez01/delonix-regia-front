// src/features/deployments/routes/DeploymentDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useDeployment } from '../api/getDeployment';

export const DeploymentDetail = () => {
  const { projectId, deploymentId } = useParams<{ projectId: string; deploymentId: string }>();
  const navigate = useNavigate();

  // 2. Ejecutamos la llamada a la red
  const { data: deployment, isLoading, isError } = useDeployment(deploymentId || '');

  if (!projectId || !deploymentId) return null;

  // Manejo de estados de transición
  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 p-8 flex justify-center text-slate-400">Desencriptando datos del escaparate...</div>;
  }

  if (isError || !deployment) {
    return <div className="min-h-screen bg-slate-900 p-8 flex justify-center text-red-400">Error crítico: No se pudo localizar el despliegue en la bóveda.</div>;
  }

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

        {/* 👇 INYECCIÓN 1: Cabecera con datos reales */}
        <header className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{deployment.name}</h1>
            <p className="text-slate-400 mt-1 font-mono text-sm uppercase tracking-tighter">
              ID: {deployment.id}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wider ${
            deployment.status === 'active' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
              : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
          }`}>
            {deployment.status === 'active' ? 'Activo' : 'Detenido'}
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* El Espejo y La Cosecha (Se mantienen igual por ahora) */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-400 mb-2">El Espejo (Preview)</h2>
              <p className="text-sm text-slate-400 mb-4">Interactúa con el modelo exactamente como lo verá el Stakeholder.</p>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-4">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Instrucciones configuradas:</h3>
                <p className="text-slate-400 text-sm italic border-l-2 border-slate-600 pl-3">"{deployment.instructions}"</p>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 flex items-center justify-center min-h-[150px]">
                <span className="text-slate-500 text-sm italic">Componente de Sandbox en construcción...</span>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-emerald-400 mb-2">Feedback</h2>
              <p className="text-sm text-slate-400 mb-4">Calificaciones y correcciones realizadas por los usuarios (Ground Truth).</p>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 flex items-center justify-center min-h-[150px]">
                <span className="text-slate-500 text-sm italic">Tabla de retroalimentación en construcción...</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* Control de Accesos (Mockeado con la nueva lógica explicada) */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-400 mb-2">Stakeholders (Workspace)</h2>
              <p className="text-sm text-slate-400 mb-4">
                Miembros del workspace con acceso a las vitrinas.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 bg-slate-900 p-3 rounded-lg border border-slate-700">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">AZ</div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-200">Azul (Cliente)</p>
                    <p className="text-xs text-slate-500">MEMBER</p>
                  </div>
                </li>
              </ul>
              <button className="w-full mt-4 py-2 border border-slate-600 rounded-lg text-slate-300 text-sm hover:bg-slate-700 hover:text-white transition-colors">
                Invitar al Workspace
              </button>
            </div>

            {/* 👇 INYECCIÓN 2: Detalles Técnicos Reales */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-slate-300 mb-4">Detalles de Infraestructura</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">URL de Inferencia Pública</p>
                  <p className="text-sm font-mono text-slate-400 break-all select-all">
                    {deployment.endpoint_url || 'Generando endpoint...'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">ID del Experimento Origen</p>
                  <p className="text-sm font-mono text-slate-400 break-all select-all">
                    {deployment.experiment_id || 'Huérfano (Experimento eliminado)'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Fecha de Forja</p>
                  <p className="text-sm text-slate-400">
                    {new Date(deployment.created_at).toLocaleString()}
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