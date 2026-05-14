// src/features/auth/api/register.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { AuthResponse } from '../types';

interface RegisterCredentials {
    email: string;
    full_name: string;
    password: string;
}

/**
 * Función que dispara la creación del usuario.
 * El backend responderá con el header Set-Cookie.
 */
export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', credentials);
    return response.data;
};


/**
 * Hook de Registro:
 * Delega toda la responsabilidad criptográfica al navegador.
 */
export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {


            // Limpiamos TODA la caché de React Query. 
            queryClient.clear();

            // Usamos window.location para garantizar que el AuthBootstrapper 
            // capture el nuevo estado de hidratación limpiamente.
            window.location.href = '/dashboard';
        }

    });
};