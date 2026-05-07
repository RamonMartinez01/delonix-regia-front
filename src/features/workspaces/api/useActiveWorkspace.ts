import { useQuery } from '@tanstack/react-query';
import { getMyWorkspaces } from './getWorkspaces';
import { useAuthStore } from '../../../stores/authStore';

export const useActiveWorkspace = () => {
  // 1. Obtenemos el ID que el usuario tiene seleccionado actualmente
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  return useQuery({
    queryKey: ['workspaces', 'me'],
    queryFn: getMyWorkspaces,
    
    // 2. La Magia: Filtramos el array para devolver solo el objeto que nos interesa (el workspace que el usuario está viendo en ese momento)
    select: (workspaces) => workspaces.find(w => w.id === activeWorkspaceId),
    
    // 3. Seguridad: No disparamos la petición si no hay un ID activo
    enabled: !!activeWorkspaceId,
  });
};