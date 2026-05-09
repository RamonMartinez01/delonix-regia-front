// src/features/team/api/TeamTable.tsx  
import { Mail, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { TeamMember } from '../types';

interface TeamTableProps {
  members: TeamMember[];
}

export const TeamTable = ({ members }: TeamTableProps) => {
  return (
    <section className="bg-slate-800 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/30">
        <h2 className="font-semibold text-slate-200 flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-500" />
          Colaboradores Activos
        </h2>
      </div>

      <div className="overflow-x-auto bg-[#121b2d]"> {/**bg-[#0a0f1e] */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Usuario</th>
              <th className="px-6 py-4 font-semibold">Rol</th>
              <th className="px-6 py-4 font-semibold">Proyectos Asignados</th>
              <th className="px-6 py-4 font-semibold text-right">Unido el</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-800/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {member.full_name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`
                    px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${member.role === 'owner' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}
                  `}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {member.assigned_projects.length > 0 ? (
                      member.assigned_projects.map(p => (
                        <span key={p.id} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {p.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-600 italic">Sin proyectos</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-400">
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