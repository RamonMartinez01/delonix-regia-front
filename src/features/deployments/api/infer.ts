// src/features/deployments/api/infer.ts
import apiClient from '../../../config/axios';

interface InferenceResponse {
  status: string;
  prediction: {
    label: string;
    confidence: number;
  };
  message: string;
}

/**
 * Función pura para enviar datos al motor de inferencia de un despliegue.
 */
export const simulateInference = async (deploymentId: string, text: string): Promise<InferenceResponse> => {
  const response = await apiClient.post<InferenceResponse>(`/deployments/${deploymentId}/infer`, {
    input_data: { text }
  });
  return response.data;
};