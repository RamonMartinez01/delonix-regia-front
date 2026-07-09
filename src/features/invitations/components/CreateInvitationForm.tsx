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
  const { data: projects, isLoading: isLoadingProjects } = useProjects();
  const { data: team } = useTeamMatrix();
  const { mutate: sendInvite, isPending, error: mutationError } = useCreateInvitation();

  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState<string>(fixedProjectId || '');
  const [role, setRole] = useState<string>(''); 
  const [localError, setLocalError] = useState<string | null>(null);
  const [successLink, setSuccessLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

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

    sendInvite({
      email,
      project_id: projectId || null,
      role,
    }, {
      onSuccess: (data) => {
        setSuccessLink(data.fallback_link);
        setEmail('');
      }
    });
  };

  // Función para inyectar nuestra paleta editorial de roles
  const getRoleStyles = (r: string, isSelected: boolean) => {
    if (!isSelected) return 'bg-white border-[#EAEAE8] text-[#A1A19A] hover:border-[#D1D1CD] hover:text-[#5A5855]';
    
    switch (r.toLowerCase()) {
      case 'engineer': 
        return 'bg-[#4B5E72]/10 border-[#4B5E72] text-[#4B5E72] shadow-sm';
      default: // member
        return 'bg-[#6B7A64]/10 border-[#6B7A64] text-[#6B7A64] shadow-sm';
    }
  };

  // --- ESTADO DE ÉXITO (El Magic Link) ---
  if (successLink) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in duration-300">
        
        {/* Panel de Éxito: Cálido y Estructurado */}
        <div className="p-6 bg-white border border-[#EAEAE8] rounded-2xl text-center shadow-sm">
          <div className="w-12 h-12 bg-[#F7F7F5] border border-[#D1D1CD] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Check className="text-brand-primary" size={24} strokeWidth={2.5} />
          </div>
          <h3 className="text-[#111111] font-bold font-display text-lg">¡Invitación Forjada!</h3>
          <p className="text-[#5A5855] text-sm mt-2 font-medium">
            El enlace criptográfico ha sido generado. Cópialo y envíalo por un canal seguro.
          </p>
        </div>
        
        {/* Input de Copiado: Hendidura Física */}
        <div className="flex items-center gap-2 bg-[#F7F7F5] p-2 rounded-xl border border-[#D1D1CD] shadow-inner">
          <input 
            type="text" 
            readOnly 
            value={successLink} 
            className="bg-transparent w-full text-xs text-[#5A5855] outline-none select-all font-mono px-2"
          />
          <button 
            type="button"
            onClick={() => navigator.clipboard.writeText(successLink)}
            className="bg-white border border-[#D1D1CD] hover:bg-brand-surface hover:border-brand-primary hover:text-brand-primary p-2.5 rounded-lg text-[#5A5855] transition-all shadow-sm active:scale-95"
            title="Copiar al portapapeles"
          >
            <Clipboard size={16} strokeWidth={2.5} />
          </button>
        </div>
        
        <button 
          onClick={onSuccess}
          className="w-full py-3 text-sm font-bold text-[#A1A19A] hover:text-[#111111] transition-colors"
        >
          Cerrar ventana
        </button>
      </div>
    );
  }

  // --- FORMULARIO PRINCIPAL ---
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Alerta de Error: Neutra y clara, sin neón rojo */}
      {(localError || mutationError) && (
        <div className="p-4 bg-brand-surface border border-brand-accent rounded-xl flex items-center gap-3 text-[#D46077] text-sm font-medium shadow-sm animate-in shake duration-300">
          <AlertCircle size={18} strokeWidth={2.5} />
          <p>{localError || (mutationError as any).response?.data?.detail || 'Error en la misión.'}</p>
        </div>
      )}

      {/* Input: Hendidura física en el modal blanco */}
      <div>
        <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1">
          Correo del Colaborador
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ada.lovelace@ejemplo.com"
          className="w-full bg-[#F7F7F5] border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:bg-white focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-inner focus:shadow-sm"
        />
      </div>

      {/* Selector de Rol (Segmented Control) */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest ml-1">
          Nivel de Acceso (RBAC)
        </label>
        <div className="flex gap-3">
          {['member', 'engineer'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-3.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${getRoleStyles(r, role === r)}`}
            >
              {r}
            </button>
          ))}
        </div>
        
        {/* Descripción dinámica del rol */}
        <div className={`transition-all duration-300 overflow-hidden ${role ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <p className="text-xs text-[#5A5855] font-medium bg-[#F7F7F5] p-3.5 rounded-xl border border-[#EAEAE8]">
            {role === 'member' 
              ? 'MEMBER: Permisos de solo lectura y validación (feedback) en el área de UAT.' 
              : 'ENGINEER: Permisos destructivos, despliegue y experimentación técnica.'}
          </p>
        </div>
      </div>

      {/* Selector de Proyecto */}
      <div>
        <label className="block text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-2 ml-1">
          Asignación de Proyecto
        </label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          disabled={!!fixedProjectId || isLoadingProjects}
          className="w-full bg-white border border-[#D1D1CD] rounded-xl px-4 py-3 text-[#111111] font-medium focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm disabled:bg-[#F7F7F5] disabled:text-[#A1A19A] appearance-none cursor-pointer disabled:cursor-not-allowed"
        >
          <option value="" className="text-[#5A5855]">-- Acceso Global (Sin proyecto específico) --</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {fixedProjectId && (
          <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mt-2 ml-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
            Bloqueado al contexto actual
          </p>
        )}
      </div>

      {/* Botón de Acción Principal */}
      <button
        type="submit"
        disabled={isPending || !role}
        className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-[#D46077] disabled:bg-[#F7F7F5] disabled:text-[#A1A19A] disabled:border disabled:border-[#D1D1CD] text-white font-bold py-4 rounded-xl transition-all shadow-sm active:scale-95"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            FORJANDO...
          </span>
        ) : (
          'EMITIR INVITACIÓN'
        )}
      </button>
    </form>
  );
};