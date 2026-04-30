// src/features/experiments/api/getExperimentById.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { Experiment } from '../types';

// LA FUNCIÓN HTTP PURA
// Se encarga exclusivamente de ir al backend y traer el JSON.
export const getExperimentByIdFn = async (experimentId: string): Promise<Experiment> => {
  const response = await apiClient.get<Experiment>(`/experiments/${experimentId}`);
  return response.data;
};

// Hook inteligente (React Query)
export const useExperiment = (experimentId: string | undefined) => {
  return useQuery({
    // La Query Key incluye el ID para que React Query cachee cada experimento por separado
    queryKey: ['experiment', experimentId],
    
    // La función que ejecuta la petición
    queryFn: () => getExperimentByIdFn(experimentId as string),
    
    // ESCUDO DE SEGURIDAD: 
    // Si la URL no tiene ID (ej. el componente apenas se está montando), no hacemos la petición.
    enabled: !!experimentId,

    // ESTRATEGIA DE POLLING (Radar activo):
    // Al igual que en la lista, si entramos a un experimento y está "queued" o "processing",
    // preguntamos al servidor cada 3 segundos hasta que termine.
    refetchInterval: (query) => {
      const exp = query.state.data;
      if (!exp) return false;
      const isProcessing = exp.status === 'queued' || exp.status === 'processing';
      return isProcessing ? 3000 : false;
    },
  });
};