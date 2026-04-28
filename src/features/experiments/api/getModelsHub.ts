// src/features/experiments/api/getModelsHub.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/axios';

// 1. El contrato tipado (Espejo del backend)
export interface HubModel {
  id: string;
  name: string;
  task_type: string;
  description: string;
  is_supported: boolean;
}

// 2. La llamada
export const fetchHubModels = async (): Promise<HubModel[]> => {
  const response = await apiClient.get<HubModel[]>('/models/hub');
  return response.data;
};

// 3. El Hook Inteligente
export const useHubModels = () => {
  return useQuery({
    queryKey: ['hub-models'],
    queryFn: fetchHubModels,
    // El catálogo es estático, lo mantenemos fresco en caché por 1 hora
    staleTime: 1000 * 60 * 60, 
  });
};