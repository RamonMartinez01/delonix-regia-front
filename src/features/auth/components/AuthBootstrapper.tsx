// src/features/auth/components/AuthBootstrapper.tsx
import { useEffect } from 'react';
import { useGetMe } from '../api/getMe';
import { useAuthStore } from '../../../stores/authStore';
import { getToken } from '../utils/token';
import { getActiveWorkspace } from '../../workspaces/utils/workspace';

interface AuthBootstrapperProps {
  children: React.ReactNode;
}

export const AuthBootstrapper = ({ children }: AuthBootstrapperProps) => {
  // 1. Revisamos el pasaporte local
  const token = getToken();

  // 2. Ejecutamos la consulta. ¡Solo viajará si token existe!
  const { data: user, isSuccess, isError } = useGetMe(!!token);
  
  // 3. Nos conectamos al panel de control de nuestra tienda Zustand
  const { setUser, setIsHydrating, logout, setActiveWorkspaceId } = useAuthStore();

  // 4. El Efecto Secundario: Reaccionar a la respuesta de la red
useEffect(() => {
    if (!token) {
      setIsHydrating(false);
      return;
    }

    if (isSuccess && user) {
      setUser(user);
      
      // 1. Revisamos si ya hay algo en el LocalStorage (puesto por Login o ActivateOwner)
      const savedWorkspaceId = getActiveWorkspace();
      
      // 2. Verificamos que ese ID guardado realmente pertenezca al usuario actual 
      // (evita inconsistencias si cambias de cuenta)
      const hasAccessToSaved = user.workspaces.some(ws => ws.workspace_id === savedWorkspaceId);

      if (savedWorkspaceId && hasAccessToSaved) {
        // Respetamos la voluntad del usuario/proceso previo
        setActiveWorkspaceId(savedWorkspaceId);
      } else if (user.workspaces.length > 0) {
        // Solo si no hay nada guardado o es inválido, tomamos el primero (OWNER suele ser el primero)
        // O mejor aún: buscar activamente el OWNER aquí también como respaldo
        const ownerWS = user.workspaces.find(ws => ws.role.toLowerCase() === 'owner');
        setActiveWorkspaceId(ownerWS ? ownerWS.workspace_id : user.workspaces[0].workspace_id);
      }

      setIsHydrating(false);
    }

    if (isError) {
      logout();
      setIsHydrating(false);
    }
  }, [token, user, isSuccess, isError, setActiveWorkspaceId]);

  return <>{children}</>;
};