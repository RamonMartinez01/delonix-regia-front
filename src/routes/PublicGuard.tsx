// src/routes/PublicGuard.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const PublicGuard = () => {
  const { user, isHydrating, getActiveRole } = useAuthStore();
  const location = useLocation();

  if (isHydrating) return null; 

  if (user) {
    const role = getActiveRole();

    // LA EXCEPCIÓN DE SOBERANÍA:
    // Si el usuario es un invitado (MEMBER/ENGINEER) y está intentando
    // entrar a /register, le permitimos el paso para que realice su "Upgrade".
    const isAttemptingUpgrade = location.pathname === '/register' && role !== 'owner';

    if (isAttemptingUpgrade) {
      return <Outlet />;
    }

    // 3. Para cualquier otro caso (como intentar ir a /login teniendo ya sesión),
    // lo redirigimos a su puerto base según su rol actual.
    return <Navigate to={role === 'member' ? '/v-hub' : '/dashboard'} replace />;
  }

  // 4. Si no hay usuario, el acceso a rutas públicas es libre.
  return <Outlet />;
};