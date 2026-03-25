// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginForm } from '../features/auth/components/LoginForm';

// --- Stubs Temporales (Marcadores de posición) ---
const LoginStub = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-3xl font-bold text-emerald-400">Portal de Acceso</h1>
    <p className="text-slate-400 mt-2">Pantalla de Login (Fase Auth en construcción)</p>
  </div>
);

// --- Stubs Temporales (Marcadores de Posición) ---
const DashboardStub = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <h1 className="text-3xl font-bold text-blue-400">Panel de Control MLOps</h1>
    <p className="text-slate-400 mt-2">Aquí vivirán los Proyectos y Experimentos</p>
  </div>
);

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
    path: '/',
    element: <DashboardStub />,
    // Nota: Más adelante, esta ruta se convertirá en un "Layout Protegido"
  },
  {
    path: '*', // El comodín '*' atrapa cualquier URL que no coincida con las anteriores
    element: <NotFoundStub />,
  }
]);

// Exportamos el proveedor que inyectaremos en nuestra App
export function AppRouter() {
  return <RouterProvider router={router} />;
}