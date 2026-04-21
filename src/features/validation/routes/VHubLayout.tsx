// src/features/validation/routes/VHubLayout.tsx
import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';

export const VHubLayout = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Barra de Navegación Superior (Sin menús laterales complicados) */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-10">
       {/* Envolvemos el Logo en un Link importado de react-router-dom */}
        <Link to="/v-hub" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
            V
          </div>
          <h1 className="text-lg font-medium text-slate-200 tracking-wide">
            Validation<span className="text-emerald-500 font-bold">Hub</span>
          </h1>
        </Link>
        
        {/* Perfil de Azul */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">Auditora invitada</span>
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Área de Contenido Principal donde React Router inyectará las páginas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};