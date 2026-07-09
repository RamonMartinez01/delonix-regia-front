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

  // Función de ejecución final (Logout)
  const confirmLogout = () => {
    logoutMutation.mutate()
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <aside
       /* 1. Transformación Estructural: Papel sólido, borde limpio, sin sombras flotantes */
        className={`bg-white border-r border-[#EAEAE8] transition-all duration-300 flex flex-col relative z-20
        ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        {/* Header de la Sidebar */}
        <div className="p-4 flex items-center justify-between border-b border-[#EAEAE8] h-16">
          {isSidebarOpen && (
          // Transformamos el span en un Link interactivo
          <Link 
            to="/" 
            className="font-black font-display text-xl text-[#111111] tracking-tighter hover:text-brand-primary transition-colors"
          >
            DELONIX
          </Link>
        )}
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-[#F7F7F5] rounded-lg text-[#A1A19A] hover:text-[#111111] transition-colors"
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
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm
              ${isActive
                  ? 'bg-brand-surface text-brand-primary font-bold'
                  : 'text-[#5A5855] hover:bg-[#F7F7F5] hover:text-[#111111]'}
            `}
            >
              <item.icon size={22} className="shrink-0" />
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer: Perfil del Usuario */}
        <div className="p-4 border-t border-[#EAEAE8] space-y-1.5">
          <NavLink
            to={profileRoute}
            className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-sm
            ${isActive
                ? 'bg-brand-surface text-brand-primary font-bold'
                : 'text-[#5A5855] hover:bg-[#F7F7F5] hover:text-[#111111]'}
          `}
          >
            <UserCircle size={20} strokeWidth={2} />
            {isSidebarOpen && <span className="truncate">Mi Perfil</span>}
          </NavLink>

          {/* El Botón activa el Modal Logout */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            disabled={logoutMutation.isPending}
            className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm
          text-[#5A5855] hover:bg-brand-surface hover:text-[#D46077] disabled:opacity-50
            ${!isSidebarOpen ? 'justify-center' : ''}
          `}
            title="Cerrar Sesión"
          >
            <LogOut size={20} strokeWidth={2} className={logoutMutation.isPending ? 'animate-pulse' : ''} />
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
              <div className="p-3 bg-brand-surface border border-brand-accent rounded-xl text-[#D46077] shrink-0 shadow-sm">
                <LogOut size={24} strokeWidth={2.5}/>
              </div>
              <p className="text-[#5A5855] text-sm leading-relaxed mt-1 font-medium">
                Estás a punto de salir de la interfaz <span className="font-bold text-[#111111]">Delonix</span>.

              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t border-[#EAEAE8]">
              {/* Botones de acción con peso estructural correcto */}
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-5 py-2.5 font-bold text-[#111111] bg-white border border-[#D1D1CD] hover:bg-[#F7F7F5] rounded-xl transition-all active:scale-95 shadow-sm"
              >
                Regresar
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2.5 font-bold text-white bg-[#D46077] hover:bg-[#B34D61] border-none rounded-xl transition-all active:scale-95 shadow-sm"
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