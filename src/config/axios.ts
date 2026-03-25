// src/config/axios.ts
import axios from 'axios';
import { getToken } from '../features/auth/utils/token'

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
    // TODO (Fase Auth): Capturar errores 401 para hacer un "logout" forzoso
    // if (error.response?.status === 401) {
    //    window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default apiClient;