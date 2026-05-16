// src/widgets/Sidebar.tsx
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  LogOut,
  CheckSquare
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { useLogout } from '../features/auth/api/logout';

export const Sidebar = () => {
  const role = useAuthStore((state) => state.getActiveRole());
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  // Para saber si el usuario está viendo el AppLayout o VHubLayout
  const location = useLocation();

  // Activa función logout
  const logoutMutation = useLogout();
  // Estado local para el Modal de logout
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

  // Función de ejecución final
  const confirmLogout = () => {

    logoutMutation.mutate()
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <aside
        className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col
      ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Header de la Sidebar */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800 h-16">
          {isSidebarOpen && (
          // Transformamos el span en un Link interactivo
          <Link 
            to="/" 
            className="font-bold text-emerald-500 tracking-wider hover:text-emerald-400 transition-colors"
          >
            DELONIX
          </Link>
        )}
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

          {/* El Botón activa el Modal Logout */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
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

        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          title="¿Cerrar Sesión?"
        >
          <div className="space-y-6">
            <div className="flex flex-row items-center  gap-4">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 shrink-0">
                <LogOut size={24} />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mt-1">
                Estás a punto de salir de la interfaz <span className="font-semibold text-white">Delonix</span>.

              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t border-slate-700/60">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-5 py-2.5 font-medium text-slate-400 bg-transparent border border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-all active:scale-95"
              >
                Regresar
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2.5 font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(244,63,94,0.05)]"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </Modal>
      </aside>
    </>
  );
};