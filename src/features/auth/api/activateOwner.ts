// src/features/auth/api/activateOwner.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../config/axios';
import type { AuthResponse, LoginCredentials } from '../types';
import { getMe } from './getMe';
import { setActiveWorkspace } from '../../workspaces/utils/workspace';

/**
 * Función para el protocolo de ascenso a OWNER.
 * El backend se encargará de inyectar la nueva cookie HttpOnly.
 */
export const activateOwnerAccount = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/activate-owner', credentials);
  return response.data;
};

/**
 * Refactorizado para el paradigma de Cookies.
 */
export const useActivateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateOwnerAccount,
    onSuccess: async () => {
      
      try {
        // 1. PETICIÓN IMPERATIVA: 
        // Pregunta al backend por el nuevo perfil. Axios enviará la NUEVA cookie (OWNER).
        const meData = await getMe();

          // 2. IDENTIFICAR EL Workspace: 
        const personalWS = meData.workspaces.find(
          (ws) => ws.role.toLowerCase() === 'owner'
        );

        if (personalWS) {
          // 3. Marcamos el ID del nuevo workspace como el activo en LocalStorage
          setActiveWorkspace(personalWS.workspace_id);
        }

        // 4. LIMPIEZA Y REINICIO:
        // Borramos toda la caché vieja (que tenía datos de invitado)
        queryClient.clear();
        
        // Saltamos al dashboard ya con la identidad de OWNER cargada
        window.location.href = '/dashboard';

        } catch (error) {
          console.error("Error al intentar localizar el nuevo Trono:", error);
          window.location.href = '/dashboard';
        }
      }
    
  });
};