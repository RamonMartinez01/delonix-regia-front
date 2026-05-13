// src/features/auth/api/register.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import { setToken } from '../utils/token';
import type { TokenResponse } from '../types';

interface RegisterCredentials {
    email: string;
    full_name: string;
    password: string;
}

export const registerUser = async (credentials: RegisterCredentials): Promise<TokenResponse> => {
    const response = await apiClient.post('/auth/register', credentials);
    return response.data;
};

export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            if (data.access_token) {
                // 1. Guardamos el token
                setToken(data.access_token);

                // 2. Limpiamos TODA la caché de React Query. 
                // Esto es vital porque el nuevo usuario no debe ver NADA de una sesión anterior 
                // (especialmente útil en máquinas compartidas o pruebas rápidas).
                queryClient.clear();

                // 3. Salto al hiperespacio. 
                // Usamos window.location para garantizar que el AuthBootstrapper 
                // capture el nuevo estado de hidratación limpiamente.
                window.location.href = '/dashboard';
            }
        }
    });
};