// src/config/query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1. Reintentos: Si la red falla, reintenta 1 vez de forma silenciosa antes de mostrar error.
      retry: 1,
      
      // 2. Foco: Evita hacer peticiones al backend cada vez que el usuario cambia de pestaña 
      // en el navegador (ahorra muchísimos recursos en nuestro Droplet).
      refetchOnWindowFocus: false,
      
      // 3. Frescura (Stale Time): Los datos se consideran "frescos" por 5 minutos. 
      // Durante este tiempo, si el usuario navega entre vistas, se sirve la caché instantáneamente.
      staleTime: 5 * 60 * 1000, 
    },
  },
});