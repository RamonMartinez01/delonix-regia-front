// src/features/auth/routes/GatewayPage.tsx
import { useAuthStore } from '../../../stores/authStore';
import { Crown, Wrench, Eye, ArrowRight, LayoutDashboard } from 'lucide-react';

export const GatewayPage = () => {
  const user = useAuthStore((state) => state.user);
  const setActiveWorkspaceId = useAuthStore((state) => state.setActiveWorkspaceId);

  const handleSelectWorkspace = (workspaceId: string, role: string) => {
    setActiveWorkspaceId(workspaceId);
    const targetSector = role.toLowerCase() === 'member' ? '/v-hub' : '/dashboard';
    window.location.href = targetSector;
  };

  if (!user || !user.workspaces) return null;

  // 3. Telemetría Visual: Colores Editoriales Semánticos
  const getRoleVisuals = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        // Usa el salmón de la marca
        return { icon: Crown, iconColor: 'text-role-owner', bg: 'bg-brand-surface', label: 'Propietario', hoverBorder: 'hover:border-role-owner' };
      case 'engineer':
        // Usa el azul pizarra
        return { icon: Wrench, iconColor: 'text-role-engineer', bg: 'bg-[#4B5E72]/10', label: 'Ingeniero', hoverBorder: 'hover:border-role-engineer' };
      default:
        // Usa el verde salvia
        return { icon: Eye, iconColor: 'text-role-validator', bg: 'bg-[#6B7A64]/10', label: 'Validador', hoverBorder: 'hover:border-role-validator' };
    }
  };

  return (
    /* Lienzo unificado gracias al App.tsx, pero reforzamos la estructura central */
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-canvas">
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">
        
        {/* Cabecera del Gateway */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-white border border-[#D1D1CD] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <LayoutDashboard className="text-[#111111]" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-[#111111] tracking-tight">
            Selecciona tu Destino
          </h1>
          <p className="text-[#5A5855] text-sm font-medium max-w-md mx-auto">
            Tienes acceso a múltiples entornos. Elige el área operativa a la que deseas navegar.
          </p>
        </div>

        {/* Rejilla de Workspaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {user.workspaces.map((ws) => {
            const { icon: RoleIcon, iconColor, bg: roleBg, label: roleLabel, hoverBorder } = getRoleVisuals(ws.role);

            return (
              /* Tarjeta Física Táctil: Sin gradientes. Hover con traslación sutil y borde de marca. */
              <button
                key={ws.workspace_id}
                onClick={() => handleSelectWorkspace(ws.workspace_id, ws.role)}
                className="group text-left block h-full w-full focus:outline-none rounded-2xl transition-all"
              >
                <div className="bg-white border border-[#EAEAE8] rounded-2xl p-6 hover:border-brand transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 flex flex-col h-full cursor-pointer relative">
                  
                  <div className="grow relative z-10">
                    {/* Contenedor del ícono de rol */}
                    <div className={`w-12 h-12 ${roleBg} ${hoverBorder || 'border border-transparent'} rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                      <RoleIcon className={iconColor} size={22} />
                    </div>
                    
                    <h3 className="text-xl font-bold font-display text-[#111111] mb-1 truncate group-hover:text-brand-primary transition-colors">
                      {ws.workspace_name || `Entorno ${ws.workspace_id.split('-')[0]}`}
                    </h3>
                    
                    <p className="text-[#5A5855] text-xs font-bold uppercase tracking-widest mt-3">
                      Rango: <span className="text-[#111111]">{roleLabel}</span>
                    </p>
                  </div>

                  {/* Pie de la tarjeta: Metadatos estructurados */}
                  <div className="pt-5 border-t border-[#EAEAE8] mt-6 flex justify-between items-center relative z-10">
                    <span className="font-sans text-[10px] font-bold text-[#A1A19A] tracking-widest uppercase bg-[#F7F7F5] px-2.5 py-1 rounded-md border border-[#EAEAE8]">
                      ID: {ws.workspace_id.split('-')[0]}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#F7F7F5] border border-[#EAEAE8] flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-colors">
                      <ArrowRight size={14} className="text-[#A1A19A] group-hover:text-white transition-colors" />
                    </div>
                  </div>

                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};