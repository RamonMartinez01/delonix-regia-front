// src/widgets/Sidebar.tsx
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Database,
  UserCircle,
  LogOut, 
  CheckSquare
} from 'lucide-react';
import { useLogout } from '../features/auth/api/logout';

export const Sidebar = () => {
  const role = useAuthStore((state) => state.getActiveRole());
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  // Para saber si el usuario está viendo el AppLayout o VHubLayout
  const location = useLocation();

  // Activa función logout
  const logoutMutation = useLogout();

  // Menús separados por Sector
  const gammaMenu = [
    { label: 'Proyectos', path: '/dashboard', icon: LayoutDashboard, show: true },
    { label: 'Equipo', path: '/dashboard/team', icon: Users, show: role === 'owner' },
   // { label: 'Modelos ML', path: '/dashboard/models', icon: Database, show: true },
  ];

  const deltaMenu = [
    { label: 'Validaciones', path: '/v-hub', icon: CheckSquare, show: true },
    // Aquí el MEMBER no ve ni Equipo ni Modelos. 
  ];

  // Construimos la ruta dinámica del perfil basada en la URL actual
  const isVHub = location.pathname.startsWith('/v-hub');
  const profileRoute = isVHub ? '/v-hub/profile' : '/dashboard/profile';
  
  // Selección del menú a renderizar
  const activeMenuItems = isVHub ? deltaMenu : gammaMenu;

  return (
    <aside 
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col
      ${isSidebarOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Header de la Sidebar */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 h-16">
        {isSidebarOpen && <span className="font-bold text-emerald-500 tracking-wider">DELONIX</span>}
        <button 
          onClick={toggleSidebar}
          className="p-1 hover:bg-slate-800 rounded-md text-slate-400 transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
        {activeMenuItems.map((item) => item.show && (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard' || item.path === '/v-hub'} 
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg transition-all
              ${isActive 
                ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
            `}
          >
            <item.icon size={22} className="shrink-0" />
            {isSidebarOpen && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer: Perfil del Usuario */}
      <div className="p-4 border-t border-slate-800">
        <NavLink 
          to={profileRoute} 
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive 
              ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
          `}
        >
          <UserCircle size={22} />
          {isSidebarOpen && <span className="text-sm truncate">Mi Perfil</span>}
        </NavLink>

        {/* ⚡ 4. El Botón de Eyección */}
        <button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50
            ${!isSidebarOpen ? 'justify-center' : ''}
          `}
          title="Cerrar Sesión"
        >
          <LogOut size={22} className={logoutMutation.isPending ? 'animate-pulse' : ''} />
          {isSidebarOpen && <span className="text-sm truncate">Cerrar Sesión</span>}
        </button>

      </div>
    </aside>
  );
};