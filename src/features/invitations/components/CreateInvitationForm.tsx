// src/features/invitations/components/CreateInvitationForm.tsx
import { useState } from 'react';
import { useProjects } from '../../projects/api/getProjects';
import { useTeamMatrix } from '../../team/hooks/useTeamMatrix';
import { useCreateInvitation } from '../hooks/useCreateInvitation';
import { Clipboard, Check, AlertCircle } from 'lucide-react';

interface CreateInvitationFormProps {
  onSuccess?: () => void;
  fixedProjectId?: string;
}

export const CreateInvitationForm = ({ onSuccess, fixedProjectId }: CreateInvitationFormProps) => {
  // 1. Sensores de Datos y Mutación
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  const { data: team } = useTeamMatrix();
  const { mutate: sendInvite, isPending, error: mutationError } = useCreateInvitation();

  // 2. Estado del Formulario
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState<string>(fixedProjectId || '');
  const [role, setRole] = useState<string>(''); 
  const [localError, setLocalError] = useState<string | null>(null);
  const [successLink, setSuccessLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // --- ESCUDO DE DUPLICADOS (Validación Local) ---
    const isAlreadyMember = team?.members.some(m => m.email.toLowerCase() === email.toLowerCase());
    const isAlreadyInvited = team?.pending_invitations.some(i => i.email.toLowerCase() === email.toLowerCase());

    if (isAlreadyMember) {
      setLocalError("Esta persona ya es parte de la tripulación.");
      return;
    }
    if (isAlreadyInvited) {
      setLocalError("Ya existe una invitación pendiente para este correo.");
      return;
    }

    // --- EJECUCIÓN DE LA FORJA ---
    sendInvite({
      email,
      project_id: projectId || null,
      role,
    }, {
      onSuccess: (data) => {
        setSuccessLink(data.fallback_link);
        setEmail('');
        // No reseteamos fixedProjectId si viene por props
      }
    });
  };

  if (successLink) {
    return (
      <div className="space-y-4 animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-emerald-500" size={24} />
          </div>
          <h3 className="text-emerald-400 font-bold text-lg">¡Invitación Forjada!</h3>
          <p className="text-slate-400 text-sm mt-2">
            El Magic Link ha sido generado. Puedes copiarlo para enviarlo por canales directos.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
          <input 
            type="text" 
            readOnly 
            value={successLink} 
            className="bg-transparent w-full text-xs text-slate-500 outline-none select-all font-mono"
          />
          <button 
            type="button"
            onClick={() => navigator.clipboard.writeText(successLink)}
            className="bg-slate-800 hover:bg-slate-700 p-2 rounded text-emerald-500 transition-colors"
          >
            <Clipboard size={16} />
          </button>
        </div>
        
        <button 
          onClick={onSuccess}
          className="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Cerrar ventana
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(localError || mutationError) && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in shake duration-300">
          <AlertCircle size={18} />
          <p>{localError || (mutationError as any).response?.data?.detail || 'Error en la misión.'}</p>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          Correo del Colaborador
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@ejemplo.com"
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
        />
      </div>

      {/* Selector de Rol (Segmented Control que ya tenías) */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
          Nivel de Acceso (RBAC)
        </label>
        <div className="flex gap-2">
          {['member', 'engineer'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                role === r
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        {role && (
          <p className="text-[11px] text-slate-500 italic bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
            {role === 'member' 
              ? 'MEMBER: Solo lectura y feedback en el área de UAT.' 
              : 'ENGINEER: Permisos de despliegue y experimentación en proyectos.'}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          Asignación de Proyecto
        </label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={!!fixedProjectId || isLoadingProjects}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
        >
          <option value="">-- Sin proyecto (Acceso global) --</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {fixedProjectId && (
          <p className="text-[10px] text-emerald-500/70 mt-2 ml-1">
            * Bloqueado al contexto del proyecto actual.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || !role}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
      >
        {isPending ? 'FORJANDO ENLACE...' : 'EMITIR INVITACIÓN'}
      </button>
    </form>
  );
};