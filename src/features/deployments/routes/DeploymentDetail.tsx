// src/features/deployments/routes/DeploymentDetail.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useDeployment } from '../api/getDeployment';
import { InferenceArena } from '../../validation/components/InferenceArena';
import { FeedbackHistory } from '../../validation/components/FeedbackHistory';

export const DeploymentDetail = () => {
  const { projectId, deploymentId } = useParams<{ projectId: string; deploymentId: string }>();
  const navigate = useNavigate();

  const { data: deployment, isLoading, isError } = useDeployment(deploymentId || '');

  if (!projectId || !deploymentId) return null;

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 p-8 flex justify-center text-slate-400">Sincronizando con la bóveda...</div>;
  }

  if (isError || !deployment) {
    return <div className="min-h-screen bg-slate-900 p-8 flex justify-center text-red-400">Error: Despliegue no localizado.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Navegación Superior */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(`/projects/${projectId}`)}
            className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">&larr;</span> 
            Volver al Proyecto
          </button>
        </div>

        {/* Cabecera de Ingeniería */}
        <header className="mb-8 border-b border-slate-800 pb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{deployment.name}</h1>
            <p className="text-slate-400 mt-1 font-mono text-sm uppercase tracking-tighter">
              Deployment Hash: {deployment.id}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              deployment.status === 'active' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              {deployment.status === 'active' ? '● En Línea' : '○ Desconectado'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna de Operaciones (Sandbox y Auditoría) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Arena de Inferencia: El Espejo de Penélope */}
            <section>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Laboratorio de Inferencia (Sandbox)</h2>
              <InferenceArena 
                deployment={deployment} 
                projectDescription="Modo Ingeniero: Valida la respuesta del modelo antes de la auditoría externa."
              />
            </section>

            {/* Historial de Feedback: La Cosecha de Azul */}
            <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Auditoría de Stakeholders (Feedback)</h2>
              <p className="text-sm text-slate-400 mb-6">
                Monitorea las correcciones y aprobaciones enviadas por los validadores en tiempo real.
              </p>
              <FeedbackHistory deploymentId={deployment.id} />
            </section>
          </div>

          {/* Columna de Metadatos Tácticos */}
          <aside className="space-y-8">
            
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Perfil Técnico del Despliegue</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Punto de Enlace (API Endpoint)</p>
                  <p className="text-xs font-mono text-emerald-500/80 break-all select-all bg-slate-950 p-2 rounded border border-slate-800">
                    {deployment.endpoint_url || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Experimento de Origen</p>
                  <p className="text-xs font-mono text-slate-400">
                    {deployment.experiment_id}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Instrucciones al Validador</p>
                  <p className="text-xs text-slate-400 italic leading-relaxed">
                    "{deployment.instructions}"
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Timestamp de Creación</p>
                  <p className="text-xs text-slate-400">
                    {new Date(deployment.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Status de Salud del Despliegue (Visualizador Sugerido) */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-emerald-400 mb-2">Estado de Salud</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[100%]"></div>
                </div>
                <span className="text-[10px] font-mono text-emerald-500">100% OK</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-3 leading-tight">
                El contenedor está respondiendo correctamente a los heartbeats del sistema.
              </p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};