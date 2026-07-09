// src/features/deployments/routes/DeploymentDetail.tsx
import { useDeployment } from '../api/getDeployment';
import { InferenceArena } from '../../validation/components/InferenceArena';
import { FeedbackHistory } from '../../validation/components/FeedbackHistory';
import { 
  Fingerprint, Database, Activity, Terminal, 
  Users, Settings, Cpu, Sliders, Link2, Copy, AlertTriangle 
} from 'lucide-react'; // Reemplazamos FontAwesome por iconografía física

interface DeploymentDetailProps {
  deploymentId: string;
}

export const DeploymentDetail = ({ deploymentId }: DeploymentDetailProps) => {
  const { data: deployment, isLoading, isError } = useDeployment(deploymentId);

  // 1. ESCUDO DE CARGA ESTRUCTURADO
  if (isLoading) {
    return (
      <div className="flex min-h-125 flex-col items-center justify-center bg-white rounded-2xl border border-[#EAEAE8] shadow-sm">
        <div className="w-8 h-8 border-2 border-[#EAEAE8] border-t-brand-primary rounded-full animate-spin mb-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A19A] animate-pulse">
          Sincronizando con la bóveda...
        </span>
      </div>
    );
  }

  // 2. ESCUDO DE ERROR EDITORIAL
  if (isError || !deployment) {
    return (
      <div className="flex min-h-125 flex-col items-center justify-center text-[#D46077] bg-brand-surface rounded-2xl border border-brand-accent p-6 text-center shadow-sm">
        <AlertTriangle size={32} strokeWidth={1.5} className="mb-3" />
        <p className="font-bold font-display text-lg">Señal Perdida</p>
        <p className="text-sm font-medium mt-1">Error: Escaparate UAT no localizado o desconectado.</p>
      </div>
    );
  }

  // 3. CONTENEDOR MAESTRO
  return (
    <div className="bg-white rounded-2xl border border-[#EAEAE8] shadow-sm text-[#111111] p-6 lg:p-8 font-sans animate-in fade-in duration-300">
      
      {/* Cabecera de Ingeniería Táctil */}
      <header className="mb-8 border-b border-[#EAEAE8] pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-[#111111] tracking-tight">{deployment.name}</h1>
          <p className="text-[#A1A19A] mt-2 font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
            <Fingerprint size={12} strokeWidth={2.5} /> Hash: {deployment.id.split('-')[0]}...
          </p>
        </div>
        
        {/* Placas de Estado (Badges) */}
        <div className="flex flex-wrap items-center gap-3">
          {deployment.store_prompts && (
            <span className="px-2.5 py-1.5 bg-role-engineer/10 text-role-engineer border border-role-engineer/20 rounded-md text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Database size={12} strokeWidth={2.5} /> Bucle Activo
            </span>
          )}
          <span className={`px-2.5 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
            deployment.status === 'active' 
              ? 'bg-role-engineer/10 text-role-validator border-role-validator/20' 
              : 'bg-[#F7F7F5] text-[#A1A19A] border-[#EAEAE8]'
          }`}>
            <Activity size={12} strokeWidth={2.5} className={deployment.status === 'active' ? 'animate-pulse' : ''} />
            {deployment.status === 'active' ? 'En Línea' : 'Desconectado'}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna de Operaciones (Sandbox y Auditoría) */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-[#EAEAE8] pb-2">
              <Terminal size={14} strokeWidth={2.5} className="text-[#111111]" /> Laboratorio de Inferencia
            </h2>
            <div className="bg-[#F7F7F5] border border-[#EAEAE8] rounded-xl p-2 shadow-inner">
              <InferenceArena 
                deployment={deployment} 
                projectDescription="Modo Ingeniero: Valida la respuesta del modelo antes de la auditoría externa."
              />
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-5 flex items-center gap-2 border-b border-[#EAEAE8] pb-2">
              <Users size={14} strokeWidth={2.5} className="text-[#111111]" /> Auditoría de Stakeholders
            </h2>
            <div className="bg-white border border-[#EAEAE8] rounded-xl p-4 shadow-sm">
              <FeedbackHistory deploymentId={deployment.id} />
            </div>
          </section>
        </div>

        {/* Columna de Metadatos Tácticos (Derecha) */}
        <aside className="space-y-6">
          <div className="bg-[#F7F7F5] border border-[#EAEAE8] rounded-2xl p-6 shadow-sm">
            <h2 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-6 flex items-center justify-between">
              Configuración UAT
              <Settings size={16} strokeWidth={2.5} className="text-[#111111]" />
            </h2>
            
            <div className="space-y-6">
              
              {/* Entorno e Inferencia */}
              <div className="grid grid-cols-2 gap-4 pb-5 border-b border-[#D1D1CD]">
                <div>
                  <p className="text-[9px] text-[#A1A19A] uppercase font-bold mb-1.5 flex items-center gap-1"><Cpu size={10} /> Hardware</p>
                  <p className="text-sm font-bold font-mono text-[#111111]">
                    {deployment.hardware_target === 'shared_cpu' ? 'Shared CPU' : deployment.hardware_target?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-[#A1A19A] uppercase font-bold mb-1.5 flex items-center gap-1"><Sliders size={10} /> Confianza</p>
                  <p className="text-sm font-bold font-mono text-role-engineer">
                    {Math.round((deployment.confidence_threshold || 0.65) * 100)}%
                  </p>
                </div>
              </div>

              {/* Endpoint (Punto de Enlace) */}
              <div>
                <p className="text-[9px] text-[#A1A19A] uppercase font-bold mb-1.5 flex items-center gap-1">
                  <Link2 size={10} /> Punto de Enlace (Endpoint)
                </p>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#D1D1CD] shadow-inner">
                  <p className="text-[10px] font-bold font-mono text-[#5A5855] truncate flex-1 select-all px-1">
                    {deployment.endpoint_url || 'Pendiente de aprovisionamiento...'}
                  </p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(deployment.endpoint_url || '')}
                    className="p-2 text-[#A1A19A] hover:text-[#111111] hover:bg-[#F7F7F5] rounded-lg transition-all active:scale-95 border border-transparent hover:border-[#D1D1CD]"
                    title="Copiar Endpoint"
                  >
                    <Copy size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Instrucciones del Validador */}
              <div className="pt-2">
                <p className="text-[9px] text-[#A1A19A] uppercase font-bold mb-2">Instrucciones al Validador</p>
                <p className="text-xs font-medium text-[#5A5855] leading-relaxed bg-white p-4 rounded-xl border border-[#D1D1CD] shadow-sm relative before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:bg-[#EAEAE8] before:rounded-r-md">
                  {deployment.instructions}
                </p>
              </div>

            </div>
          </div>
        </aside>
      </div>

    </div>
  );
};