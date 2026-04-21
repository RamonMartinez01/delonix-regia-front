// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { ProtectedRoute } from './ProtectedRoute';
import { Dashboard } from '../features/projects/routes/Dashboard';
import { ProjectDetail } from '../features/projects/routes/ProjectDetail';
import { AuthBootstrapper } from '../features/auth/components/AuthBootstrapper';
import { ExperimentDetail } from '../features/experiments/routes/ExperimentDetail';
import { DeploymentDetail } from '../features/deployments/routes/DeploymentDetail';
import { AcceptInvitation } from '../features/invitations/routes/AcceptInvitation';
import { VHubLayout } from '../features/valitation/routes/VHubLayout';
import { VHubDashboard } from '../features/valitation/routes/VHubDashboard'
import { VHubPlayground } from '../features/valitation/routes/VHubPlayground';


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
  // REINO 1: EL DASHBOARD DE PENÉLOPE (Ingenieros y Owners)
  // ==========================================
  {
    path: '/',
    // Si Azul (member) intenta entrar aquí, la expulsamos a /v-hub
    element: <ProtectedRoute allowedRoles={['owner', 'engineer']} fallbackPath="/v-hub" />,
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'projects/:projectId', element: <ProjectDetail /> },
      { path: 'projects/:projectId/experiments/:experimentId', element: <ExperimentDetail /> },
      { path: 'projects/:projectId/deployments/:deploymentId', element: <DeploymentDetail /> }
    ]
  },

  // ==========================================
  // REINO 2: EL VALIDATION HUB DE AZUL (Stakeholders)
  // ==========================================
  {
    path: '/v-hub',
    // Si un ingeniero sin permisos entra, lo devolvemos a su dashboard
    element: <ProtectedRoute allowedRoles={['member']} fallbackPath="/" />,
    children: [
      {
        path: '', // Coincide con /v-hub
        element: <VHubLayout />,
        children: [
          { path: '', element: <VHubDashboard /> },
          // En el futuro agregaremos aquí la "Arena de Pruebas":
          // { path: 'project/:projectId', element: <VHubPlayground /> }
        ]
      }
    ]
  },

  {
  path: '/v-hub',
  element: <ProtectedRoute allowedRoles={['member']} fallbackPath="/" />,
  children: [
    {
      path: '',
      element: <VHubLayout />,
      children: [
        { path: '', element: <VHubDashboard /> },
        // AGREGAMOS ESTA RUTA
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