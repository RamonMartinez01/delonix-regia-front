// src/features/auth/routes/GatewayPage.tsx
import { useAuthStore } from '../../../stores/authStore';
import { Crown, Wrench, Eye, ArrowRight, LayoutDashboard } from 'lucide-react';

export const GatewayPage = () => {
  // 1. Extraemos al usuario y la función de anclaje de la tienda
  const user = useAuthStore((state) => state.user);
  const setActiveWorkspaceId = useAuthStore((state) => state.setActiveWorkspaceId);

  // 2. La Maniobra de Salto
  const handleSelectWorkspace = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
    // ⚡ Al hacer window.location, forzamos al AuthBootstrapper a correr de nuevo.
    // Como ahora YA HAY un workspace guardado, nos dirigirá automáticamente al sector correcto.
    window.location.href = '/';
  };

  // Fallback de seguridad visual
  if (!user || !user.workspaces) return null; 

  // 3. Telemetría Visual: Asignamos colores e íconos según el rango
  const getRoleVisuals = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return { icon: Crown, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Propietario' };
      case 'engineer':
        return { icon: Wrench, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Ingeniero' };
      default:
        return { icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Validador' };
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-8 animate-in fade-in duration-500">
        
        {/* Cabecera del Gateway */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
            <LayoutDashboard className="text-emerald-400" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Selecciona tu Destino</h1>
          <p className="text-slate-400">Tienes acceso a múltiples entornos. Elige a dónde deseas navegar.</p>
        </div>

        {/* Rejilla de Workspaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {user.workspaces.map((ws) => {
            const { icon: RoleIcon, color: roleColor, bg: roleBg, label: roleLabel } = getRoleVisuals(ws.role);

            return (
              // Convertimos la tarjeta en un botón interactivo
              <button
                key={ws.workspace_id}
                onClick={() => handleSelectWorkspace(ws.workspace_id)}
                className="group text-left block h-full w-full focus:outline-none rounded-xl"
              >
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 group-hover:border-emerald-500 transition-all shadow-lg flex flex-col h-full cursor-pointer relative overflow-hidden">
                  
                  {/* Brillo sutil de fondo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex-grow relative z-10">
                    <div className={`w-10 h-10 ${roleBg} rounded-lg flex items-center justify-center mb-4 transition-colors`}>
                      <RoleIcon className={roleColor} size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-1 truncate group-hover:text-emerald-400 transition-colors">
                      {/* Aquí asumo que tu backend envía un workspace_name. Si no, mostramos un fallback */}
                      {ws.workspace_name || `Entorno ${ws.workspace_id.split('-')[0]}`}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Rango: <span className={`font-semibold ${roleColor}`}>{roleLabel}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-700 mt-auto flex justify-between items-center text-xs text-slate-500 relative z-10">
                    <span className="font-mono bg-slate-900 px-2 py-1 rounded">
                      ID: {ws.workspace_id.split('-')[0]}
                    </span>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
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