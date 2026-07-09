// src/features/registry/routes/ModelsPage.tsx
import { BrainCircuit, Rocket, ShieldCheck, Database, DraftingCompass } from 'lucide-react';

export const ModelsPage = () => {
  return (
    /* Lienzo base: Blanco puro, asumiendo la estructura del plano */
    <div className="min-h-[85vh] bg-white flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Icono Central: Sello de Astillero (Blueprint) */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-[#F7F7F5] border-2 border-dashed border-[#D1D1CD] rounded-full flex items-center justify-center shadow-inner">
          <BrainCircuit size={40} strokeWidth={1.5} className="text-[#A1A19A]" />
        </div>
        {/* Pequeña insignia física superpuesta */}
        <div className="absolute -bottom-2 -right-2 bg-white border border-[#D1D1CD] p-1.5 rounded-lg shadow-sm text-[#5A5855]">
          <DraftingCompass size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Texto Principal Tipográfico */}
      <div className="max-w-xl space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-black font-display text-[#111111] tracking-tight">
          Model <span className="text-[#A1A19A] font-medium">Registry</span>
        </h1>
        <p className="text-[#5A5855] font-medium text-base md:text-lg leading-relaxed">
          Estamos preparando el entorno blindado donde podrás gestionar, versionar y auditar el linaje de cada modelo en la flota.
        </p>
      </div>

      {/* Grid de Futuras Funcionalidades: Tarjetas de Proyección */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
        {[
          { icon: <Rocket size={18} strokeWidth={2.5} />, title: "Deployment", desc: "Pasa de modelo a API en un clic con infraestructura gestionada." },
          { icon: <ShieldCheck size={18} strokeWidth={2.5} />, title: "Governance", desc: "Control estricto de versiones y políticas de aprobación UAT." },
          { icon: <Database size={18} strokeWidth={2.5} />, title: "Lineage", desc: "Trazabilidad forense total del entrenamiento y los pesos." }
        ].map((item, idx) => (
          <div 
            key={idx} 
            className="p-6 bg-white border border-[#EAEAE8] rounded-2xl flex flex-col items-center text-center space-y-4 group transition-colors hover:border-[#D1D1CD] hover:shadow-sm"
          >
            <div className="w-12 h-12 bg-[#F7F7F5] border border-[#EAEAE8] rounded-xl flex items-center justify-center text-[#A1A19A] group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-all duration-300">
              {item.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111] font-display mb-1.5">{item.title}</h3>
              <p className="text-xs text-[#5A5855] leading-relaxed font-medium">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Badge de Estado: Cinta de plano */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#F7F7F5] border border-[#D1D1CD] rounded-md text-[10px] font-bold text-[#5A5855] uppercase tracking-widest shadow-inner">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A1A19A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5A5855]"></span>
        </div>
        Planos en el Astillero
      </div>
      
    </div>
  );
};