// src/features/invitations/api/invitations.ts
import apiClient from '../../../config/axios'; 
import type { ValidateInviteResponse, AcceptInvitePayload, AcceptInviteResponse, CreateInvitationPayload, CreateInvitationResponse } from '../types';

/**
 * 1. La Forja (POST)
 * Penélope (Owner) emite una invitación. Esto dispara el email en el backend.
 * Requiere que el usuario activo tenga el rol de OWNER en el Workspace.
 */
export const createInvitation = async (payload: CreateInvitationPayload): Promise<CreateInvitationResponse> => {
  const response = await apiClient.post<CreateInvitationResponse>('/invitations/', payload);
  return response.data;
};

/**
 * 2. El Apretón de Manos (GET)
 * Azul hace clic en el enlace del correo. Le preguntamos al backend si el token es válido
 * y obtenemos los datos (email, nombre del workspace, quién invita) para saludarla.
 */
export const validateInvitation = async (token: string): Promise<ValidateInviteResponse> => {
  // Tu apiClient ya tiene '/api' en su baseURL, así que solo pasamos la ruta final
  const response = await apiClient.get<ValidateInviteResponse>(`/invitations/${token}`);
  return response.data;
};

/**
 * 3. El Salto Final (POST)
 * Azul llenó su nombre y contraseña. Enviamos esto junto con el token
 * para crear su usuario y recibir su access_token.
 */
export const acceptInvitation = async (payload: AcceptInvitePayload): Promise<AcceptInviteResponse> => {
  const response = await apiClient.post<AcceptInviteResponse>('/invitations/accept', payload);
  return response.data;
};