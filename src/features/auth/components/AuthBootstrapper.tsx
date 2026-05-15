// src/features/auth/components/AuthBootstrapper.tsx
import { useEffect } from 'react';
import { useGetMe } from '../api/getMe';
import { useAuthStore } from '../../../stores/authStore';
import { getActiveWorkspace } from '../../workspaces/utils/workspace';

interface AuthBootstrapperProps {
  children: React.ReactNode;
}

export const AuthBootstrapper = ({ children }: AuthBootstrapperProps) => {

  /**
   * Revisa 'useGetMe' 
   * incondicionalmente al montar la app (enabled: true).
   */
  const { data: user, isSuccess, isError, isLoading } = useGetMe(true);
  
  // Selectores atómicos para estabilidad absoluta de React
  const setUser = useAuthStore((state) => state.setUser);
  const setIsHydrating = useAuthStore((state) => state.setIsHydrating);
  const logout = useAuthStore((state) => state.logout);
  const setActiveWorkspaceId = useAuthStore((state) => state.setActiveWorkspaceId);

  
useEffect(() => {
    if (isLoading) return;

   // 1. Caso de Éxito: El servidor reconoció la cookie
  if (isSuccess && user) {
      setUser(user);

      const safeWorkspaces = user.workspaces || []
      const savedWorkspaceId = getActiveWorkspace();
      const hasAccessToSaved = safeWorkspaces.some(ws => ws.workspace_id === savedWorkspaceId);

      // ⚡ LÓGICA DE INTERCEPCIÓN MULTI-TENANT
      if (safeWorkspaces.length === 1) {
        // Caso A: Solo un workspace. Asignación directa y transparente.
        setActiveWorkspaceId(safeWorkspaces[0].workspace_id);
      } 
      else if (safeWorkspaces.length > 1) {
        // Caso B: Múltiples workspaces
        if (hasAccessToSaved) {
          // B.1: Hay un workspace guardado en caché y sigue teniendo acceso
          setActiveWorkspaceId(savedWorkspaceId);
        } else {
          // B.2: No hay caché. El usuario debe elegir.
          const currentPath = window.location.pathname;
          
          // Prevenimos bucles si el usuario ya está en el Sector Epsilon
          if (currentPath !== '/gateway' && currentPath !== '/profile') {
            window.location.href = '/gateway';
            return; // Detenemos la ejecución durante el salto hiperespacial
          }
        }
      }
      // Si todo fue en orden (o si ya estaba en /gateway), terminamos de hidratar
      setIsHydrating(false);
      return;
    }
        // 2. Caso de Error: No hay cookie o expiró
      if (isError) {
        logout();
        return;
      }
      // 3. Caso de Fin de Carga (Fallback)
      if (!user) {
        setIsHydrating(false);
      }
  }, [user, isSuccess, isError, isLoading, setUser, setIsHydrating, setActiveWorkspaceId, logout]); // user, isSuccess, isError, isLoading, setUser, setIsHydrating, setActiveWorkspaceId, logout

  return <>{children}</>;
};