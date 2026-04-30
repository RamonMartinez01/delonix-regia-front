// src/features/experiments/routes/ExperimentDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useExperiment } from '../api/getExperimentsById';
import { CreateDeploymentModal } from '../../deployments/components/CreateDeploymentModal';

export const ExperimentDetail = () => {
  const { projectId, experimentId } = useParams();
  const navigate = useNavigate();
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // ESCUDO TYPESCRIPT (Type Guard)
  if (!projectId || !experimentId) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-red-400">
        Error de navegación: algo salió mal en tu ruta de navegación.
      </div>
    );
  }

  // 1. CONSUMO DEL GANCHO DE RED (RADAR ACTIVO)
  const { data: experiment, isLoading, error } = useExperiment(experimentId);

  // Estado de carga (Aquí 'experiment' es undefined, entonces no renderizamos el resto)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // El Type Guard: 
  // Evaluamos '!experiment' para asegurarnos de que el objeto llegó a salvo.
  if (error || !experiment) {
    return (
      <div className="p-6 text-center text-slate-400 bg-slate-950 h-screen">
        <p>Error al sintonizar la frecuencia del experimento o datos corruptos.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-emerald-500 underline">Volver al puerto</button>
      </div>
    );
  }

    // Ayudante visual para los estados
  const statusConfig = {
    queued: { color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'En Cola', icon: '⏳' },
    processing: { color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Entrenando', icon: '⚙️' },
    completed: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Completado', icon: '✅' },
    failed: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Fallido', icon: '💥' },
  };

  const currentStatus = statusConfig[experiment.status];
  const hasDeployments = experiment.deployments.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <nav className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => navigate(`/projects/${projectId}`)}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400"
        >
          Regresar a experimentos
        </button>
        <div className="h-4 w-px bg-slate-800"></div>
        <span className="text-sm text-slate-500">Proyectos / {projectId.slice(0,8)} / Experimento</span>
      </nav>

      {/* ZONA 1: CABECERA (ESTATUS Y ACCIÓN) */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {experiment.name || 'Sin nombre'}
            </h1>
            <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-emerald-400">
              v{experiment.version}
            </span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentStatus.bg} ${currentStatus.color}`}>
            <span>{currentStatus.icon}</span>
            {currentStatus.label}
          </div>
        </div>

        <div className="flex gap-3">
          {experiment.status === 'completed' && (
            <>
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm font-medium transition-all">
                <i className="fa-solid fa-code-fork mr-2"></i> Bifurcar
              </button>
              
              {hasDeployments ? (
                <button 
                  onClick={() => navigate(`/projects/${projectId}/deployments/${experiment.deployments[0].id}`)}
                  className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 rounded-lg text-sm font-medium transition-all"
                >
                  <i className="fa-solid fa-eye mr-2"></i> Ver Despliegue
                </button>
              ) : (
                <button 
                  onClick={() => setIsDeployModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-900/20"
                >
                  <i className="fa-solid fa-rocket mr-2"></i> Promover a UAT
                </button>
              )}
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ZONA 2: ADN DEL MODELO (IZQUIERDA) */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <i className="fa-solid fa-dna text-emerald-500"></i> Configuración Técnica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Arquitectura Base</label>
                  <code className="text-sm text-blue-400 bg-blue-500/5 px-2 py-1 rounded">{experiment.model_source_uri}</code>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Tarea (Task Type)</label>
                  <span className="text-sm text-slate-300 capitalize">{experiment.task_type.replace('_', ' ')}</span>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Linaje / Ascendencia</label>
                  {experiment.parent_id ? (
                    <Link to={`/projects/${projectId}/experiments/${experiment.parent_id}`} className="text-sm text-emerald-500 hover:underline">
                      Hijo de: {experiment.parent_id.slice(0,8)}...
                    </Link>
                  ) : (
                    <span className="text-sm text-slate-500 italic">Modelo Raíz</span>
                  )}
                </div>
              </div>

              <div className="space-y-4 border-l border-slate-800 pl-8">
                <h4 className="text-xs font-bold text-slate-600 uppercase">Hiperparámetros</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(experiment.hyperparameters || {}).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-[10px] text-slate-500 block uppercase">{key}</span>
                      <span className="text-sm font-mono text-slate-300">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ZONA 4: SANDBOX (INFERENCIA) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[300px] flex flex-col">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
              <i className="fa-solid fa-vial text-emerald-500 mr-2"></i> Inference Sandbox
            </h3>
            {experiment.status === 'completed' ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl">⚡</div>
                <div>
                  <p className="text-slate-300 font-medium">Arena Listas para Pruebas</p>
                  <p className="text-slate-500 text-sm max-w-xs mt-1">
                    Inyecta datos para validar la clasificación de {experiment.name} antes de liberarlo.
                  </p>
                </div>
                <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors border border-slate-700">
                  Abrir Consola de Inferencia
                </button>
              </div>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-600 italic text-sm">
                Esperando a que el artefacto sea forjado para habilitar pruebas...
              </div>
            )}
          </div>
        </section>

        {/* ZONA 3: BOTÍN DE LA GPU (DERECHA) */}
        <aside className="space-y-6">
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-6 shadow-xl shadow-emerald-950/20">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center justify-between">
              Métricas Finales
              <i className="fa-solid fa-chart-simple text-emerald-500"></i>
            </h3>

            {experiment.metrics ? (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400">Accuracy</span>
                    <span className="text-emerald-400 font-bold">{((experiment.metrics.accuracy || 0) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(experiment.metrics.accuracy || 0) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400">F1 Score</span>
                    <span className="text-blue-400 font-bold">{((experiment.metrics.f1_score || 0) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(experiment.metrics.f1_score || 0) * 100}%` }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Loss</span>
                    {/* Al ser solo texto, el || 'N/A' lo protege visualmente */}
                    <span className="text-sm font-mono text-amber-500">{experiment.metrics.loss || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">GPU Time</span>
                    <span className="text-sm font-mono text-slate-300">{experiment.compute_time_seconds || 0}s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="text-3xl animate-pulse mb-2">📡</div>
                <p className="text-xs text-slate-500">Sintonizando telemetría del entrenamiento...</p>
              </div>
            )}
          </div>

          {/* Tarjeta de Artefacto */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-4">Ubicación del Artefacto</h4>
            <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg border border-slate-800">
              <i className="fa-solid fa-box-archive text-slate-500"></i>
              <span className="text-[10px] font-mono text-slate-400 truncate">
                {experiment.artifact_uri || 'Pendiente de almacenamiento...'}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL DE DESPLIEGUE */}
     {isDeployModalOpen && (
        <CreateDeploymentModal
          projectId={projectId}
          experimentId={experimentId}
          onClose={() => setIsDeployModalOpen(false)}
          onSuccess={() => {
            setIsDeployModalOpen(false); // Cerramos las compuertas del modal
            console.log("¡Despliegue forjado exitosamente!");
            // Nota táctica: Como React Query re-consulta los datos (o lo hará pronto), 
            // el botón de la cabecera cambiará mágicamente a "Ver Despliegue".
          }}
        />
      )}
    </div>
  );
};