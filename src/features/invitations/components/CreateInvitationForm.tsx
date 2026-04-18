// src/features/invitations/components/CreateInvitationForm.tsx
import { useState } from 'react';
import { useProjects } from '../../projects/api/getProjects';
import { createInvitation } from '../api/invitations';

interface CreateInvitationFormProps {
  onSuccess?: () => void;
}

export const CreateInvitationForm = ({ onSuccess }: CreateInvitationFormProps) => {
  const { data: projects, isLoading: isLoadingProjects } = useProjects();

  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  
  // Estado inicial vacío para forzar la intencionalidad del usuario
  const [role, setRole] = useState<string>(''); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successLink, setSuccessLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return; // Doble validación de seguridad

    setIsSubmitting(true);
    setError(null);
    setSuccessLink(null);

    try {
      const response = await createInvitation({
        email,
        project_id: projectId || null,
        role,
      });

      setSuccessLink(response.fallback_link);
      
      setEmail('');
      setProjectId('');
      setRole(''); 
      
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ocurrió un error al forjar la invitación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successLink) {
    return (
      <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-center">
        <h3 className="text-emerald-400 font-bold mb-2">¡Invitación Forjada!</h3>
        <p className="text-slate-300 text-sm mb-4">
          El correo está en camino. Si Prefieres enviar esta invitación por un canal directo (WhatsApp/LinkedIn), usa este enlace:
        </p>
        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded border border-slate-700">
          <input 
            type="text" 
            readOnly 
            value={successLink} 
            className="bg-transparent w-full text-xs text-slate-400 outline-none select-all"
          />
          <button 
            onClick={() => navigator.clipboard.writeText(successLink)}
            className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-xs text-white transition-colors"
          >
            Copiar
          </button>
        </div>
        <button 
          onClick={onSuccess}
          className="mt-6 text-sm text-emerald-500 hover:text-emerald-400 underline"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Correo de tu invitado
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="collega@empresa.com"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* --- SEGMENTED CONTROL PARA RBAC --- */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Selecciona el nivel de acceso (rol)
        </label>
        
        {/* Los Botones Toggle */}
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => setRole('member')}
            className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              role === 'member'
                ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            MEMBER
          </button>
          <button
            type="button"
            onClick={() => setRole('engineer')}
            className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              role === 'engineer'
                ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            ENGINEER
          </button>
        </div>

        {/* Las Cajas de Texto de Contexto (Solo se renderiza la activa) */}
        {role === 'member' && (
          <div className="bg-slate-900/80 border border-slate-700/50 p-3 rounded-lg text-sm text-slate-400 animate-in fade-in zoom-in duration-200">
            <strong className="text-slate-300">Stakeholder / Cliente:</strong> Tiene permisos estrictamente de lectura e interacción. Solo puede ver la interfaz de pruebas (UAT), ejecutar inferencias y enviar feedback. Sin acceso al código ni a la facturación.
          </div>
        )}
        {role === 'engineer' && (
          <div className="bg-slate-900/80 border border-slate-700/50 p-3 rounded-lg text-sm text-slate-400 animate-in fade-in zoom-in duration-200">
            <strong className="text-slate-300">Técnico / Científico de Datos:</strong> Tiene permisos de lectura y escritura dentro del proyecto asignado. Puede experimentos y desplegar modelos. Sin acceso a facturación ni gestión de usuarios.
          </div>
        )}
      </div>
      {/* --- FIN SEGMENTED CONTROL --- */}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Asignar a un Proyecto (obligatorio por ahora)
        </label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={isLoadingProjects}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
        >
          <option value="">-- Es necesario asignar un proyecto --</option>
          {projects?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        // El botón se bloquea si está enviando o si falta elegir el rol o el proyecto
        disabled={isSubmitting || !role || !projectId} 
        className="mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20"
      >
        {isSubmitting ? 'Forjando...' : 'Enviar Invitación'}
      </button>
    </form>
  );
};