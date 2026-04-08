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
 * 2. Hook Custom de React Query
 * Encapsula la lógica de caché y estado de la petición.
 */
export const useGetMe = (enabled: boolean = true) => {
  return useQuery({
    // La 'Llave de Caché'. React Query la usa para identificar esta petición en toda la app.
    queryKey: ['auth', 'me'],
    
    // La función que ejecuta el trabajo sucio.
    queryFn: getMe,
    
    // Condición de disparo: Solo viaja al backend si esto es true.
    enabled,
    
    // Configuración estratégica: 
    // Si FastAPI dice 401 (token inválido), no queremos reintentar 3 veces (comportamiento por defecto).
    retry: 0,
    
    // Para la autenticación, es molesto que vuelva a pedir los datos 
    // solo porque el usuario cambió de pestaña en el navegador.
    refetchOnWindowFocus: false,
  });
};