// src/features/team/routes/TeamPage.tsx
import { useState } from 'react';
import { useTeamMatrix } from '../hooks/useTeamMatrix';
import { Users, Plus } from 'lucide-react';
import { TeamTable } from '../components/TeamTable';
import { InvitationList } from '../components/InvitationList';
import { Modal } from '../../../components/ui/Modal';
import { CreateInvitationForm } from '../../invitations/components/CreateInvitationForm';


export const TeamPage = () => {
  const { data, isLoading, isError } = useTeamMatrix();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500 mb-4" />
        <p className="text-sm tracking-widest animate-pulse">Sincronizando matriz de equipo...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
        Error al cargar los datos del equipo. Verifica tu conexión o permisos.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Users className="text-emerald-500" size={32} />
              Gestión de Equipo
            </h1>
            <p className="text-slate-400 mt-1">
              Administra los colaboradores y las invitaciones de este workspace.
            </p>
          </div>

          {/**
           * 
           * bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-95 */}
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 
              bg-slate-700 hover:bg-slate-900 
              border border-emerald-500/30 hover:border-emerald-500/60 
              text-emerald-400 font-bold text-sm 
              rounded-xl transition-all duration-200 
              active:scale-95"
          >
            <Plus size={20} />
            Invitar Colaborador
          </button>
        </header>

        <TeamTable members={data?.members ?? []} />

        <InvitationList invitations={data?.pending_invitations ?? []} />
      </div>

      {/* MODAL DE INVITACIÓN */}
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