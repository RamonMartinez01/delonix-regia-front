// src/features/team/routes/TeamPage.tsx
import { useState } from 'react';
import { useTeamMatrix } from '../hooks/useTeamMatrix';
import { Users, Plus, Loader2, AlertCircle } from 'lucide-react';
import { TeamTable } from '../components/TeamTable';
import { InvitationList } from '../components/InvitationList';
import { Modal } from '../../../components/ui/Modal';
import { CreateInvitationForm } from '../../invitations/components/CreateInvitationForm';

export const TeamPage = () => {
  const { data, isLoading, isError } = useTeamMatrix();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // ESTADO DE CARGA: Minimalismo Técnico
  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#A1A19A]">
        <Loader2 className="animate-spin mb-4 text-brand-primary" size={32} />
        <p className="text-[10px] tracking-widest font-bold uppercase text-[#5A5855] animate-pulse">
          Sincronizando matriz de equipo...
        </p>
      </div>
    );
  }

  // ESTADO DE ERROR: Alerta cálida, no destructiva
  if (isError) {
    return (
      <div className="p-6 md:p-10">
        <div className="p-5 bg-brand-surface border border-brand-accent rounded-xl text-[#D46077] flex items-start gap-3 shadow-sm">
          <AlertCircle size={20} strokeWidth={2.5} className="shrink-0 mt-0.5" />
          <p className="font-medium text-sm">
            Error al cargar los datos del equipo. Verifica tu conexión o permisos.
          </p>
        </div>
      </div>
    );
  }

  return (
    /* Delegamos el fondo oscuro al AppLayout. Establecemos los márgenes editoriales. */
    <div className="p-6 md:p-10 text-[#111111]">
      <div className="space-y-10 animate-in fade-in duration-500">
        
        {/* CABECERA EDITORIAL */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#EAEAE8] pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-[#111111] tracking-tight flex items-center gap-3">
              {/* Ícono anclado en un bloque físico */}
              <div className="p-2 bg-white border border-[#D1D1CD] rounded-xl shadow-sm">
                <Users className="text-[#111111]" size={24} strokeWidth={2.5} />
              </div>
              Gestión de Equipo
            </h1>
            <p className="text-[#5A5855] font-medium mt-3 md:mt-2 text-sm md:text-base">
              Administra los colaboradores y las invitaciones de este workspace.
            </p>
          </div>

          {/* BOTÓN DE ACCIÓN: Táctil, alineado con el botón de "Nuevo Proyecto" */}
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="w-full md:w-auto group flex items-center justify-center gap-2 bg-brand-primary hover:bg-[#D46077] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-px active:scale-95"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90" />
            Invitar Colaborador
          </button>
        </header>

        {/* CONTENEDORES DE DATOS */}
        <div className="space-y-12">
          <TeamTable members={data?.members ?? []} />
          <InvitationList invitations={data?.pending_invitations ?? []} />
        </div>
      </div>

      {/* MODAL DE INVITACIÓN (Ahora hereda la estética premium automáticamente) */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Forjar Nueva Invitación"
      >
        <CreateInvitationForm onSuccess={() => setIsInviteModalOpen(false)} />
      </Modal>
    </div>
  );
};