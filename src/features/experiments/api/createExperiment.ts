// src/features/experiments/api/createExperiment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { Experiment } from '../types';

// Definimos qué datos necesita el formulario para disparar
export interface CreateExperimentDTO {
  name: string;
  model_source_uri: string;
  task_type?: string;
  hyperparameters?: Record<string, any>;
}

/**
 * Función pura: El impacto en el servidor.
 * @param projectId - ID del proyecto padre.
 * @param data - Los datos del nuevo experimento.
 */
export const createExperimentFn = async (
  projectId: string, 
  data: CreateExperimentDTO
): Promise<Experiment> => {
  const response = await apiClient.post<Experiment>(
    `/experiments/project/${projectId}`, 
    data
  );
  return response.data;
};

/**
 * Hook personalizado: El disparador inteligente.
 * @param projectId - Necesario para saber qué caché invalidar al terminar.
 */
export const useCreateExperiment = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // La función que ejecuta la mutación
    mutationFn: (data: CreateExperimentDTO) => createExperimentFn(projectId, data),
    
    onSuccess: () => {
      // ¡ESTRATEGIA CLAVE! 
      // Invalidamos solo los experimentos de ESTE proyecto. 
      // Esto activa el radar (polling) automáticamente en la tabla.
      queryClient.invalidateQueries({ queryKey: ['experiments', projectId] });
    },
  });
};