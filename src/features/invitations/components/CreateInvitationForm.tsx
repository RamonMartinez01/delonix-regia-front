// src/features/invitations/components/CreateInvitationForm.tsx
import { useState } from 'react';
import { useProjects } from '../../projects/api/getProjects';
import { createInvitation } from '../api/invitations';

// Le pasamos una función onSuccess por si el Modal padre quiere cerrarse automáticamente
interface CreateInvitationFormProps {
  onSuccess?: () => void;
}

export const CreateInvitationForm = ({ onSuccess }: CreateInvitationFormProps) => {
  // 1. Traemos los proyectos usando tu excelente hook (caché separada por Workspace)
  const { data: projects, isLoading: isLoadingProjects } = useProjects();

  // 2. Estado local del formulario
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  
  // 3. Estados de la transacción
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successLink, setSuccessLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessLink(null);

    try {
      // Llamamos a nuestro mensajero
      const response = await createInvitation({
        email,
        project_id: projectId || null, // Si está vacío, mandamos null
        role: 'MEMBER' // Fijo por ahora para Azul
      });

      // ¡Éxito! Mostramos el salvavidas
      setSuccessLink(response.fallback_link);
      
      // Opcional: limpiar el formulario
      setEmail('');
      setProjectId('');
      
    } catch (err: any) {
      // Capturamos el error que escupa FastAPI o Axios
      setError(err.response?.data?.detail || 'Ocurrió un error al forjar la invitación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si ya tenemos éxito, mostramos la pantalla de victoria (El Salvavidas)
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

  // El Formulario principal
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          placeholder="collegue@empresa.com"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

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
          <option value="">-- Sin proyecto específico (Solo Workspace) --</option>
          {projects?.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20"
      >
        {isSubmitting ? 'Forjando...' : 'Enviar Invitación'}
      </button>
    </form>
  );
};