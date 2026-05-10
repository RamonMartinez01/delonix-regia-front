import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInvitation } from '../api/invitations';
import type { CreateInvitationPayload, CreateInvitationResponse } from '../types';

/**
 * Hook Maestro: useCreateInvitation
 * Encargado de orquestar la emisión de Magic Links y sincronizar el estado global.
 */
export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateInvitationResponse, Error, CreateInvitationPayload>({
    // 1. La Acción: Disparamos la flecha al backend
    mutationFn: (payload: CreateInvitationPayload) => createInvitation(payload),

    // 2. La Sincronización: El efecto colateral tras el éxito
    onSuccess: () => {
      // Invalidamos la 'team-matrix' para que la tabla de invitados 
      // y miembros se refresque automáticamente.
      queryClient.invalidateQueries({
        queryKey: ['team-matrix'],
      });
      
      // Opcional: También podrías invalidar proyectos específicos si fuera necesario
      // queryClient.invalidateQueries({ queryKey: ['projects'] });
    },

    // 3. Gestión de Errores: Centralizada si quisiéramos (por ahora la pasamos al componente)
    onError: (error: any) => {
      console.error('Error en la forja de invitación:', error.response?.data || error.message);
    }
  });
};