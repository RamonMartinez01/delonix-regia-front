// src/features/projects/api/getProject.ts
import apiClient from '../../../config/axios';
import type { Project } from '../types';

/**
 * Función pura para obtener el detalle de un proyecto específico.
 * El ID del workspace ya viaja en los interceptores de Axios.
 */
export const getProject = async (projectId: string): Promise<Project> => {
  const response = await apiClient.get<Project>(`/projects/${projectId}`);
  return response.data;
};