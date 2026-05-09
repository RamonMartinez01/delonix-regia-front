// src/components/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../../widgets/Sidebar';
import { useUIStore } from '../../stores/uiStore';

export const AppLayout = () => {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden">
      {/* 1. Navegación Lateral */}
      <Sidebar />

      {/* 2. Área de Contenido Principal */}
      <main className={`
        flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300
        ${isSidebarOpen ? 'ml-0' : 'ml-0'} 
      `}>
        
        {/* Decoración de fondo sutil para dar profundidad (Opcional, estilo MLOps) */}
        {/*<div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/5 blur-[120px] pointer-events-none" />*/}

        {/**/}
        <header className="h-16 border-b border-slate-800/60 flex items-center px-8 bg-slate-950/20 backdrop-blur-md z-10">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-400/80">My Workspace</span>
            </div>
        </header>
        
        
        {/* 4. El Escenario (Viewport) */}
        <div className="flex-1 overflow-y-auto relative z-0 custom-scrollbar">
          <div className="flex-1 overflow-y-auto"> 
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};