import { useTeamMatrix } from '../hooks/useTeamMatrix';
import { Users } from 'lucide-react';
import { TeamTable } from '../components/TeamTable';
import { InvitationList } from '../components/InvitationList';

export const TeamPage = () => {
  const { data, isLoading, isError } = useTeamMatrix();

  if (isLoading || !data ) {
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
        
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20">
          Invitar Colaborador
        </button>
      </header>

      <TeamTable members={data?.members ?? []} />
      
      <InvitationList invitations={data?.pending_invitations ?? []} />
    </div>
  );
};