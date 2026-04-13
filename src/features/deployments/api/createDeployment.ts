// src/features/deployments/api/createDeployment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { Deployment, CreateDeploymentPayload } from '../types';

export const createDeployment = async (payload: CreateDeploymentPayload): Promise<Deployment> => {
    // Separamos el project_id para la URL, y enviamos el resto en el body (con useCreateDeployment -- desde CreateDeploymentModal)
  const { project_id, ...bodyData } = payload;
  const response = await apiClient.post<Deployment>(`/deployments/project/${project_id}`, bodyData);
  return response.data;
};

export const useCreateDeployment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeployment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
    },
  });
};