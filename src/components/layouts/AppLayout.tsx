// src/components/layouts/AppLayout.tsx
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from '../../widgets/Sidebar';
import { useActiveWorkspace } from '../../features/workspaces/api/useActiveWorkspace';

export const AppLayout = () => {
  const location = useLocation();
  const { data: activeWorkspace, isLoading } = useActiveWorkspace();

  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="flex h-screen bg-brand-canvas text-[#111111] overflow-hidden font-sans">
      
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        
        {/* 
          * Header Editorial Permanente: 
          * Adiós al `backdrop-blur-md` y al fondo translúcido.
          * Hola a la solidez del papel impreso (`bg-white`) con un límite claro (`border-[#EAEAE8]`).
          */}
        <header className="h-16 border-b border-[#EAEAE8] flex items-center px-8 bg-white z-10">
          <div className="flex items-center gap-3">
            {isDashboard ? (
              // Vista pasiva: Indicador apagado/neutro
              <div className="flex items-center gap-2.5 animate-in slide-in-from-left duration-500">
                <div className="w-2 h-2 rounded-full bg-[#A1A19A]" />
                <span className="text-[10px] font-bold text-[#5A5855] tracking-widest uppercase mt-0.5">
                  Tu Espacio de Operaciones
                </span>
              </div>
            ) : (
              // Vista activa/navegable: Indicador vivo con nuestro color de marca
              <Link
                to="/dashboard"
                className="group flex items-center gap-2.5 transition-all animate-in fade-in duration-300"
              >
                <div className={`w-2 h-2 rounded-full transition-colors 
                  ${isLoading ? 'bg-[#EAEAE8] animate-pulse' : 'bg-brand-primary'}`}
                />
                <span className="text-[10px] font-bold text-[#5A5855] group-hover:text-[#111111] tracking-widest uppercase transition-colors mt-0.5">
                  {isLoading ? 'Sincronizando...' : activeWorkspace?.name || 'Workspace'}
                </span>
              </Link>
            )}

            {/* Separador físico sutil */}
            <span className="text-[#EAEAE8] mx-2">|</span>
            
          </div>
        </header>
        
        {/* Contenedor fluido para las vistas hijas */}
        <div className="flex-1 overflow-y-auto relative z-0 custom-scrollbar bg-brand-canvas">
          <Outlet />
        </div>
      </main>
    </div>
  );
};