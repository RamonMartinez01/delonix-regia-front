// src/features/auth/api/checkEmail.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/axios';

export interface EmailStatus {
  exists: boolean;
  requires_upgrade: boolean;
  full_name: string | null;
}

/**
 * Función que consulta al radar del backend el estado de un correo.
 */
export const checkEmailStatus = async (email: string): Promise<EmailStatus> => {
  // Solo disparamos si el email tiene una estructura mínima para no saturar la API
  if (!email || !email.includes('@')) {
    return { exists: false, requires_upgrade: false, full_name: null };
  }
  
  const response = await apiClient.get<EmailStatus>(`/auth/check-email/${email}`);
  return response.data;
};

/**
 * Hook para usar el radar en componentes.
 * 'enabled: false' porque queremos controlarlo manualmente o con lógica específica.
 */
export const useCheckEmail = (email: string) => {
  return useQuery({
    queryKey: ['check-email', email],
    queryFn: () => checkEmailStatus(email),
    enabled: email.length > 5 && email.includes('.'), // Solo se activa cuando el email parece real
    staleTime: 1000 * 60 * 5, // Cacheamos el resultado por 5 minutos
    retry: false,
  });
};