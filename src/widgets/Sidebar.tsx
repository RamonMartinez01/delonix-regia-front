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
  UserCircle
} from 'lucide-react';

export const Sidebar = () => {
  const role = useAuthStore((state) => state.getActiveRole());
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  // Para saber si el usuario está viendo el AppLayout o VHubLayout
  const location = useLocation();

  // Definición de rutas con su lógica de visibilidad
  const menuItems = [
    { 
      label: 'Proyectos', 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      show: true 
    },
    { 
      label: 'Equipo', 
      path: '/dashboard/team', 
      icon: Users, 
      show: role === 'owner' // El Gran Candado
    },
    { 
      label: 'Modelos ML', 
      path: '/dashboard/models', 
      icon: Database, 
      show: true 
    },
  ];

  // Construimos la ruta dinámica del perfil basada en la URL actual
  const isVHub = location.pathname.startsWith('/v-hub');
  const profileRoute = isVHub ? '/v-hub/profile' : '/dashboard/profile';

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

      {/* Navegación Principal */}
      <nav className="flex-1 p-3 space-y-2">
        {menuItems.map((item) => item.show && (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2 rounded-lg transition-all
              ${isActive 
                ? 'bg-emerald-500/10 text-emerald-400 font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
            `}
          >
            <item.icon size={22} />
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
      </div>
    </aside>
  );
};