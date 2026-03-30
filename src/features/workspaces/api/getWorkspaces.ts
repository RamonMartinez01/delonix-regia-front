// src/features/workspaces/api/getWorkspaces.ts
import apiClient from '../../../config/axios';
import type { Workspace } from '../types';

/**
 * Función pura para obtener la lista de Workspaces del usuario autenticado.
 * Axios inyectará automáticamente el JWT gracias al interceptor de "Aduana de Salida".
 */
export const getMyWorkspaces = async (): Promise<Workspace[]> => {
  const response = await apiClient.get<Workspace[]>('/workspaces/me');
  return response.data;
};