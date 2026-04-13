// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';
import { ProtectedRoute } from './ProtectedRoute';
import { Dashboard } from '../features/projects/routes/Dashboard';
import { ProjectDetail } from '../features/projects/routes/ProjectDetail';
import { AuthBootstrapper } from '../features/auth/components/AuthBootstrapper';
import { ExperimentDetail } from '../features/experiments/routes/ExperimentDetail';
import { DeploymentDetail } from '../features/deployments/routes/DeploymentDetail';


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
    element: (
        <div className="flex flex-col items-center justify-center h-screen w-full">
          <LoginForm />
        </div>
      ),
  },
  {
    // 2. La ruta raíz ahora es dueña del Guardia
    path: '/',
    element: <ProtectedRoute />,
    // 3. Todo lo que esté aquí adentro ESTÁ PROTEGIDO
    children: [
      {
        path: '', // Coincide exactamente con '/'
        element: <Dashboard />,
      },
      {
        path: 'projects/:projectId',
        element: <ProjectDetail />,
      },
      {
        path: 'projects/:projectId/experiments/:experimentId', 
        element: <ExperimentDetail />
      },
      {
        path: 'projects/:projectId/deployments/:deploymentId',
        element: <DeploymentDetail />
      }
    ]
  },
  {
    path: '*', // El comodín '*' atrapa cualquier URL que no coincida con las anteriores
    element: <NotFoundStub />,
  }
]);

// Exportamos el proveedor que inyectaremos en nuestra App
export function AppRouter() {
  return (
    <AuthBootstrapper>
      <RouterProvider router={router} />
    </AuthBootstrapper>
  );
}