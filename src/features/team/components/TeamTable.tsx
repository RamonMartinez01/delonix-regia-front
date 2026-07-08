// src/features/team/components/TeamTable.tsx  
import { Mail, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { TeamMember } from '../types';

interface TeamTableProps {
  members: TeamMember[];
}

export const TeamTable = ({ members }: TeamTableProps) => {
  // Función para inyectar nuestra paleta editorial de roles
  const getRoleStyles = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': 
        return 'bg-brand-surface text-brand-primary border border-[#F3BAC9]';
      case 'engineer': 
        return 'bg-[#4B5E72]/10 text-[#4B5E72] border border-[#4B5E72]/20';
      default: 
        return 'bg-[#6B7A64]/10 text-[#6B7A64] border border-[#6B7A64]/20';
    }
  };

  return (
    /* Contenedor: Estructura de papel sólido con sombra sutil, sin bordes oscuros */
    <section className="bg-white border border-[#EAEAE8] rounded-2xl overflow-hidden shadow-sm">
      
      {/* Cabecera de la tabla: Tono neutro para separar la etiqueta del contenido */}
      <div className="px-6 py-5 border-b border-[#EAEAE8] bg-[#F7F7F5]">
        <h2 className="font-bold font-display text-[#111111] flex items-center gap-2.5">
          <div className="p-1.5 bg-white rounded-lg border border-[#D1D1CD] shadow-sm">
            <ShieldCheck size={18} className="text-[#111111]" strokeWidth={2.5} />
          </div>
          Colaboradores Activos
        </h2>
      </div>

      <div className="overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Cabeceras de columnas: Riguroso estándar de metadatos */}
            <tr className="text-[#A1A19A] text-[10px] uppercase tracking-widest border-b border-[#EAEAE8]">
              <th className="px-6 py-4 font-bold">Usuario</th>
              <th className="px-6 py-4 font-bold">Rol</th>
              <th className="px-6 py-4 font-bold">Proyectos Asignados</th>
              <th className="px-6 py-4 font-bold text-right">Unido el</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAEAE8]">
            {members.map((member) => (
              /* Fila interactiva: Hover neutro sin neón */
              <tr key={member.id} className="hover:bg-[#F7F7F5] transition-colors group">
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar Físico: Fondo gris tenue y texto oscuro */}
                    <div className="w-10 h-10 rounded-full bg-[#F7F7F5] flex items-center justify-center text-[#111111] font-bold font-display border border-[#D1D1CD] shadow-sm group-hover:border-[#A1A19A] transition-colors">
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold font-display text-[#111111] group-hover:text-brand-primary transition-colors">
                        {member.full_name}
                      </div>
                      <div className="text-xs font-medium text-[#5A5855] flex items-center gap-1.5 mt-0.5">
                        <Mail size={12} strokeWidth={2.5} className="text-[#A1A19A]" /> {member.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {/* Insignia de Rol: Aplicando la paleta semántica mate */}
                  <span className={`
                    px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest
                    ${getRoleStyles(member.role)}
                  `}>
                    {member.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {member.assigned_projects.length > 0 ? (
                      member.assigned_projects.map(p => (
                        /* Etiquetas de proyecto: Estilo "Draft" impreso */
                        <span key={p.id} className="text-[10px] font-bold uppercase tracking-widest bg-white text-[#5A5855] px-2 py-1 rounded-md border border-[#D1D1CD] shadow-sm">
                          {p.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#A1A19A]">Sin proyectos</span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-[#5A5855]">
                  {member.joined_at ? format(new Date(member.joined_at), 'dd MMM yyyy', { locale: es }) : '---'}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};