// src/features/auth/api/activateOwner.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import { setToken } from '../utils/token';
import type { TokenResponse, LoginCredentials } from '../types';
import { getMe } from './getMe';
import { setActiveWorkspace } from '../../workspaces/utils/workspace';

/**
 * Función que golpea el protocolo de ascenso a OWNER.
 * Reutilizamos LoginCredentials porque Azul enviará Email y Password.
 */
export const activateOwnerAccount = async (credentials: LoginCredentials): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>('/auth/activate-owner', credentials);
  return response.data;
};

/**
 * El Martillo de Soberanía:
 * Transforma a un invitado en un OWNER y refresca su sesión.
 */
export const useActivateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateOwnerAccount,
    onSuccess: async (data) => {
      if (data.access_token) {
        // 1. Reemplazamos el token viejo (MEMBER) por el nuevo (OWNER)
        setToken(data.access_token);

       try {
          // 2. PETICIÓN IMPERATIVA: 
          // Antes de saltar al Dashboard, preguntamos al backend por la lista fresca de WS.
          const meData = await getMe();

          // 3. IDENTIFICAR EL TRONO: 
          // Buscamos en el array de 'workspaces' aquel donde el rol sea estrictamente 'owner'
          const personalWS = meData.workspaces.find(
            (ws) => ws.role.toLowerCase() === 'owner'
          );

          if (personalWS) {
            // 4. Marcamos el ID del nuevo workspace como el activo
            setActiveWorkspace(personalWS.workspace_id);
          }

          // 5. Reignición
          queryClient.clear();
          window.location.href = '/dashboard';

        } catch (error) {
          console.error("Error al intentar localizar el nuevo Trono:", error);
          // Fallback: Si algo falla, al menos que entre al dashboard general
          window.location.href = '/dashboard';
        }
      }
    }
  });
};