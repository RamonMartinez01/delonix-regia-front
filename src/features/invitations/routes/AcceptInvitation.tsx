// src/features/invitations/routes/AcceptInvitation.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { validateInvitation, acceptInvitation } from '../api/invitations';
import type { ValidateInviteResponse } from '../types';
import { setToken } from '../../auth/utils/token';

/**
 * COMPONENTE: AcceptInvitation (La Pista de Aterrizaje / "Alfombra Roja")
 * DOMINIO: Invitations (Feature-Sliced Design)
 * * PROPÓSITO:
 * Intercepta a los usuarios que llegan a través de un Link de invitación
 * Valida su identidad con el backend, les permite crear sus 
 * credenciales y los inyecta directamente al Workspace sin pasar por el Login.
 */
export const AcceptInvitation = () => {
    // --- 1. ENRUTAMIENTO Y PARÁMETROS ---
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token'); // Extrae el UUID de la URL (?token=...)

    // --- 2. ESTADOS DE LA INTERFAZ (UI/UX) ---
    // Controla las 3 fases visuales del componente antes de someter el formulario
    const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
    const [inviteData, setInviteData] = useState<ValidateInviteResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // --- 3. ESTADOS DEL FORMULARIO DE REGISTRO ---
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado para la pantalla de bienvenida (Transición fluida post-registro)
    const [isAccepted, setIsAccepted] = useState(false); 

    /**
     * ACTO 1: El Apretón de Manos (Validación del Token)
     * Se ejecuta una sola vez al montar el componente. 
     * Pregunta a FastAPI si el UUID es válido, a qué Workspace pertenece y quién invita.
     */
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setErrorMessage('No se encontró ningún código de invitación.');
                return;
            }
            try {
                const data = await validateInvitation(token);
                setInviteData(data); // Guardamos la data del Workspace para personalizar la UI
                setStatus('ready');
            } catch (err: any) {
                setStatus('error');
                // Mostramos el error exacto que FastAPI nos devuelve (ej. "Token expirado")
                setErrorMessage(err.response?.data?.detail || 'Invitación inválida.');
            }
        };
        verifyToken();
    }, [token]);

    /**
     * ACTO 2: El Salto Final (Creación de Cuenta)
     * Envía la nueva contraseña al backend, recibe el JWT y prepara el entorno.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        // BARRERA DE VALIDACIÓN: UX básica para evitar typos en la contraseña
        if (password !== confirmPassword) {
            setErrorMessage('Las contraseñas no coinciden. Por favor, verifícalas.');
            return; // Abortamos la petición HTTP
        }

        setIsSubmitting(true);
        try {
            // FastAPI se encarga de hacer el hash, crear el User, vincular el UserWorkspace y quemar el token.
            const response = await acceptInvitation({ token, full_name: fullName, password });

            // PERSISTENCIA FÍSICA: Guardamos el JWT en localStorage.
            // Esto es vital para que el AuthBootstrapper lo detecte y re-hidrate Zustand.
            setToken(response.access_token);

            // UX TRANSIÓN: Activamos la vista de éxito en lugar de redirigir en frío
            setIsAccepted(true);

        } catch (err: any) {
            setErrorMessage(err.response?.data?.detail || 'Error al aceptar la invitación.');
            setIsSubmitting(false);
        }
    };


    // ==========================================
    // RENDERIZADOS CONDICIONALES
    // ==========================================

    // VISTA 1: Cargando (Validando el enlace con el backend)
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-emerald-400 animate-pulse text-lg tracking-widest">
                    Preparando tu espacio de trabajo...
                </div>
            </div>
        );
    }

    // VISTA 2: Error (Enlace roto, usado o expirado)
    if (status === 'error') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-8 rounded-xl border border-red-500/30 max-w-md w-full text-center">
                    <h2 className="text-red-400 font-bold text-xl mb-4">Acceso Denegado</h2>
                    <p className="text-slate-300 mb-6">{errorMessage}</p>
                    <button onClick={() => navigate('/login')} className="text-emerald-500 hover:underline">
                        Ir al inicio de sesión
                    </button>
                </div>
            </div>
        );
    }

    // VISTA 3: Éxito y Bienvenida (Cuenta creada correctamente)
    if (isAccepted) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-10 rounded-2xl border border-emerald-500/30 max-w-md w-full text-center shadow-2xl">
                    <div className="text-5xl mb-6">🚀</div>
                    <h2 className="text-2xl font-bold text-white mb-2">¡Bienvenida, {fullName}!</h2>
                    <p className="text-slate-400 mb-8">
                        Ya eres parte de <span className="text-emerald-400 font-medium">{inviteData?.workspace_name}</span>.
                        Estamos preparando tus herramientas de análisis.
                    </p>

                    <button
                        // HACK ARQUITECTÓNICO: "Hard Redirect" 
                        // Forzamos la recarga del navegador (window.location.href) en lugar de navigate('/').
                        // Esto obliga al AuthBootstrapper a arrancar desde cero, leer el LocalStorage 
                        // y evitar que ProtectedRoute nos expulse por un estado desincronizado.
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
                    >
                        Entrar al Centro de Comando
                    </button>
                </div>
            </div>
        );
    }

    // VISTA 4: Formulario Principal (La "Alfombra Roja")
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-md w-full shadow-2xl">

                {/* --- HEADER: Saludo Personalizado --- */}
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-emerald-900/50 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-emerald-500/30">
                        ✨
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">¡Hola!</h1>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        <span className="text-emerald-400 font-medium">{inviteData?.invited_by_name}</span> te ha invitado a colaborar en el espacio <span className="text-emerald-400 font-medium">{inviteData?.workspace_name}</span>.
                    </p>
                    {inviteData?.project_name && (
                        <p className="text-slate-500 text-xs mt-2">
                            Proyecto asignado: {inviteData.project_name}
                        </p>
                    )}
                </div>

                {/* --- FORMULARIO --- */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    
                    {/* Identidad Inmutable: El email viene del backend y no se puede editar (Seguridad Multi-tenant) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">
                            Tu correo autorizado
                        </label>
                        <input
                            type="email"
                            disabled
                            value={inviteData?.email || ''}
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300">
                            ¿Cómo te llamas?
                        </label>
                        <p className="text-slate-500 text-xs mt-1 mb-2">
                            Este nombre es el que mirarán tus colaboradores.
                        </p>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ej. Azul"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Crea una contraseña
                        </label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Confirma tu contraseña
                        </label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white px-5 py-3 rounded-lg font-medium transition-colors shadow-lg"
                    >
                        {isSubmitting ? 'Preparando credenciales...' : 'Aceptar Invitación y Entrar'}
                    </button>
                </form>

            </div>
        </div>
    );
};