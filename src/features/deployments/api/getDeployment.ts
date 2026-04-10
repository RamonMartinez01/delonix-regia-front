// src/features/deployments/api/getDeployment.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { Deployment } from '../types';

export const getDeployment = async (deploymentId: string): Promise<Deployment> => {
  const response = await apiClient.get<Deployment>(`/deployments/${deploymentId}`);
  return response.data;
};

// Fíjate en la queryKey: usamos singular 'deployment' y su ID
export const useDeployment = (deploymentId: string) => {
  return useQuery({
    queryKey: ['deployment', deploymentId],
    queryFn: () => getDeployment(deploymentId),
    enabled: !!deploymentId, // Solo se ejecuta si tenemos un ID válido
  });
};