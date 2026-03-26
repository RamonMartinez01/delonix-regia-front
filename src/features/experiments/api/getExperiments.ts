// src/features/experiments/api/getExperiments.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { Experiment } from '../types';

/**
 * Función HTTP pura. Recibe el ID del proyecto para filtrar.
 */
export const getExperimentsByProject = async (projectId: string): Promise<Experiment[]> => {
  const response = await apiClient.get<Experiment[]>(`/experiments/project/${projectId}`);
  return response.data;
};

/**
 * Hook Inteligente. 
 * @param projectId - El ID del proyecto actual en la URL.
 */
export const useExperiments = (projectId: string) => {
  return useQuery({
    // 1. La Query Key ahora es un array compuesto. 
    // Esto asegura que la caché de un proyecto no se mezcle con la de otro.
    queryKey: ['experiments', projectId], 
    
    // 2. Pasamos el projectId a nuestra función HTTP
    queryFn: () => getExperimentsByProject(projectId),
    
    // EL CEREBRO DEL POLLING INTELIGENTE
    // TanStack Query v5 permite que refetchInterval sea una función.
    // Analizamos los datos que tenemos en memoria.
    refetchInterval: (query) => {
      const experiments = query.state.data;
      
      // Si no hay datos aún, no hacemos polling
      if (!experiments) return false;

      // Buscamos si ALGÚN experimento está encolado o corriendo
      const hasActiveExperiments = experiments.some(
        (exp) => exp.status === 'queued' || exp.status === 'running'
      );

      // Si hay actividad, refrescamos cada 5000ms (5 segundos). 
      // Si todo terminó (completed/failed), devolvemos false y el radar se apaga para ahorrar recursos.
      return hasActiveExperiments ? 5000 : false;
    },
  });
};