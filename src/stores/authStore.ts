// src/stores/authStore.ts
import { create } from 'zustand';
import type { User, UserRole } from '../features/auth/types';
import { removeActiveWorkspace, setActiveWorkspace } from '../features/workspaces/utils/workspace';

interface AuthState {
  user: User | null;
  activeWorkspaceId: string | null;
  isHydrating: boolean;
  setUser: (user: User | null) => void;
  setActiveWorkspaceId: (id: string | null) => void;
  setIsHydrating: (status: boolean) => void;
  logout: () => void; // Acción de limpieza total
  getActiveRole: () => UserRole | null;
}

  export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  activeWorkspaceId: null,
  isHydrating: true,

  setUser: (user) => set({ user }),

  setActiveWorkspaceId: (id) => {
    // 1. Guardamos en la memoria RAM (Zustand)
    set({ activeWorkspaceId: id });
    // 2. Guardamos en el Disco Duro (LocalStorage)
    if (id) {
      setActiveWorkspace(id);
    } else {
      removeActiveWorkspace();
    }
  },

  setIsHydrating: (status) => set({ isHydrating: status }),

  logout: () => {
    // 1. Limpieza de valores Locales
    // Ya no llamamos a removeToken() porque no hay token que borrar manualmente.
    removeActiveWorkspace();
    
    // 2. Purgamos la memoria de Zustand (Reset al estado inicial)
    set({ 
      user: null, 
      activeWorkspaceId: null, 
      isHydrating: false 
    });

    // 3. Expulsión a Zona Segura
    // Al limpiar la cookie (vía backend) y redirigir, 
    // garantizamos que el usuario no pueda volver atrás.
    if (window.location.pathname !== '/') {
        window.location.href = '/';
    }
  },

  getActiveRole: () => {
    const { user, activeWorkspaceId } = get();
    if (!user || !activeWorkspaceId) return null;
    const currentWorkspaceContext = user.workspaces.find(
      (w) => w.workspace_id === activeWorkspaceId
    );
    return currentWorkspaceContext ? currentWorkspaceContext.role : null;
  },
}));