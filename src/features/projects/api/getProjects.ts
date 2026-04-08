// src/features/projects/api/getProjects.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import { useAuthStore } from '../../../stores/authStore';
import type { Project } from '../types';

/**
 * Función pura que hace la petición HTTP GET al backend.
 * Nota: No necesitamos pasar el ID aquí porque nuestro interceptor de Axios 
 * (la aduana) ya lo lee directamente de Zustand y lo inyecta en los headers.
 */
export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>('/projects');
  return response.data;
};

/**
 * Hook de React Query que exportaremos a nuestros componentes UI.
 */
export const useProjects = () => {
  // 1. Obtenemos el ID del workspace activo desde Zustand
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  return useQuery({
    // 2. [CLAVE MULTI-TENANT]: Separamos la caché por Workspace.
    // Si el usuario cambia de espacio, React Query sabrá que es una petición distinta.
    queryKey: ['projects', activeWorkspaceId], 
    
    queryFn: getProjects,
    
    // 3. [PREVENCIÓN DE CARRERA]: Solo ejecutamos la petición HTTP 
    // si el ID del workspace ya existe en memoria.
    enabled: !!activeWorkspaceId, 
  });
};