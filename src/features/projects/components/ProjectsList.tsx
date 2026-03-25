// src/features/projects/components/ProjectsList.tsx
import { useProjects } from '../api/getProjects';
import { ProjectCard } from './ProjectCard';

// 1. El Esqueleto: La ilusión óptica de velocidad
const ProjectSkeleton = () => (
  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg animate-pulse flex flex-col h-full">
    <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-slate-700 rounded w-5/6 mb-6 flex-grow"></div>
    <div className="pt-4 border-t border-slate-700 flex justify-between">
      <div className="h-5 bg-slate-700 rounded w-16"></div>
      <div className="h-4 bg-slate-700 rounded w-20"></div>
    </div>
  </div>
);

// 2. El Contenedor Estratégico
export const ProjectsList = () => {
  // TanStack Query nos entrega el estado en tiempo real
  const { data: projects, isLoading, isError } = useProjects();

  // Escenario A: Los datos están viajando por la red
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Renderizamos 6 esqueletos falsos para rellenar la pantalla */}
        {[...Array(6)].map((_, i) => <ProjectSkeleton key={i} />)}
      </div>
    );
  }

  // Escenario B: La red falló o el JWT caducó de forma imprevista
  if (isError) {
    return (
      <div className="bg-red-900/50 border border-red-500 rounded p-6 text-red-200 text-center">
        <p className="font-bold">Error de Telemetría</p>
        <p className="text-sm mt-1">No se pudo contactar con los servidores de la infraestructura base.</p>
      </div>
    );
  }

  // Escenario C: Conexión exitosa, pero la base de datos está vacía
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-800 border border-slate-700 rounded-xl shadow-lg border-dashed">
        <p className="text-slate-400">No hay proyectos de Machine Learning desplegados en este sector.</p>
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