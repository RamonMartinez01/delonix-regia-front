// src/features/workspaces/routes/Dashboard.tsx
import { useEffect, useState } from 'react';
import { ProjectsList } from '../../projects/components/ProjectsList';
import { CreateProjectModal } from '../../projects/components/CreateProjectModal';

import { Modal } from '../../../components/ui/Modal';
import { CreateInvitationForm } from '../../invitations/components/CreateInvitationForm';
import { useActiveWorkspace } from '../api/useActiveWorkspace';
import { useUpdateWorkspace } from '../api/updateWorkspace';
import { Edit3, Plus } from 'lucide-react'; // Estandarizamos íconos

export const Dashboard = () => {
  const { data: workspace, isLoading } = useActiveWorkspace();
  const { mutate: rename, isPending: isUpdating } = useUpdateWorkspace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // ==============================================
  // Workspace Name Edition
  // ==============================================
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (workspace) setNewName(workspace.name);
  }, [workspace]);

  const handleRename = () => {
    if (newName.trim() && newName !== workspace?.name) {
      rename({ id: workspace!.id, name: newName.trim() }, {
        onSuccess: () => setIsEditing(false)
      });
    } else {
      setIsEditing(false);
    }
  };
  // ======================================

  return (
    /* Delegamos el fondo al App.tsx, pero aseguramos el color de texto y estructura */
    <div className="min-h-screen text-[#111111] p-6 md:p-10 relative">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
        
        {/* Cabecera Editorial: Borde sólido y espaciado estructurado */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-[#EAEAE8] pb-6 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold font-display text-[#111111] flex items-center gap-3 tracking-tight">
              {isLoading ? (
                <span className="animate-pulse opacity-50 text-[#A1A19A]">Cargando operaciones...</span>
              ) : isEditing ? (
                /* Input como hendidura física para la edición en línea */
                <div className="flex items-center gap-2 w-full max-w-md">
                  <input
                    autoFocus
                    className="w-full bg-white border border-[#D1D1CD] rounded-xl px-4 py-2 text-2xl font-display font-bold outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all shadow-sm"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                    disabled={isUpdating}
                  />
                </div>
              ) : (
                <>
                  {workspace?.name}
                  {/* Botón de edición: Micro-interacción de color */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#A1A19A] hover:text-brand-primary transition-colors p-2 hover:bg-brand-surface rounded-lg"
                    title="Renombrar Workspace"
                  >
                    <Edit3 size={20} strokeWidth={2.5} />
                  </button>
                </>
              )}
            </h1>
            <p className="text-[#5A5855] font-medium mt-2 text-sm md:text-base">
              Supervisión de infraestructura y modelos de Machine Learning.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* CTA Principal usando nuestros Design Tokens y tactilidad */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto group flex items-center justify-center gap-2 bg-brand-primary hover:bg-[#D46077] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-px active:scale-95"
            >
              <Plus size={18} className="transition-transform group-hover:rotate-90" />
              Nuevo Proyecto
            </button>
          </div>
        </header>

        <main>
          {/* Aquí vive la lista de proyectos */}
          <ProjectsList />
        </main>
      </div>

      {/* Inyectamos la ventana flotante */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Nuevo Modal de Invitaciones */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invitar Colaborador"
      >
        <CreateInvitationForm onSuccess={() => setIsInviteModalOpen(false)} />
      </Modal>
    </div>
  );
};