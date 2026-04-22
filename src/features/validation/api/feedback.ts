// src/features/validation/api/feedback.ts
import apiClient from '../../../config/axios';
import type { FeedbackCreate, FeedbackResponse } from '../types';

/**
 * EMISIÓN: Azul envía su calificación al modelo.
 */
export const createFeedback = async (
  deploymentId: string,
  data: FeedbackCreate
): Promise<FeedbackResponse> => {
  const response = await apiClient.post<FeedbackResponse>(
    `/feedback/deployment/${deploymentId}`,
    data
  );
  return response.data;
};

/**
 * AUDITORÍA: Obtenemos el historial de inferencias.
 */
export const getFeedbackForDeployment = async (
  deploymentId: string
): Promise<FeedbackResponse[]> => {
  const response = await apiClient.get<FeedbackResponse[]>(
    `/feedback/deployment/${deploymentId}`
  );
  return response.data;
};