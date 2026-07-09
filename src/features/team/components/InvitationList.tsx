// src/features/team/components/InvitationList.tsx  
import { Clock, Send } from 'lucide-react';
import type { PendingInvite } from '../types';

interface InvitationListProps {
  invitations: PendingInvite[];
}

export const InvitationList = ({ invitations }: InvitationListProps) => {
  const hasInvitations = invitations.length > 0;

  // Reutilizamos la lógica semántica de colores para mantener consistencia con TeamTable
  /*const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return 'text-brand-primary';
      case 'engineer': return 'text-[#4B5E72]';
      default: return 'text-[#6B7A64]';
    }
  };*/

  // Telemetría de diseño: Mapeo de estilos físicos para las tarjetas en tránsito
  const getRoleCardSpecs = (role: string) => {
    switch (role.toLowerCase()) {
      case 'engineer':
        return {
          textColor: 'text-[#4B5E72]',
          borderAccent: 'border-l-4 border-l-[#4B5E72]',
          bgTint: 'bg-[#4B5E72]/[0.03]' // Tinte sutil de fondo (3%)
        };
      default: // member / validator
        return {
          textColor: 'text-[#6B7A64]',
          borderAccent: 'border-l-4 border-l-[#6B7A64]',
          bgTint: 'bg-[#6B7A64]/[0.03]'
        };
    }
  };

  return (
    /* Contenedor: Usamos dashed pero con un gris estructurado para denotar "estado pendiente" */
    <section className="bg-white border-2 border-dashed border-[#D1D1CD] rounded-2xl overflow-hidden">

      {/* Cabecera: Neutra, eliminamos el italic y aplicamos nuestra tipografía de metadatos */}
      <div className="px-6 py-4 border-b border-dashed border-[#D1D1CD] bg-[#F7F7F5]">
        <h2 className="font-bold text-[#5A5855] flex items-center gap-2.5 text-[10px] uppercase tracking-widest">
          <Clock size={16} strokeWidth={2.5} />
          Invitaciones Pendientes
        </h2>
      </div>

      {hasInvitations ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {invitations.map((invite) => {
            const { textColor, borderAccent, bgTint } = getRoleCardSpecs(invite.role);

            return (
              /* * Tarjeta con Lomo de Dossier: 
                * Combinamos el border-l-4 con el tinte de fondo para crear la ilusión de un archivo indexado.
                */
              <div
                key={invite.id}
                className={`p-5 ${bgTint} ${borderAccent} border-t border-r border-b border-[#EAEAE8] rounded-r-2xl rounded-l-md flex flex-col gap-3 relative overflow-hidden group hover:border-[#D1D1CD] hover:shadow-sm transition-all`}
              >

                <div className="absolute top-4 right-4">
                  <span className="text-[9px] bg-white text-[#A1A19A] border border-[#EAEAE8] px-2 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">
                    En espera
                  </span>
                </div>

                <span className="text-sm font-bold font-display text-[#111111] pr-16 truncate">
                  {invite.email}
                </span>

                <div className="space-y-1.5 mt-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#A1A19A]">
                    Rol: <span className={`${textColor} font-black`}>{invite.role}</span>
                  </div>

                  {invite.project_name && (
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#A1A19A]">
                      Proyecto: <span className="text-[#5A5855] font-semibold">{invite.project_name}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 bg-white">
          <div className="w-14 h-14 rounded-full bg-[#F7F7F5] border border-[#EAEAE8] flex items-center justify-center text-[#A1A19A] shadow-sm">
            <Send size={24} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[#111111] font-bold font-display text-lg">No hay invitaciones en tránsito</p>
            <p className="text-sm text-[#5A5855] font-medium mt-1">
              Todos tus colaboradores asignados ya forman parte de la tripulación.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};