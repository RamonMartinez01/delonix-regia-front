// src/config/axios.ts
import axios from 'axios';
import { getToken } from '../features/auth/utils/token'
//import { removeActiveWorkspace } from '../features/workspaces/utils/workspace';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: 'https://api-delonix.lux-geneve.com/api', 
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

     // ZUSTAND: Con esto leemos el store fuera de React
     const workspaceId = useAuthStore.getState().activeWorkspaceId;
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
  (response) => response,
  (error) => {
    // Si FastAPI nos grita "¡No Autorizado!" (Token expirado o inválido)
    if (error.response?.status === 401) {
      // 1. Ejecutamos la rutina de limpieza total desde nuestro store
      useAuthStore.getState().logout();

      // 2. Expulsión dura
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;