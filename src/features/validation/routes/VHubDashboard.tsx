// src/features/validation/routes/VHubDashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProjects } from '../../projects/api/getProjects'; // Ajusta la ruta si es necesario

export const VHubDashboard = () => {
  // Conectamos con el backend usando React Query
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['vhub-projects'],
    queryFn: getProjects,
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Mis Proyectos Asignados</h2>
        <p className="text-slate-400">Selecciona un proyecto para acceder a la arena de pruebas y evaluar el modelo.</p>
      </header>
      
      {/* Estado: Cargando */}
      {isLoading && (
        <div className="p-12 flex flex-col items-center justify-center text-emerald-500">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-slate-400 text-sm">Obteniendo accesos seguros...</p>
        </div>
      )}

      {/* Estado: Error */}
      {isError && (
        <div className="p-6 border border-red-900/50 bg-red-900/20 rounded-xl text-red-400">
          <p>Hubo un problema al cargar los proyectos. Por favor, intenta de nuevo.</p>
        </div>
      )}

      {/* Estado: Vacío (Azul no tiene invitaciones) */}
      {!isLoading && !isError && projects?.length === 0 && (
        <div className="p-12 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 bg-slate-900/20">
          <div className="text-4xl mb-3">📭</div>
          <p>Aún no tienes proyectos asignados en este Workspace.</p>
        </div>
      )}

      {/* Estado: Éxito (El Grid de Proyectos VIP) */}
      {!isLoading && !isError && projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              to={`/v-hub/project/${project.id}`} // Navegaremos a la Arena de Pruebas
              className="group relative bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all duration-300 flex flex-col h-full"
            >
              {/* Decoración VIP */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  Acceso Concedido
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-200 mb-2 relative z-10 group-hover:text-white">
                {project.name}
              </h3>
              
              {project.description && (
                <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-grow relative z-10">
                  {project.description}
                </p>
              )}
              
              <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between text-sm text-slate-500 group-hover:text-emerald-500 transition-colors relative z-10">
                <span>Ingresar a evaluación</span>
                <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};