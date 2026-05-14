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
  
  const { setUser, setIsHydrating, logout, setActiveWorkspaceId } = useAuthStore();

  
useEffect(() => {
   // 1. Caso de Éxito: El servidor reconoció la cookie
    if (isSuccess && user) {
      setUser(user);
      
      const savedWorkspaceId = getActiveWorkspace();
      const hasAccessToSaved = user.workspaces.some(ws => ws.workspace_id === savedWorkspaceId);

      if (savedWorkspaceId && hasAccessToSaved) {
        setActiveWorkspaceId(savedWorkspaceId);
      } else if (user.workspaces.length > 0) {
        const ownerWS = user.workspaces.find(ws => ws.role.toLowerCase() === 'owner');
        setActiveWorkspaceId(ownerWS ? ownerWS.workspace_id : user.workspaces[0].workspace_id);
      }

      setIsHydrating(false);
    }

    // 2. Caso de Error: No hay cookie o expiró
    if (isError) {
      logout();
    }

    // 3. Caso de Fin de Carga (Fallback)
    if (!isLoading && !user) {
      setIsHydrating(false);
    }
  }, [user, isSuccess, isError, isLoading, setUser, setIsHydrating, setActiveWorkspaceId]);

  return <>{children}</>;
};