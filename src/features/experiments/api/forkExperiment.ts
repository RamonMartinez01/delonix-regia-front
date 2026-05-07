// src/features/experiments/api/forkExperiment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { ExperimentForkType, Experiment } from '../types';

// 1. CONTRATO DE ENVÍO (Payload)
export interface ForkExperimentPayload {
  parent_id: string;
  fork_type: ExperimentForkType;
  evolution_notes?: string;
  // dataset_uri y hyperparameters se omiten para que el backend herede los del padre
}

// 2. PARÁMETROS DEL HOOK
interface ForkParams {
  projectId: string;
  data: ForkExperimentPayload;
}

// 3. EL GANCHO DE RED
export const useForkExperiment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, data }: ForkParams): Promise<Experiment> => {
      // Usamos el apiClient configurado con ZUSTAND y los interceptores JWT
      const response = await apiClient.post(`/experiments/project/${projectId}/fork`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Magia de TanStack: Invalidamos la caché de la lista de experimentos
      // para que el nuevo "hijo" aparezca instantáneamente en la barra lateral
      queryClient.invalidateQueries({ queryKey: ['project-experiments', variables.projectId] });
    },
  });
};