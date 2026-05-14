// src/features/auth/api/login.ts
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { LoginCredentials, AuthResponse } from '../types';

/**
 * Función pura que hace la llamada HTTP.
 * FastAPI detectará las credenciales y enviará el header Set-Cookie automáticamente.
 */
export const loginWithEmailAndPassword = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email); 
  formData.append('password', credentials.password);

  const response = await apiClient.post<AuthResponse>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

/**
 * Hook de React Query para la UI.
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: loginWithEmailAndPassword,
    onSuccess: () => {
      // LA MANIOBRA SILENCIOSA:
      // No llamamos a setToken(). El navegador ya guardó la cookie 
      // en el momento en que 'apiClient.post' recibió la respuesta.

      // Reignición del sistema:
      // Al redirigir a /dashboard, el AuthBootstrapper se activará,
      // lanzará el /me (que ahora sí tendrá la cookie) y cargará al usuario.
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      console.error('Fallo en el protocolo de inicio de sesión:', error);
    }
  });
};