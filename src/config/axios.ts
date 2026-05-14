// src/config/axios.ts
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: 'https://api-delonix.lux-geneve.com/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  // Ahora que el backend envía Set-Cookie, necesitamos esto para que 
  // el navegador incluya la cookie en cada petición de forma automática.
  withCredentials: true,
});

// Aduana de Salida (Interceptores de Petición)
apiClient.interceptors.request.use(
  (config) => {


    // ZUSTAND: Con esto leemos el store fuera de React
    const workspaceId = useAuthStore.getState().activeWorkspaceId;
    if (workspaceId && config.headers) {
      config.headers['X-Workspace-ID'] = workspaceId;
    }

    return config;
  },
  (error) => Promise.reject(error)
  
);

// Aduana de Entrada (Interceptores de Respuesta)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si FastAPI nos dice "No Autorizado"
    if (error.response?.status === 401) {
      // IMPORTANTE: Solo disparamos logout si NO estamos en la landing page
      // para evitar bucles infinitos de redirección.
      if (window.location.pathname !== '/') {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;