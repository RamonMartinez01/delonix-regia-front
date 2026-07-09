// src/features/validation/routes/VHubDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProjects } from '../../projects/api/getProjects';
import { ShieldCheck, Inbox, AlertCircle, ArrowRight } from 'lucide-react';

export const VHubDashboard = () => {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['vhub-projects'],
    queryFn: getProjects,
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Cabecera Editorial */}
      <header className="mb-10">
        <h2 className="text-3xl font-bold font-display text-[#111111] mb-2 tracking-tight">Mis Proyectos Asignados</h2>
        <p className="text-[#5A5855] font-medium">Selecciona un proyecto para acceder a la arena de pruebas y evaluar el modelo.</p>
      </header>
      
      {/* Estado: Cargando */}
      {isLoading && (
        <div className="p-16 flex flex-col items-center justify-center text-[#5A5855] bg-white border border-[#EAEAE8] rounded-2xl shadow-sm">
          <div className="w-8 h-8 border-2 border-[#EAEAE8] border-t-brand-primary rounded-full animate-spin mb-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A19A] animate-pulse">Obteniendo accesos seguros...</span>
        </div>
      )}

      {/* Estado: Error */}
      {isError && (
        <div className="p-6 bg-brand-surface border border-brand-accent rounded-2xl flex items-center gap-3 text-[#D46077] shadow-sm">
          <AlertCircle size={20} strokeWidth={2.5} />
          <p className="font-bold text-sm">Hubo un problema de conexión. Por favor, recarga la página e intenta de nuevo.</p>
        </div>
      )}

      {/* Estado: Vacío (Sin asignaciones) */}
      {!isLoading && !isError && projects?.length === 0 && (
        <div className="p-16 border-2 border-dashed border-[#D1D1CD] rounded-2xl flex flex-col items-center justify-center text-[#A1A19A] bg-white">
          <Inbox size={48} strokeWidth={1.5} className="mb-4 text-[#D1D1CD]" />
          <p className="font-bold font-display text-[#111111] text-lg">Bandeja Vacía</p>
          <p className="text-[#5A5855] text-sm font-medium mt-1">Aún no tienes proyectos asignados en este espacio de trabajo.</p>
        </div>
      )}

      {/* Estado: Éxito (El Grid de Proyectos) */}
      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              to={`/v-hub/project/${project.id}`}
              className="group bg-white border border-[#EAEAE8] rounded-2xl p-6 hover:border-[#D1D1CD] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col h-full outline-none"
            >
              
              {/* Encabezado de la Tarjeta */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#F7F7F5] border border-[#D1D1CD] flex items-center justify-center text-[#111111] font-bold font-display text-lg group-hover:bg-brand-surface group-hover:border-brand-primary group-hover:text-brand-primary transition-colors">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                
                {/* Placa de Autorización (Verde Salvia) */}
                <span className="flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1.5 bg-role-validator/10 text-role-validator rounded-md border border-role-validator/20 uppercase tracking-widest">
                  <ShieldCheck size={12} strokeWidth={2.5} /> Acceso Concedido
                </span>
              </div>
              
              {/* Cuerpo de la Tarjeta */}
              <h3 className="text-xl font-bold font-display text-[#111111] mb-2 group-hover:text-brand-primary transition-colors">
                {project.name}
              </h3>
              
              <p className="text-[#5A5855] text-sm line-clamp-2 mb-6 grow font-medium">
                {project.description || 'Sin descripción proporcionada.'}
              </p>
              
              {/* Pie de la Tarjeta (Affordance táctil) */}
              <div className="mt-auto pt-4 border-t border-[#EAEAE8] flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#A1A19A] group-hover:text-brand-primary transition-colors">
                <span>Ingresar a evaluación</span>
                <div className="w-6 h-6 rounded-full bg-[#F7F7F5] group-hover:bg-brand-primary flex items-center justify-center transition-colors">
                  <ArrowRight size={12} strokeWidth={3} className="text-[#A1A19A] group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};