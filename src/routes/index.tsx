// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicGuard } from './PublicGuard';
import { Dashboard } from '../features/workspaces/routes/Dashboard';
import { ProjectDetail } from '../features/projects/routes/ProjectDetail';
import { AuthBootstrapper } from '../features/auth/components/AuthBootstrapper';
import { AcceptInvitation } from '../features/invitations/routes/AcceptInvitation';
import { VHubLayout } from '../features/validation/routes/VHubLayout';
import { VHubDashboard } from '../features/validation/routes/VHubDashboard';
import { VHubPlayground } from '../features/validation/routes/VHubPlayground';

import { AppLayout } from '../components/layouts/AppLayout';
import { TeamPage } from '../features/team/routes/TeamPage';
import { ModelsPage } from '../features/models/routes/ModelsPage';

import { RegisterForm } from '../features/auth/components/RegisterForm'; 
import { LandingPage } from '../features/marketing/routes/LandingPage'; 



const NotFoundStub = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-4xl font-black text-red-500">404</h1>
    <p className="text-slate-400 mt-2">El sector del espacio que buscas no existe.</p>
  </div>
);

const GatewayStub = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-[#020617] text-white">
    <h1 className="text-2xl font-bold text-emerald-500">Sala de Tránsito (Gateway)</h1>
    <p className="text-slate-400 mt-2">Próximamente: Selector de Workspaces</p>
  </div>
);

const ProfileStub = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-[#020617] text-white">
    <h1 className="text-2xl font-bold text-emerald-500">Perfil de Usuario</h1>
    <p className="text-slate-400 mt-2">Próximamente: Identidad y Accesos</p>
  </div>
);

// --- Configuración del Enrutador ---
export const router = createBrowserRouter([
  // ------------------------------------------------------------
  // SECTOR ALFA: Acceso Público (Landing, Login, Register)
  // Protegido por PublicGuard para que los logueados no vuelvan aquí
  // ------------------------------------------------------------
  {
    element: <PublicGuard />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <div className="flex items-center justify-center h-screen bg-[#020617]"><LoginForm /></div> },
      { path: '/register', element: <div className="flex items-center justify-center h-screen bg-[#020617]"><RegisterForm /></div> },
    ]
  },

  // ------------------------------------------------------------
  // SECTOR BETA: Invitaciones (Acceso Híbrido)
 
  // ------------------------------------------------------------
  { path: '/invite', 
  // es una ruta pública, pero necesita un token generado por un 
  // usario existente, por eso le llamamos (Híbrido)
    element: <AcceptInvitation /> },

  // ------------------------------------------------------------
  // SECTOR EPSILON: Espacio Común (TODOS LOS ROLES)
  // ------------------------------------------------------------
  {
    path: '/',
    // Permitimos acceso a cualquier rol validado. 
    // Fallback al login en caso de que un usuario no autenticado llegue aquí por error.
    element: <ProtectedRoute allowedRoles={['owner', 'engineer', 'member']} fallbackPath="/login" />,
    children: [
      { path: 'gateway', element: <GatewayStub /> },
      { path: 'profile', element: <ProfileStub /> },
    ]
  },

  // ------------------------------------------------------------
  // SECTOR GAMMA: Ingeniería (OWNER / ENGINEER)
  // ------------------------------------------------------------
  {
    path: '/dashboard',
    element: <ProtectedRoute allowedRoles={['owner', 'engineer']} fallbackPath="/v-hub" />,
    children: [
      {
        element: <AppLayout />, 
        children: [
          { path: '', element: <Dashboard /> },
          { path: 'projects/:projectId', element: <ProjectDetail /> },
          { path: 'team', element: <TeamPage /> },
          { path: 'models', element: <ModelsPage /> }
        ]
      }
    ]
  },

  // ------------------------------------------------------------
  // SECTOR DELTA: Validación (MEMBER)
  // ------------------------------------------------------------
  {
    path: '/v-hub',
    element: <ProtectedRoute allowedRoles={['member']} fallbackPath="/dashboard" />,
    children: [
      {
        element: <VHubLayout />,
        children: [
          { path: '', element: <VHubDashboard /> },
          { path: 'project/:projectId', element: <VHubPlayground /> }
        ]
      }
    ]
  },

  { path: '*', element: <NotFoundStub /> }
]);

export function AppRouter() {
  return (
    <AuthBootstrapper>
      <RouterProvider router={router} />
    </AuthBootstrapper>
  );
}