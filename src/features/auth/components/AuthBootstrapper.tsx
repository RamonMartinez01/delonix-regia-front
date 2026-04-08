// src/features/auth/components/AuthBootstrapper.tsx
import { useEffect } from 'react';
import { useGetMe } from '../api/getMe';
import { useAuthStore } from '../../../stores/authStore';
import { getToken } from '../utils/token';

interface AuthBootstrapperProps {
  children: React.ReactNode;
}

export const AuthBootstrapper = ({ children }: AuthBootstrapperProps) => {
  // 1. Revisamos el pasaporte local
  const token = getToken();
  
  // 2. Ejecutamos la consulta. ¡Solo viajará si token existe!
  const { data: user, isSuccess, isError } = useGetMe(!!token);
  
  // 3. Nos conectamos al panel de control de nuestra tienda Zustand
  const { setUser, setIsHydrating, logout } = useAuthStore();

  // 4. El Efecto Secundario: Reaccionar a la respuesta de la red
  useEffect(() => {
    // Escenario A: Usuario nuevo o sin sesión
    if (!token) {
      setIsHydrating(false);
      return;
    }

    // Escenario B: FastAPI nos devolvió el perfil (El contrato User)
    if (isSuccess && user) {
      setUser(user);

      // 👇 EL ESLABÓN PERDIDO: Si no hay un Workspace seleccionado (ej. acaba de hacer login),
      // le auto-asignamos el primero de su lista para que la app pueda arrancar.
      const currentWorkspace = useAuthStore.getState().activeWorkspaceId;
      if (!currentWorkspace && user.workspaces.length > 0) {
        useAuthStore.getState().setActiveWorkspaceId(user.workspaces[0].workspace_id);
      }
      
      setIsHydrating(false);
    }

    // Escenario C: El token caducó o fue revocado en la BD
    if (isError) {
      logout(); // Esto ejecuta nuestro método de limpieza profunda en Zustand
      setIsHydrating(false);
    }
  }, [token, user, isSuccess, isError, setUser, setIsHydrating, logout]);

  // Renderizamos los componentes hijos sin alterar la UI
  return <>{children}</>;
};