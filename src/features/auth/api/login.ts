// src/features/auth/api/login.ts
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import { setToken } from '../utils/token'; // <-- 1. Importamos la utilidad de almacenamiento
import type { LoginCredentials, TokenResponse } from '../types';

/**
 * Función pura que hace la llamada HTTP.
 * Convierte las credenciales al formato form-urlencoded exigido por FastAPI OAuth2.
 */
export const loginWithEmailAndPassword = async (credentials: LoginCredentials): Promise<TokenResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email); 
  formData.append('password', credentials.password);

  const response = await apiClient.post<TokenResponse>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

/**
 * Hook de React Query que exportaremos a nuestro componente UI.
 * Nos dará acceso nativo a estados como 'isPending', 'isError' y la función 'mutate'.
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: loginWithEmailAndPassword,
    onSuccess: (data) => {
      // 1. Guardamos el pasaporte en la caja fuerte (localStorage)
      setToken(data.access_token);
      
      // 2. Reignición del sistema: 
      // Forzamos una recarga completa hacia la raíz. Esto garantiza que la caché de 
      // TanStack Query empiece limpia y que el AuthBootstrapper monte el estado de hidratación.
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      // Opcional pero recomendado: Dejar un registro si las credenciales fallan
      console.error('Fallo en el protocolo de inicio de sesión:', error);
    }
  });
};