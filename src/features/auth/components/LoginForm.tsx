// src/features/auth/components/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../api/login';
import { setToken } from '../utils/token';
import { getMyWorkspaces } from '../../workspaces/api/getWorkspaces';
import { setActiveWorkspace } from '../../workspaces/utils/workspace';

export const LoginForm = () => {
  // Estado local estrictamente para los inputs controlados
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado extra para que el botón no se habilite a mitad del proceso
  const [isFetchingWorkspaces, setIsFetchingWorkspaces] = useState(false);

  const navigate = useNavigate();
  const { mutate, isPending, isError } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Disparamos la petición HTTP al backend
    mutate(
      { email, password },
      // Hacemos el onSuccess asíncrono para encadenar las peticiones
      {
        onSuccess: async (data) => {
          // 1. Guardamos el pasaporte. Al ser síncrono, el interceptor de Axios 
          // ya podrá leerlo para la siguiente petición en milisegundos.
          setToken(data.access_token);

          // 2. Activamos la barrera de carga secundaria
          setIsFetchingWorkspaces(true);

          try {
            // 3. Petición Imperativa: Descubrimos los WS delusuario
            const workspaces = await getMyWorkspaces();

            // 4. Si tiene al menos un workspace, guardamos el ID del primero como activo
            if (workspaces.length > 0) {
              setActiveWorkspace(workspaces[0].id);
            }

            // 5. Ahora sí, con Pasaporte (token) y Boleto en mano (workspace_id), abrimos las puertas
            navigate('/');
          } catch (error) {
            console.error("Error al cargar la flota de workspaces:", error);
            // Aquí en el futuro podrías mostrar un toast de error
          } finally {
            setIsFetchingWorkspaces(false);
          }
        },
      }
    );
  };
  // El botón estará deshabilitado si está haciendo login O si está buscando workspaces
  const isLoading = isPending || isFetchingWorkspaces;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-emerald-400">Delonix Regia</h2>
        <p className="text-sm text-slate-400 mt-2">Acceso Seguro a MLOps</p>
      </div>

      {isError && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
          Credenciales inválidas o error de conexión.
        </div>
      )}

      <div className="mb-4">
        <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="email">
          Correo Electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          placeholder="correo@ejemplo.com"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-slate-300 text-sm font-bold mb-2" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-slate-900 border border-slate-600 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          placeholder="********"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
      >
        {isPending ? 'Autenticando...' : isFetchingWorkspaces ? 'Cargando Entorno...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};