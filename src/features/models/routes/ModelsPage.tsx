import { BrainCircuit, Rocket, ShieldCheck, Database } from 'lucide-react';

export const ModelsPage = () => {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
      
      {/* Icono Central con Efecto de Pulso */}
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <BrainCircuit size={64} className="text-emerald-500" />
        </div>
      </div>

      {/* Texto Principal */}
      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-black text-slate-100 tracking-tight">
          Model <span className="text-emerald-500">Registry</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Estamos preparando el silo donde podrás gestionar, versionar y auditar cada red neuronal de la flota.
        </p>
      </div>

      {/* Grid de Futuras Funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl pt-8">
        {[
          { icon: <Rocket size={20} />, title: "Deployment", desc: "Pasa de modelo a API en un clic." },
          { icon: <ShieldCheck size={20} />, title: "Governance", desc: "Control de versiones y aprobación." },
          { icon: <Database size={20} />, title: "Lineage", desc: "Trazabilidad total del entrenamiento." }
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col items-center space-y-2 group hover:border-emerald-500/50 transition-colors">
            <div className="text-emerald-500 mb-1 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <h3 className="text-sm font-bold text-slate-200">{item.title}</h3>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Badge de Estado */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
        Fase de Construcción Alpha
      </div>
    </div>
  );
};