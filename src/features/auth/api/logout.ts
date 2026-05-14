// src/features/auth/api/logout.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import { useAuthStore } from '../../../stores/authStore';

/**
 * Función pura que dispara la señal de extinción al servidor.
 */
export const logoutUser = async (): Promise<void> => {
  // El backend recibirá la cookie, la invalidará y nos responderá
  await apiClient.post('/auth/logout');
};

/**
 * Hook maestro de Logout.
 * Coordina la destrucción de la sesión en el servidor y en el cliente.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // 1. Limpieza de Caché de TanStack Query
      // Esto borra todos los datos de 'user', 'projects', etc., de la memoria volátil
      queryClient.clear();

      // 2. Limpieza de Zustand y Redirección
      // Ejecutamos la lógica que ya definimos en el store
      logoutStore();
      
      console.log("Protocolo de Logout completado: Sesión destruida.");
    },
    onError: (error) => {
      // Incluso si la red falla, debemos limpiar el cliente por seguridad
      console.error("Error en red durante logout, procediendo con limpieza local:", error);
      queryClient.clear();
      logoutStore();
    }
  });
};