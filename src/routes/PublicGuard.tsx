// src/routes/PublicGuard.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const PublicGuard = () => {
  const { user, isHydrating, getActiveRole } = useAuthStore();
  const location = useLocation();

  if (isHydrating) return null; 

  if (user) {
    const role = getActiveRole();

   // EXCEPCIONES DE TERRITORIO NEUTRAL:
    const isAttemptingUpgrade = location.pathname === '/register' && role !== 'owner';
    // Agregamos el Landing Page como zona permitida
    const isLandingPage = location.pathname === '/'; 

    // Si cumple alguna de las excepciones, abrimos las puertas
    if (isAttemptingUpgrade || isLandingPage) {
      return <Outlet />;
    }

    // Para rutas prohibidas (como /login teniendo sesión), lo redirigimos a su consola.
    return <Navigate to={role === 'member' ? '/v-hub' : '/dashboard'} replace />;
  }

  // Si no hay usuario, el acceso a rutas públicas es libre.
  return <Outlet />;
};