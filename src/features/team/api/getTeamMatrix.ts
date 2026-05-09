// src/features/team/api/getTeamMatrix.ts
import apiClient from '../../../config/axios';
import type { TeamMatrix } from '../types';

/**
 * Función Pura HTTP
 * Se encarga de solicitar la matriz consolidada del equipo al backend.
 */
export const getTeamMatrix = async (): Promise<TeamMatrix> => {
  const response = await apiClient.get<TeamMatrix>('/members/');
  return response.data;
};