// src/features/projects/api/createProject.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { Project, ProjectCreate } from '../types';

/**
 * Función pura (El Misil HTTP)
 * Toma los datos del formulario y los envía a FastAPI.
 * El interceptor de Axios ya se encarga de inyectar el JWT y el X-Workspace-ID.
 */
export const createProjectFn = async (data: ProjectCreate): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects/', data);
    return response.data;
};

/**
 * Hook personalizado (El Cerebro Asíncrono)
 * Envuelve la mutación y maneja la reactividad de la interfaz.
 */
export const useCreateProject = () => {
    // queryClient es el administrador central de la caché en TanStack Query
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProjectFn,
        onSuccess: () => {
            // Cuando el servidor responde 201 Created,
            // invalidamos la caché de la lista de proyectos.
            // Esto obliga a ProjectsList a hacer un refetch automático en segundo plano.
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};