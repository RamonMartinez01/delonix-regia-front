// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { ProtectedRoute } from './ProtectedRoute';
import { Dashboard } from '../features/workspaces/routes/Dashboard';
import { ProjectDetail } from '../features/projects/routes/ProjectDetail';
import { AuthBootstrapper } from '../features/auth/components/AuthBootstrapper';
import { AcceptInvitation } from '../features/invitations/routes/AcceptInvitation';
import { VHubLayout } from '../features/validation/routes/VHubLayout';
import { VHubDashboard } from '../features/validation/routes/VHubDashboard';
import { VHubPlayground } from '../features/validation/routes/VHubPlayground';
// Importaciones de ExperimentDetail y DeploymentDetail eliminadas. Ya no son vistas principales.

const NotFoundStub = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-4xl font-black text-red-500">404</h1>
    <p className="text-slate-400 mt-2">El sector del espacio que buscas no existe.</p>
  </div>
);

// --- Configuración del Enrutador ---
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <div className="flex flex-col items-center justify-center h-screen w-full"><LoginForm /></div>,
  },
  {
    path: '/invite',
    element: <AcceptInvitation />,
  },
  
  // ==========================================
  // REINO 1: EL DASHBOARD DE PENÉLOPE (Ingenieros invitados y OWNER)
  // ==========================================
  {
    path: '/',
    element: <ProtectedRoute allowedRoles={['owner', 'engineer']} fallbackPath="/v-hub" />,
    children: [
      { path: '', element: <Dashboard /> },
      // La única ruta necesaria ahora es el Centro de proyectos (ProjectDetail). 
      // Los experimentos y despliegues se manejan internamente con el estado del componente.
      { path: 'projects/:projectId', element: <ProjectDetail /> }
    ]
  },

  // ==========================================
  // REINO 2: EL VALIDATION HUB DE AZUL (userPersona Stakeholders, role="MEMBER" )
  // ==========================================
  {
    path: '/v-hub',
    element: <ProtectedRoute allowedRoles={['member']} fallbackPath="/" />,
    children: [
      {
        path: '',
        element: <VHubLayout />,
        children: [
          { path: '', element: <VHubDashboard /> },
          { path: 'project/:projectId', element: <VHubPlayground /> }
        ]
      }
    ]
  },

  {
    path: '*',
    element: <NotFoundStub />,
  }
]);

export function AppRouter() {
  return (
    <AuthBootstrapper>
      <RouterProvider router={router} />
    </AuthBootstrapper>
  );
}