// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Ej: ['owner', 'engineer', 'member']
  fallbackPath?: string;   // Dónde enviarlos si no tienen permiso
}

export const ProtectedRoute = ({ allowedRoles, fallbackPath = '/login' }: ProtectedRouteProps) => {
  // Nos suscribimos selectivamente al usuario y a la bandera de hidratación
  const { user, isHydrating, getActiveRole } = useAuthStore();

  // 1. La app está arrancando y preguntando a FastAPI quién somos
  if (isHydrating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-900 text-slate-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-sm tracking-widest animate-pulse">Sincronizando identidad...</p>
      </div>
    );
  }

  // 2. EJECUTAMOS la función para obtener el rol real
  const currentRole = getActiveRole(); 

  // 3. Veredicto 1: No está logueado
  if (!user && !isHydrating) {
    return <Navigate to="/" replace />;
  }

  // 4. Veredicto 2: Control de Acceso por Rol (RBAC)
  // Si mandamos allowedRoles y el rol del usuario no está en la lista, lo expulsamos.
 if (allowedRoles && currentRole) {
    // Normalizamos a minúsculas por seguridad (ej. "MEMBER" -> "member")
    const roleNormalized = currentRole.toLowerCase(); 
    
    if (!allowedRoles.includes(roleNormalized)) {
      return <Navigate to={fallbackPath} replace />;
    }
  } else if (allowedRoles && !currentRole) {
    // Si la ruta exige roles, pero el usuario no tiene rol en este workspace, lo expulsamos
    return <Navigate to={fallbackPath} replace />;
  }

  // 4. Permiso Concedido
  return <Outlet />;
};