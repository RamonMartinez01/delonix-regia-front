// src/features/projects/routes/Dashboard.tsx
import { useEffect, useState } from 'react';
import { ProjectsList } from '../../projects/components/ProjectsList';
import { CreateProjectModal } from '../../projects/components/CreateProjectModal';

import { Modal } from '../../../components/ui/Modal'; // La "cáscara" genérica
import { CreateInvitationForm } from '../../invitations/components/CreateInvitationForm';
import { useActiveWorkspace } from '../api/useActiveWorkspace';
import { useUpdateWorkspace } from '../api/updateWorkspace';

export const Dashboard = () => {
  const { data: workspace, isLoading } = useActiveWorkspace();
  const { mutate: rename, isPending: isUpdating } = useUpdateWorkspace();

  // Estado que controla el modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  // ==============================================
  // Workspace Name Edition
  // ==============================================
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  // Sincronizamos el input con el nombre actual al cargar
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
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400 flex items-center gap-3">
              {isLoading ? (
                <span className="animate-pulse opacity-50">Cargando...</span>
              ) : isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    className="bg-slate-800 border border-emerald-500 rounded px-2 py-1 text-2xl outline-none"
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
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-slate-500 hover:text-emerald-400 transition-colors"
                    title="Renombrar Workspace"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </>
              )}
            </h1>
            <p className="text-slate-400 mt-1">
              Supervisión de infraestructura y modelos de Machine Learning.
            </p>
          </div>

          {/** Botón para el modal de inviatción
           *
           */}
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">
              + Nuevo Proyecto
            </button>
          </div>
        </header>

        <main>
          {/* Aquí vive la lista de proyectos */}
          <ProjectsList />
        </main>
      </div>



      {/* Inyectamos la ventana flotante y pasamos los dos cables de control */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Nuevo Modal de Invitaciones (Usando la cáscara + el nuevo componente) */}
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