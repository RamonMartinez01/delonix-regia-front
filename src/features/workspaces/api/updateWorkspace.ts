import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { Workspace } from '../types';

interface UpdateWorkspaceDTO {
  id: string;
  name: string;
}

export const updateWorkspace = async ({ id, name }: UpdateWorkspaceDTO): Promise<Workspace> => {
  const response = await apiClient.patch<Workspace>(`/workspaces/${id}`, { name });
  return response.data;
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkspace,
    onSuccess: () => {
      // 1. Invalidamos la lista de workspaces para refrescar el Dashboard
      queryClient.invalidateQueries({ queryKey: ['workspaces', 'me'] });
      
      // 2. IMPORTANTE: Invalidamos el perfil del usuario para que el authStore 
      // se entere del cambio de nombre globalmente.
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
};