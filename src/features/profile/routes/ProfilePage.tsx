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
    window.location.href = '/';
  };

  // 1. Inyectamos nuestra Paleta Editorial de Roles
  const getRoleVisuals = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner': return { icon: Crown, color: 'text-role-owner', bg: 'bg-brand-surface', label: 'Propietario' };
      case 'engineer': return { icon: Wrench, color: 'text-role-engineer', bg: 'bg-[#4B5E72]/10', label: 'Ingeniero' };
      default: return { icon: Eye, color: 'text-role-validator', bg: 'bg-[#6B7A64]/10', label: 'Validador' };
    }
  };

  return (
    /* Delegamos el fondo oscuro. El AppLayout ya provee el bg-brand-canvas */
    <div className="min-h-screen p-6 md:p-10 text-[#111111]">
      <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
        
        {/* Cabecera Editorial */}
        <div className="border-b border-[#EAEAE8] pb-6">
          <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-[#111111]">Mi Perfil</h1>
          <p className="text-[#5A5855] font-medium mt-2">Gestiona tu identidad y tus accesos operativos.</p>
        </div>

        {/* 1. SECCIÓN DE IDENTIDAD (Dossier Físico) */}
        <section className="bg-white border border-[#EAEAE8] rounded-2xl p-8 shadow-sm">
          <h2 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest mb-8 border-b border-[#EAEAE8] pb-3">
            Datos de Identidad
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Campos estructurados como hendiduras de formulario físico */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#5A5855]">
                <User size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Nombre</span>
              </div>
              <p className="text-base font-bold text-[#111111] bg-[#F7F7F5] p-3.5 rounded-xl border border-[#D1D1CD]">
                {user.full_name}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#5A5855]">
                <Mail size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Correo</span>
              </div>
              <p className="text-base font-medium text-[#111111] bg-[#F7F7F5] p-3.5 rounded-xl border border-[#D1D1CD]">
                {user.email}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#5A5855]">
                <Layout size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Entorno Activo</span>
              </div>
              {/* Resaltamos el entorno activo con nuestro token de marca */}
              <p className="text-base font-bold text-brand-primary bg-brand-surface p-3.5 rounded-xl border border-brand-accent truncate" title={activeWorkspace?.workspace_name}>
                {activeWorkspace?.workspace_name || `ID: ${activeWorkspace?.workspace_id.split('-')[0]}`}
              </p>
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN DE ENTORNOS DE TRABAJO */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest ml-1">
            Mis Entornos de Trabajo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {user.workspaces.map((ws) => {
              const isActive = ws.workspace_id === activeWorkspaceId;
              const { icon: RoleIcon, color: roleColor, bg: roleBg, label: roleLabel } = getRoleVisuals(ws.role);

              return (
                <div 
                  key={ws.workspace_id} 
                  /* Tarjeta táctil: El activo se eleva y se pinta de marca. El inactivo es un botón esperando ser presionado */
                  className={`relative p-6 rounded-2xl border transition-all ${
                    isActive 
                      ? 'bg-white border-brand-primary shadow-md' 
                      : 'bg-white border-[#EAEAE8] hover:border-[#D1D1CD] hover:shadow-sm'
                  }`}
                >
                  {/* Etiqueta de Activo con recorte físico */}
                  {isActive && (
                    <div className="absolute -top-3 -right-3 bg-white p-1 rounded-full shadow-sm">
                      <CheckCircle2 className="text-brand-primary bg-brand-surface rounded-full" size={26} strokeWidth={2.5} />
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div>
                      {/* El rol utiliza los colores editoriales mate */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className={`p-1.5 rounded-lg ${roleBg}`}>
                          <RoleIcon size={14} className={roleColor} strokeWidth={2.5} />
                        </div>
                        <span className={`text-[10px] font-bold ${roleColor} uppercase tracking-widest mt-0.5`}>
                          {roleLabel}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold font-display text-[#111111] mb-2 truncate max-w-50">
                        {ws.workspace_name || `Entorno ${ws.workspace_id.split('-')[0]}`}
                      </h3>
                      
                      <p className="text-[10px] font-bold font-sans text-[#A1A19A] uppercase tracking-widest bg-[#F7F7F5] inline-block px-2 py-1 rounded-md border border-[#EAEAE8]">
                        ID: {ws.workspace_id.split('-')[0]}
                      </p>
                    </div>

                    {!isActive && (
                      <button
                        onClick={() => handleSwitchWorkspace(ws.workspace_id)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#D1D1CD] hover:bg-[#F7F7F5] hover:text-[#111111] text-[#5A5855] text-sm font-bold rounded-xl transition-colors group active:scale-95 shadow-sm"
                      >
                        Cambiar
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. UX DETAIL: CÁPSULA DE APRENDIZAJE Neutralizada */}
          {!hasMultipleWorkspaces && (
            <div className="mt-10 bg-[#F7F7F5] border border-[#EAEAE8] rounded-2xl overflow-hidden transition-all">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-white rounded-lg border border-[#D1D1CD] shrink-0">
                    <Info className="text-[#5A5855]" size={18} strokeWidth={2.5} />
                  </div>
                  <p className="text-sm text-[#5A5855] font-medium mt-1">
                    Recuerda que puedes colaborar en otros entornos; las nuevas asignaciones aparecerán aquí.
                  </p>
                </div>
                <button 
                  onClick={() => setIsHelpExpanded(!isHelpExpanded)}
                  className="shrink-0 flex items-center gap-2 text-sm font-bold text-[#111111] hover:text-brand-primary transition-colors bg-white px-4 py-2 rounded-xl border border-[#D1D1CD] shadow-sm active:scale-95"
                >
                  ¿Cómo unirme a otros?
                  {isHelpExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Contenedor Expandible (Física de Acordeón) */}
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  isHelpExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-6 pt-0 text-sm text-[#5A5855] border-t border-[#EAEAE8] mx-5 mt-2 space-y-3">
                    <p>
                      Para unirte a un nuevo proyecto en Delonix, el <strong className="text-[#111111]">Propietario (Owner)</strong> de ese entorno debe enviarte una invitación directa a tu correo electrónico. 
                    </p>
                    <p>
                      Una vez que recibas el enlace y aceptes la invitación, el nuevo entorno aparecerá automáticamente en esta lista y podrás cambiar entre ellos en cualquier momento.
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