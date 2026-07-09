// src/features/validation/routes/VHubLayout.tsx
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from '../../../widgets/Sidebar';
import { useActiveWorkspace } from '../../workspaces/api/useActiveWorkspace';

export const VHubLayout = () => {
  const location = useLocation();
  const { data: activeWorkspace, isLoading } = useActiveWorkspace();

  const isVHubRoot = location.pathname === '/v-hub';

  return (
    /* El lienzo base cambia de negro espacial a nuestro gris papel estructural */
    <div className="flex h-screen bg-[#F7F7F5] text-[#111111] overflow-hidden">
      
      {/* ⚡ El Sidebar hereda su propia física (asumimos que ya está refactorizado) */}
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        
        {/* El Header Editorial Permanente */}
        <header className="h-16 border-b border-[#EAEAE8] flex items-center justify-between px-8 bg-white z-10 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            
            {isVHubRoot ? (
              <div className="flex items-center gap-2.5 animate-in slide-in-from-left duration-500">
                <div className="w-2 h-2 rounded-full bg-[#A1A19A]" />
                <span className="text-[10px] font-bold text-[#A1A19A] tracking-widest uppercase">
                  Centro de Validación
                </span>
              </div>
            ) : (
              <Link
                to="/v-hub"
                className="group flex items-center gap-2.5 transition-all animate-in fade-in duration-300"
              >
                {/* Indicador de conexión táctil, sin neón */}
                <div className={`w-2 h-2 rounded-full transition-colors
                  ${isLoading ? 'bg-[#D1D1CD] animate-pulse' : 'bg-role-validator'}`}
                />
                <span className="text-[10px] font-bold text-[#5A5855] group-hover:text-[#111111] tracking-widest uppercase transition-colors">
                  {isLoading ? 'Sincronizando...' : activeWorkspace?.name || 'Workspace'}
                </span>
              </Link>
            )}

            {/* Separador físico */}
            <span className="text-[#EAEAE8] mx-2">|</span>
          </div>
          
          {/* Insignia de Rol (Member / Auditor) alineada con nuestra paleta RBAC */}
          <div className="px-3 py-1.5 rounded-md bg-role-validator/10 border border-role-validator/20 text-[9px] font-bold text-role-validator uppercase tracking-widest shadow-sm">
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