// src/features/team/api/InvitationList.tsx  
import { Clock, Send } from 'lucide-react';
import type { PendingInvite } from '../types';

interface InvitationListProps {
  invitations: PendingInvite[];
}

export const InvitationList = ({ invitations }: InvitationListProps) => {
  const hasInvitations = invitations.length > 0;

  return (
    <section className="bg-[#121b2d] border border-slate-800/60 rounded-2xl overflow-hidden border-dashed">
      <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-800">
        <h2 className="font-semibold text-slate-400 flex items-center gap-2 italic">
          <Clock size={18} />
          Invitaciones Pendientes
        </h2>
      </div>

      {hasInvitations ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {invitations.map((invite) => (
            <div key={invite.id} className="p-4 bg-slate-800/40 border border-slate-700 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] bg-amber-500/20 text-amber-500 px-2 py-1 rounded-full font-bold uppercase">Pending</span>
              </div>
              <span className="text-sm font-medium text-slate-200">{invite.email}</span>
              <div className="text-[11px] text-slate-500">
                Rol: <span className="text-slate-300 capitalize">{invite.role}</span>
              </div>
              {invite.project_name && (
                <div className="text-[11px] text-slate-500">
                  Proyecto: <span className="text-slate-300">{invite.project_name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">
            <Send size={20} />
          </div>
          <div>
            <p className="text-slate-400 font-medium">No tienes invitaciones pendientes</p>
            <p className="text-xs text-slate-500 mt-1">
              Todos tus colaboradores invitados ya se han unido a la tripulación.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};