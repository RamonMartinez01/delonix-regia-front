// src/features/projects/api/getProjects.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { Project } from '../types';

/**
 * Función pura que hace la petición HTTP GET al backend.
 */
export const getProjects = async (): Promise<Project[]> => {
  // La URL base ya es la que tenemos en apiClient, así que solo pedimos /projects
  const response = await apiClient.get<Project[]>('/projects');
  return response.data;
};

/**
 * Hook de React Query que exportaremos a nuestros componentes UI.
 * Gestiona automáticamente el estado de carga, errores y la caché.
 */
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'], // La etiqueta de caché para esta consulta
    queryFn: getProjects,   // La función que se ejecutará si no hay caché válida
  });
};