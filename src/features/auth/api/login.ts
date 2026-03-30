
// src/features/auth/api/login.ts
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../config/axios'
import type { LoginCredentials, TokenResponse } from '../types';

/**
 * Función pura que hace la llamada HTTP.
 * Convierte las credenciales al formato form-urlencoded exigido por FastAPI OAuth2.
 */
export const loginWithEmailAndPassword = async (credentials: LoginCredentials): Promise<TokenResponse> => {
  // Transformamos el JSON a Form Data (OAuth2 requiere 'username', así que mapeamos el email)
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
      // Cuando la mutación sea exitosa, por ahora solo veremos el token en consola.
      console.log('Token recibido de FastAPI:', data.access_token);
    },
  });
};