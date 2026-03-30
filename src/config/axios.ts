// src/config/axios.ts
import axios from 'axios';
import { getToken, removeToken } from '../features/auth/utils/token'
import { getActiveWorkspace, removeActiveWorkspace } from '../features/workspaces/utils/workspace';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  // Nota de seguridad: conCredentials en true es necesario si usamos cookies, 
  // pero como usaremos JWT en el header 'Authorization', lo omitimos por ahora.
});

// Aduana de Salida (Interceptores de Petición)
apiClient.interceptors.request.use(
  (config) => {
    // Recuperar el token del almacenamiento seguro.
     const token = getToken();
     if (token && config.headers) {
       config.headers.Authorization = `Bearer ${token}`;
     }

     const workspaceId = getActiveWorkspace();
     if (workspaceId && config.headers) {
       config.headers['X-Workspace-ID'] = workspaceId;
     }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Aduana de Entrada (Interceptores de Respuesta)
apiClient.interceptors.response.use(
  (response) => {
    // Si la petición fue exitosa (200-299), dejamos pasar los datos intactos
    return response;
  },
  (error) => {
    // Si FastAPI nos grita "¡No Autorizado!" (Token expirado o inválido)
    if (error.response?.status === 401) {
      removeToken(); // Removemos el token caducado
      removeActiveWorkspace(); // Limpiamos también el rastro del workspace

      // Expulsión dura: Usamos window.location en lugar del navigate de React
      // para forzar una recarga completa, limpiando toda la caché de memoria y TanStack Query
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;