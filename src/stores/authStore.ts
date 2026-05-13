// src/stores/authStore.ts
import { create } from 'zustand';
import type { User, UserRole } from '../features/auth/types';
import { removeToken } from '../features/auth/utils/token';

// 1. El Contrato de nuestra Tienda (Estado + Acciones)
interface AuthState {
  // Estado
  user: User | null;
  activeWorkspaceId: string | null;
  isHydrating: boolean; // Estamos esperando a que FastAPI nos diga quién es el usuario

  // Acciones (Mutaciones)
  setUser: (user: User | null) => void;
  setActiveWorkspaceId: (id: string | null) => void;
  setIsHydrating: (status: boolean) => void;
  logout: () => void;

  // Selectores Computados (Lógica derivada)
  getActiveRole: () => UserRole | null;
}

// 2. La Creación de la Tienda
// Usamos 'set' para mutar el estado y 'get' para leer el estado actual dentro de una acción
export const useAuthStore = create<AuthState>((set, get) => ({
  // --- Estado Inicial ---
  user: null,
  activeWorkspaceId: null,
  isHydrating: true, // Asumimos que estamos cargando al arrancar la app

  // --- Acciones ---
  setUser: (user) => set({ user }),
  
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
  
  setIsHydrating: (status) => set({ isHydrating: status }),

  logout: () => {
    // 1. Limpiamos el pasaporte local
    removeToken();
    // 2. (Simulación vs Realidad): Si tienes una función removeActiveWorkspace() 
    // en src/features/workspaces/utils/workspace, deberías llamarla aquí también.
    
    // 3. Purgamos la memoria de Zustand
    set({ user: null, activeWorkspaceId: null, isHydrating: false });

    // Forzamos el regreso a la Landing Page
    window.location.href = '/';
  },

  // --- El Selector Maestro (RBAC Contextual) ---
  getActiveRole: () => {
    // Leemos el estado exacto en este milisegundo
    const { user, activeWorkspaceId } = get();
    
    if (!user || !activeWorkspaceId) return null;

    // Buscamos el workspace activo dentro de la lista de accesos del usuario
    const currentWorkspaceContext = user.workspaces.find(
      (w) => w.workspace_id === activeWorkspaceId
    );

    // Si existe, devolvemos su rol específico para este espacio. Si no, nulo.
    return currentWorkspaceContext ? currentWorkspaceContext.role : null;
  },
}));