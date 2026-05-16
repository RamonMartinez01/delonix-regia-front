// src/features/validation/routes/VHubLayout.tsx
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from '../../../widgets/Sidebar';
import { useActiveWorkspace } from '../../workspaces/api/useActiveWorkspace';

export const VHubLayout = () => {
  const location = useLocation();
  const { data: activeWorkspace, isLoading } = useActiveWorkspace();

  const isVHubRoot = location.pathname === '/v-hub';

 return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
      
      {/* ⚡ Inyectamos el Sidebar Camaleónico */}
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        
        {/* El Header Permanente (Estilo Sector Gamma) */}
        <header className="h-16 border-b border-slate-800/60 flex items-center justify-between px-8 bg-slate-950/20 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3">
            
            

            {isVHubRoot ? (
              <div className="flex items-center gap-2 animate-in slide-in-from-left duration-500">
                <div className="w-2 h-2 rounded-full bg-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]" />
                <span className="text-sm font-semibold text-slate-400 tracking-wide uppercase">
                  Centro de Validación
                </span>
              </div>
            ) : (
              <Link
                to="/v-hub"
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
          
         

          {/* Insignia de Rol para mantener contexto visual */}
          <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-wider">
            Auditor Invitado
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto relative z-0 custom-scrollbar p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};