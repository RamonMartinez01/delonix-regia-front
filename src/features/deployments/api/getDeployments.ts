// src/features/deployments/api/getDeployments.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { Deployment } from '../types';

export const getDeployments = async (projectId: string): Promise<Deployment[]> => {
  const response = await apiClient.get<Deployment[]>(`/deployments/project/${projectId}`);
  return response.data;
};

export const useDeployments = (projectId: string) => {
  return useQuery({
    queryKey: ['deployments', projectId],
    queryFn: () => getDeployments(projectId),
    enabled: !!projectId, // No disparamos la petición si no hay ID
  });
};