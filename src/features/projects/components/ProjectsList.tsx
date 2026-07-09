// src/features/projects/components/ProjectsList.tsx
import { useProjects } from '../api/getProjects';
import { ProjectCard } from './ProjectCard';
import { AlertCircle, FolderOpen } from 'lucide-react'; // Inyectamos iconografía táctil

// 1. El Esqueleto: La ilusión de un plano arquitectónico en papel
const ProjectSkeleton = () => (
  <div className="bg-white border border-[#EAEAE8] rounded-2xl p-6 shadow-sm animate-pulse flex flex-col h-full">
    <div className="h-6 bg-[#EAEAE8] rounded-md w-3/4 mb-5"></div>
    <div className="h-3 bg-[#F7F7F5] rounded-md w-full mb-2"></div>
    <div className="h-3 bg-[#F7F7F5] rounded-md w-5/6 mb-6 grow"></div>
    
    <div className="pt-5 border-t border-[#EAEAE8] flex justify-between mt-auto">
      <div className="h-4 bg-[#F7F7F5] rounded-md w-16"></div>
      <div className="h-4 bg-[#F7F7F5] rounded-md w-24"></div>
    </div>
  </div>
);

// 2. El Contenedor Estratégico
export const ProjectsList = () => {
  const { data: projects, isLoading, isError } = useProjects();

  // Escenario A: Los datos están viajando por la red
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => <ProjectSkeleton key={i} />)}
      </div>
    );
  }

  // Escenario B: La red falló o el JWT caducó
  if (isError) {
    return (
      <div className="p-8 bg-brand-surface border border-brand-accent rounded-2xl text-center shadow-sm flex flex-col items-center justify-center space-y-2">
        <div className="p-2 bg-white rounded-full border border-brand-accent mb-2 shadow-sm">
          <AlertCircle className="text-[#D46077]" size={24} strokeWidth={2.5} />
        </div>
        <p className="font-bold font-display text-[#111111] text-lg">Error de Telemetría</p>
        <p className="text-sm font-medium text-[#D46077]">
          No se pudo contactar con los servidores de la infraestructura base.
        </p>
      </div>
    );
  }

  // Escenario C: Conexión exitosa, pero la base de datos está vacía
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center p-16 bg-white border-2 border-dashed border-[#D1D1CD] rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-[#F7F7F5] border border-[#EAEAE8] flex items-center justify-center text-[#A1A19A] shadow-sm mb-2">
          <FolderOpen size={24} strokeWidth={2} />
        </div>
        <p className="text-[#111111] font-bold font-display text-lg">Área de Trabajo Despejada</p>
        <p className="text-sm font-medium text-[#5A5855]">
          No hay proyectos de Machine Learning desplegados en este sector.
        </p>
      </div>
    );
  }

  // Escenario D: Éxito total. Renderizamos la cuadrícula real.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};