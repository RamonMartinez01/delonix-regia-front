// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const ProtectedRoute = () => {
  // Nos suscribimos selectivamente al usuario y a la bandera de hidratación
  const { user, isHydrating } = useAuthStore();

  // 1. Paciencia: Si la app está arrancando y preguntando a FastAPI quién somos
  if (isHydrating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-slate-900 text-slate-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-sm tracking-widest animate-pulse">Sincronizando identidad...</p>
      </div>
    );
  }

  // 2. Veredicto Final: Terminó de cargar y NO hay un usuario válido. Lo redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Permiso Concedido: El usuario existe en la memoria global.
  // Aquí React Router inyectará las rutas hijas (como el Dashboard).
  return <Outlet />;
};