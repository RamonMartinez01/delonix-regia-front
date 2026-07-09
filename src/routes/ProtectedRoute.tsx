// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { ShieldCheck } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Ej: ['owner', 'engineer', 'member']
  fallbackPath?: string;   // Dónde enviarlos si no tienen permiso
}

export const ProtectedRoute = ({ allowedRoles, fallbackPath = '/login' }: ProtectedRouteProps) => {
  const { user, isHydrating, getActiveRole } = useAuthStore();

  // 1. La app está arrancando (Estado de Carga Estructural)
  if (isHydrating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-[#F7F7F5] text-[#111111] transition-colors duration-500">
        
        {/* El Sello de Seguridad */}
        <div className="relative mb-5">
          <div className="w-14 h-14 bg-white border border-[#D1D1CD] rounded-full flex items-center justify-center shadow-sm">
            <ShieldCheck size={24} strokeWidth={2} className="text-[#A1A19A]" />
          </div>
          {/* Anillo de progreso físico */}
          <div className="absolute inset-0 border-2 border-transparent border-t-brand-primary rounded-full animate-spin" />
        </div>
        
        <p className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest animate-pulse">
          Sincronizando identidad...
        </p>
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
  if (allowedRoles && currentRole) {
    const roleNormalized = currentRole.toLowerCase(); 
    
    if (!allowedRoles.includes(roleNormalized)) {
      return <Navigate to={fallbackPath} replace />;
    }
  } else if (allowedRoles && !currentRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  // 5. Permiso Concedido
  return <Outlet />;
};