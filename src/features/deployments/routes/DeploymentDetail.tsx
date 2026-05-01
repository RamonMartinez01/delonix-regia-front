import { useDeployment } from '../api/getDeployment';
import { InferenceArena } from '../../validation/components/InferenceArena';
import { FeedbackHistory } from '../../validation/components/FeedbackHistory';

// 1. DESACOPLAMIENTO DE RUTAS
interface DeploymentDetailProps {
  deploymentId: string;
}

export const DeploymentDetail = ({ deploymentId }: DeploymentDetailProps) => {
  const { data: deployment, isLoading, isError } = useDeployment(deploymentId);

  // 2. ESCUDOS REDIMENSIONADOS
  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400">
        Sincronizando con la bóveda...
      </div>
    );
  }

  if (isError || !deployment) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center text-red-400 bg-slate-900/50 rounded-2xl border border-slate-800 p-6 text-center">
        Error: Escaparate UAT no localizado o desconectado.
      </div>
    );
  }

  // 3. CONTENEDOR FLOTANTE Y DISEÑO COMPRIMIDO
  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl text-slate-200 p-6 lg:p-8 font-sans animate-in fade-in duration-300">
      
      {/* Cabecera de Ingeniería */}
      <header className="mb-8 border-b border-slate-800/60 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{deployment.name}</h1>
          <p className="text-slate-400 mt-1 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
            <i className="fa-solid fa-fingerprint text-slate-600"></i> Hash: {deployment.id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {deployment.store_prompts && (
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <i className="fa-solid fa-database"></i> Bucle Activo
            </span>
          )}
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
          <section>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-vial text-emerald-500"></i> Laboratorio de Inferencia
            </h2>
            <InferenceArena 
              deployment={deployment} 
              projectDescription="Modo Ingeniero: Valida la respuesta del modelo antes de la auditoría externa."
            />
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-users-viewfinder text-blue-400"></i> Auditoría de Stakeholders
            </h2>
            <FeedbackHistory deploymentId={deployment.id} />
          </section>
        </div>

        {/* Columna de Metadatos Tácticos */}
        <aside className="space-y-6">
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 shadow-xl shadow-emerald-950/20">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Configuración UAT</h2>
            <div className="space-y-5">
              
              {/* Entorno e Inferencia */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Hardware</p>
                  <p className="text-xs font-mono text-emerald-400">
                    {deployment.hardware_target === 'shared_cpu' ? 'Shared CPU' : deployment.hardware_target?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Umbral Confianza</p>
                  <p className="text-xs font-mono text-blue-400">
                    {Math.round((deployment.confidence_threshold || 0.65) * 100)}%
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Punto de Enlace (Endpoint)</p>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                  <p className="text-xs font-mono text-slate-400 truncate flex-1 select-all">
                    {deployment.endpoint_url || 'Pendiente...'}
                  </p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(deployment.endpoint_url || '')}
                    className="text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    <i className="fa-regular fa-copy"></i>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Instrucciones al Validador</p>
                <p className="text-xs text-slate-400 italic bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                  "{deployment.instructions}"
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};