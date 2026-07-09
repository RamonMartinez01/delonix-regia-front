// src/features/experiments/routes/ExperimentDetail.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExperiment } from '../api/getExperimentsById';
import { CreateDeploymentModal } from '../../deployments/components/CreateDeploymentModal';
import { ForkExperimentModal } from '../components/ForkExperimentModal';
import { 
  Hourglass, Settings, CheckCircle2, AlertTriangle, 
  GitFork, Eye, Rocket, Dna, Terminal, BarChart3, Archive, Activity 
} from 'lucide-react'; // Erradicamos FontAwesome y Emojis

interface ExperimentDetailProps {
  projectId: string;
  experimentId: string;
}

export const ExperimentDetail = ({ projectId, experimentId }: ExperimentDetailProps) => {
  const navigate = useNavigate();
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isForkModalOpen, setIsForkModalOpen] = useState(false);

  // ESCUDO TYPESCRIPT
  if (!projectId || !experimentId) {
    return (
      <div className="flex h-64 items-center justify-center bg-brand-surface border border-brand-accent rounded-2xl text-[#D46077] font-medium shadow-sm">
        <AlertTriangle className="mr-2" size={20} />
        Error de navegación: faltan coordenadas en la ruta.
      </div>
    );
  }

  const { data: experiment, isLoading, error } = useExperiment(experimentId);

  // Estado de carga estructurado
  if (isLoading) {
    return (
      <div className="flex min-h-125 flex-col items-center justify-center bg-white rounded-2xl border border-[#EAEAE8] shadow-sm">
        <div className="w-8 h-8 border-2 border-[#EAEAE8] border-t-brand-primary rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A19A] animate-pulse">Sintonizando telemetría...</span>
      </div>
    );
  }

  // Type Guard y Error
  if (error || !experiment) {
    return (
      <div className="flex min-h-125 flex-col items-center justify-center text-[#D46077] bg-brand-surface rounded-2xl border border-brand-accent p-6 text-center shadow-sm">
        <AlertTriangle size={32} strokeWidth={1.5} className="mb-3" />
        <p className="font-bold font-display text-lg">Señal Perdida</p>
        <p className="text-sm font-medium mt-1">Error al sintonizar la frecuencia del experimento o datos corruptos.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-white border border-[#D1D1CD] text-[#111111] font-bold text-sm rounded-lg hover:bg-[#F7F7F5] transition-all shadow-sm active:scale-95">
          Volver al puerto
        </button>
      </div>
    );
  }

  // Diccionario Visual Editorial para Estados
  const statusConfig = {
    queued: { color: 'text-[#5A5855]', bg: 'bg-[#F7F7F5] border-[#EAEAE8]', label: 'En Cola', Icon: Hourglass },
    processing: { color: 'text-[#4B5E72]', bg: 'bg-[#4B5E72]/10 border-[#4B5E72]/20', label: 'Entrenando', Icon: Settings },
    completed: { color: 'text-[#6B7A64]', bg: 'bg-[#6B7A64]/10 border-[#6B7A64]/20', label: 'Completado', Icon: CheckCircle2 },
    failed: { color: 'text-[#D46077]', bg: 'bg-[#FFF5F7] border-[#F3BAC9]', label: 'Fallido', Icon: AlertTriangle },
  };

  const currentStatus = statusConfig[experiment.status];
  const hasDeployments = experiment.deployments.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#EAEAE8] shadow-sm text-[#111111] p-6 lg:p-8 animate-in fade-in duration-300">
      
      {/* ZONA 1: CABECERA TÁCTIL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-[#EAEAE8] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-[#111111]">
              {experiment.name || 'Sin nombre'}
            </h1>
            <span className="px-2.5 py-1 bg-[#F7F7F5] border border-[#EAEAE8] rounded-md text-[10px] font-bold font-mono text-[#5A5855] tracking-widest">
              v{experiment.version}
            </span>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase tracking-widest ${currentStatus.bg} ${currentStatus.color}`}>
            <currentStatus.Icon size={14} strokeWidth={2.5} className={experiment.status === 'processing' ? 'animate-spin' : ''} />
            {currentStatus.label}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {experiment.status === 'completed' && (
            <>
              {/* Botón Ghost (Acción Secundaria) */}
              <button 
                onClick={() => setIsForkModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl text-[#5A5855] hover:text-[#111111] text-sm font-bold transition-all shadow-sm active:scale-95"
              >
                <GitFork size={16} strokeWidth={2.5} /> Bifurcar
              </button>
              
              {hasDeployments ? (
                /* Botón Éxito (Acción de Enlace) */
                <button 
                  onClick={() => navigate(`/projects/${projectId}/deployments/${experiment.deployments[0].id}`)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D1D1CD] text-[#111111] hover:text-brand-primary hover:border-brand-accent rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 group"
                >
                  <Eye size={16} strokeWidth={2.5} className="text-[#A1A19A] group-hover:text-brand-primary transition-colors" /> Ver Despliegue
                </button>
              ) : (
                /* Botón Primario de Marca */
                <button 
                  onClick={() => setIsDeployModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-[#D46077] text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                  <Rocket size={16} strokeWidth={2.5} /> Promover a UAT
                </button>
              )}
            </>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ZONA 2: ADN DEL MODELO (IZQUIERDA) */}
        <section className="lg:col-span-2 space-y-8">
          
          {/* Ficha Técnica Impresa */}
          <div className="bg-[#F7F7F5] border border-[#EAEAE8] rounded-2xl p-6 lg:p-8">
            <h3 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Dna size={14} strokeWidth={2.5} className="text-[#111111]" /> Configuración Técnica
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest block mb-1.5 ml-1">Arquitectura Base</label>
                  <code className="block text-xs font-bold text-[#5A5855] font-mono bg-white border border-[#D1D1CD] px-3 py-2 rounded-lg shadow-inner truncate">
                    {experiment.model_source_uri}
                  </code>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest block mb-1.5 ml-1">Tarea (Task Type)</label>
                  <span className="block text-sm font-bold text-[#111111] bg-white border border-[#EAEAE8] px-3 py-2 rounded-lg capitalize">
                    {experiment.task_type.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest block mb-1.5 ml-1">Linaje / Ascendencia</label>
                  {experiment.parent_id ? (
                    <Link to={`/projects/${projectId}/experiments/${experiment.parent_id}`} className="block text-sm font-bold text-brand-primary hover:underline bg-white border border-[#EAEAE8] px-3 py-2 rounded-lg">
                      Hijo de: <span className="font-mono text-xs">{experiment.parent_id.slice(0,8)}</span>...
                    </Link>
                  ) : (
                    <span className="block text-sm font-medium text-[#A1A19A] italic bg-white border border-[#EAEAE8] px-3 py-2 rounded-lg">
                      Modelo Raíz (Génesis)
                    </span>
                  )}
                </div>
              </div>

              {/* Hiperparámetros */}
              <div className="space-y-4 md:border-l border-[#D1D1CD] md:pl-8">
                <h4 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest ml-1">Hiperparámetros</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(experiment.hyperparameters || {}).map(([key, val]) => (
                    <div key={key} className="bg-white border border-[#EAEAE8] p-3 rounded-lg shadow-sm">
                      <span className="text-[9px] text-[#A1A19A] font-bold block uppercase tracking-widest mb-1">{key}</span>
                      <span className="text-sm font-bold font-mono text-role-engineer">{val as React.ReactNode}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ZONA 4: SANDBOX (INFERENCIA) */}
          <div className="bg-white border border-[#EAEAE8] rounded-2xl p-6 lg:p-8 min-h-75 flex flex-col shadow-sm">
             <h3 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Terminal size={14} strokeWidth={2.5} className="text-[#111111]" /> Inference Sandbox
            </h3>
            
            {experiment.status === 'completed' ? (
              <div className="grow flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-[#F7F7F5] border border-[#D1D1CD] rounded-full flex items-center justify-center shadow-sm">
                  <Activity size={24} strokeWidth={2.5} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-[#111111] font-bold font-display text-lg">Arena Lista para Pruebas</p>
                  <p className="text-[#5A5855] text-sm font-medium max-w-sm mt-1">
                    Inyecta datos para validar la clasificación de <span className="font-bold">{experiment.name}</span> antes de promoverlo a UAT.
                  </p>
                </div>
                <button className="px-5 py-2.5 mt-2 bg-white border border-[#D1D1CD] hover:bg-[#F7F7F5] hover:text-brand-primary text-[#111111] font-bold rounded-xl text-sm transition-all shadow-sm active:scale-95">
                  Abrir Consola de Inferencia
                </button>
              </div>
            ) : (
              /* Troquelado físico para estado pendiente */
              <div className="grow flex items-center justify-center border-2 border-dashed border-[#D1D1CD] bg-[#F7F7F5] rounded-xl text-[#A1A19A] font-medium text-sm">
                Esperando a que el artefacto sea forjado para habilitar pruebas...
              </div>
            )}
          </div>
        </section>

        {/* ZONA 3: BOTÍN DE LA GPU (DERECHA) - MÉTRICAS EDITORIALES */}
        <aside className="space-y-6">
          <div className="bg-[#F7F7F5] border border-[#EAEAE8] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-6 flex items-center justify-between">
              Métricas Finales
              <BarChart3 size={16} strokeWidth={2.5} className="text-[#111111]" />
            </h3>

            {experiment.metrics ? (
              <div className="space-y-6">
                
                {/* Accuracy Bar - Verde Salvia Mate */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-[#5A5855] uppercase tracking-widest">Accuracy</span>
                    <span className="text-sm font-bold font-mono text-role-validator">{((experiment.metrics.accuracy || 0) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-white border border-[#EAEAE8] rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-role-validator rounded-full transition-all duration-1000" style={{ width: `${(experiment.metrics.accuracy || 0) * 100}%` }}></div>
                  </div>
                </div>

                {/* F1 Score Bar - Azul Pizarra */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-bold text-[#5A5855] uppercase tracking-widest">F1 Score</span>
                    <span className="text-sm font-bold font-mono text-role-engineer">{((experiment.metrics.f1_score || 0) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="h-2 bg-white border border-[#EAEAE8] rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-role-engineer rounded-full transition-all duration-1000" style={{ width: `${(experiment.metrics.f1_score || 0) * 100}%` }}></div>
                  </div>
                </div>

                {/* Métricas Secundarias */}
                <div className="pt-5 border-t border-[#D1D1CD] grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#EAEAE8] p-3 rounded-lg shadow-sm">
                    <span className="text-[9px] font-bold text-[#A1A19A] uppercase tracking-widest block mb-1">Loss</span>
                    <span className="text-sm font-bold font-mono text-[#D46077]">{experiment.metrics.loss || 'N/A'}</span>
                  </div>
                  <div className="bg-white border border-[#EAEAE8] p-3 rounded-lg shadow-sm">
                    <span className="text-[9px] font-bold text-[#A1A19A] uppercase tracking-widest block mb-1">GPU Time</span>
                    <span className="text-sm font-bold font-mono text-[#111111]">{experiment.compute_time_seconds || 0}s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-10 h-10 border-2 border-[#D1D1CD] border-t-[#A1A19A] rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest">Sintonizando telemetría...</p>
              </div>
            )}
          </div>

          {/* Tarjeta de Artefacto */}
          <div className="bg-white border border-[#EAEAE8] rounded-2xl p-6 shadow-sm">
            <h4 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-4">Ubicación del Artefacto</h4>
            <div className="flex items-center gap-3 bg-[#F7F7F5] p-3 rounded-xl border border-[#D1D1CD] shadow-inner">
              <Archive size={16} strokeWidth={2.5} className="text-[#A1A19A] shrink-0" />
              <span className="text-[10px] font-bold font-mono text-[#5A5855] truncate select-all">
                {experiment.artifact_uri || 'Pendiente de empaquetado...'}
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
          onSuccess={() => setIsDeployModalOpen(false)}
        />
      )}

      {/* MODAL DE BIFURCACIÓN */}
      <ForkExperimentModal
        isOpen={isForkModalOpen}
        onClose={() => setIsForkModalOpen(false)}
        projectId={projectId}
        experimentId={experiment.id}
        experimentName={experiment.name || 'Sin nombre'}
      />
    </div>
  );
};