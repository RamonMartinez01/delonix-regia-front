// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../features/auth/utils/token';

export const ProtectedRoute = () => {
  const token = getToken();

  if (!token) {
    // Si no hay token, lo expulsamos. 
    // "replace" es crucial: reescribe el historial del navegador para que el usuario 
    // no pueda presionar el botón "Atrás" e intentar forzar la entrada.
    return <Navigate to="/login" replace />;
  }

  // <Outlet /> es el "agujero" por donde React Router inyectará las rutas hijas (ej. el Dashboard)
  return <Outlet />;
};