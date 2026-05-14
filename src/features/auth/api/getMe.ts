// src/features/auth/api/getMe.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { User } from '../types';

/**
 * 1. Función Pura HTTP
 * Se encarga estrictamente de viajar a FastAPI y traer el contrato validado.
 */
export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
};


/**
 * 2. Custom Hook de React Query
 * Encapsula la lógica de caché y estado de la petición.
 */
export const useGetMe = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled,
    
    
    retry: 0, // Si es 401, no reintentamos; la sesión simplemente no existe.
    
    refetchOnWindowFocus: false, // Evita parpadeos innecesarios al cambiar de pestaña.

    /**
     * NOTA TÁCTICA:
     * 'staleTime' determina cuánto tiempo consideramos que estos datos son "frescos".
     * Para el perfil de usuario, podemos permitirnos 5 minutos (300000 ms) 
     * para no saturar al servidor con peticiones /me constantes.
     */
    staleTime: 5 * 60 * 1000, 
  });
};