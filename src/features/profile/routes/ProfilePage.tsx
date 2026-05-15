// src/features/profile/routes/ProfilePage.tsx
import { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { 
  User, Mail, Layout, Crown, Wrench, Eye, 
  CheckCircle2, ArrowRight, Info, ChevronDown, ChevronUp 
} from 'lucide-react';

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);
  const setActiveWorkspaceId = useAuthStore((state) => state.setActiveWorkspaceId);
  
  const [isHelpExpanded, setIsHelpExpanded] = useState(false);

  if (!user || !user.workspaces) return null;

  const activeWorkspace = user.workspaces.find(ws => ws.workspace_id === activeWorkspaceId);
  const hasMultipleWorkspaces = user.workspaces.length > 1;

  const handleSwitchWorkspace = (workspaceId: string) => {
    if (workspaceId === activeWorkspaceId) return;
    setActiveWorkspaceId(workspaceId);
    // Recargamos hacia la raíz para que el Bootstrapper evalúe el nuevo rol
    // y nos envíe al Dashboard o al V-Hub según corresponda.
    window.location.href = '/';
  };

  const getRoleVisuals = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return { icon: Crown, color: 'text-amber-500', label: 'Propietario' };
      case 'engineer': return { icon: Wrench, color: 'text-emerald-500', label: 'Ingeniero' };
      default: return { icon: Eye, color: 'text-blue-500', label: 'Validador' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Cabecera */}
        <div>
          <h1 className="text-3xl font-black text-slate-200 tracking-tight">Mi Perfil</h1>
          <p className="text-slate-400 mt-1">Gestiona tu identidad y tus accesos operativos.</p>
        </div>

        {/* 1. SECCIÓN DE IDENTIDAD */}
        <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Datos de Identidad</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <User size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Nombre</span>
              </div>
              <p className="text-lg font-medium text-slate-200 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                {user.full_name}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Mail size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Correo</span>
              </div>
              <p className="text-lg font-medium text-slate-200 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                {user.email}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Layout size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Entorno Activo</span>
              </div>
              <p className="text-lg font-medium text-emerald-500 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 truncate" title={activeWorkspace?.workspace_name}>
                {activeWorkspace?.workspace_name || `ID: ${activeWorkspace?.workspace_id.split('-')[0]}`}
              </p>
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN DE ENTORNOS DE TRABAJO */}
        <section className="space-y-6">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Mis Entornos de Trabajo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.workspaces.map((ws) => {
              const isActive = ws.workspace_id === activeWorkspaceId;
              const { icon: RoleIcon, color: roleColor, label: roleLabel } = getRoleVisuals(ws.role);

              return (
                <div 
                  key={ws.workspace_id} 
                  className={`relative p-5 rounded-xl border transition-all ${
                    isActive 
                      ? 'bg-slate-800 border-emerald-500' 
                      : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {/* Etiqueta de Activo */}
                  {isActive && (
                    <div className="absolute -top-3 -right-3 bg-[#020617] p-1 rounded-full">
                      <CheckCircle2 className="text-emerald-500 bg-emerald-500/10 rounded-full" size={24} />
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <RoleIcon size={16} className={roleColor} />
                        <span className={`text-xs font-bold ${roleColor} uppercase tracking-wider`}>
                          {roleLabel}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-200 mb-1">
                        {ws.workspace_name || `Entorno ${ws.workspace_id.split('-')[0]}`}
                      </h3>
                      <p className="text-xs font-mono text-slate-500">
                        ID: {ws.workspace_id.split('-')[0]}
                      </p>
                    </div>

                    {!isActive && (
                      <button
                        onClick={() => handleSwitchWorkspace(ws.workspace_id)}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors group"
                      >
                        Cambiar
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. UX DETAIL: CÁPSULA DE APRENDIZAJE (Solo si hay 1 workspace) */}
          {!hasMultipleWorkspaces && (
            <div className="mt-8 bg-blue-500/5 border border-blue-500/20 rounded-xl overflow-hidden transition-all">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-slate-300">
                    Recuerda que puedes colaborar en otros entornos; los nuevos entornos de trabajo aparecerán aquí.
                  </p>
                </div>
                <button 
                  onClick={() => setIsHelpExpanded(!isHelpExpanded)}
                  className="shrink-0 flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ¿Cómo colaborar en otros entornos?
                  {isHelpExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Contenedor Expandible */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isHelpExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-5 pt-0 text-sm text-slate-400 border-t border-blue-500/10 mt-2">
                    <p>
                      Para unirte a un nuevo proyecto en Delonix, el <strong>Propietario (Owner)</strong> de ese entorno debe enviarte una invitación directa a tu correo electrónico. 
                    </p>
                    <p className="mt-2">
                      Una vez que recibas el enlace y aceptes la invitación, el nuevo entorno aparecerá automáticamente en esta lista y podrás cambiar entre ellos en cualquier momento, asumiendo el rol que se te haya asignado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};