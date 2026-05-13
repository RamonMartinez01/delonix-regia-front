// src/components/layouts/AppLayout.tsx
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from '../../widgets/Sidebar';
import { useActiveWorkspace } from '../../features/workspaces/api/useActiveWorkspace';

// src/components/layouts/AppLayout.tsx

export const AppLayout = () => {
  const location = useLocation();
  const { data: activeWorkspace, isLoading } = useActiveWorkspace();

  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        
        {/* El Header ahora es PERMANENTE */}
        <header className="h-16 border-b border-slate-800/60 flex items-center px-8 bg-slate-950/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {isDashboard ? (
              // Vista para el DASHBOARD
              <div className="flex items-center gap-2 animate-in slide-in-from-left duration-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
                <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
                  Tu Espacio de Operaciones
                </span>
              </div>
            ) : (
              // Vista para el RESTO DE RUTAS (Team, Project Detail, etc)
              <Link
                to="/dashboard"
                className="group flex items-center gap-2 hover:opacity-80 transition-all animate-in fade-in duration-300"
              >
                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] 
                  ${isLoading ? 'bg-slate-600 animate-pulse' : 'bg-emerald-500'}`}
                />
                <span className="text-sm font-bold text-slate-300 group-hover:text-emerald-400 tracking-wide uppercase">
                  {isLoading ? 'Sincronizando...' : activeWorkspace?.name || 'Workspace'}
                </span>
              </Link>
            )}

            <span className="text-slate-800 mx-2">|</span>
            
            
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto relative z-0 custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};