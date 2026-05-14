// src/features/auth/utils/token.ts
// const TOKEN_KEY = 'delonix_jwt';

/**
 * 🚮 ARCHIVO EN PROCESO DE DEPRECACIÓN
 * Las cookies son manejadas por el navegador. Estas funciones 
 * retornan valores nulos para asegurar que nadie intente 
 * guardar secretos en el localStorage.
 */

export const setToken = (token: string) => {
  // Ignoramos cualquier intento de guardar tokens manualmente.
  return token;
};

export const getToken = (): string | null => {
 // Siempre devolvemos null para que los hooks entiendan que 
  // no hay un token local que leer.
  return null
};

export const removeToken = () => {
  // No hay nada que remover en localStorage. 
  // La limpieza real ocurre en el endpoint /logout.
  return;
};