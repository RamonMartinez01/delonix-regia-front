// src/features/projects/routes/Dashboard.tsx
import { useState } from 'react';
import { ProjectsList } from '../components/ProjectsList';
import { CreateProjectModal } from '../components/CreateProjectModal';

import { Modal } from '../../../components/ui/Modal'; // La "cáscara" genérica
import { CreateInvitationForm } from '../../invitations/components/CreateInvitationForm';

export const Dashboard = () => {
  // Estado que controla el modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-emerald-400">
              Centro de Comando
            </h1>
            <p className="text-slate-400 mt-1">
              Supervisión de infraestructura y modelos de Machine Learning.
            </p>
          </div>

          {/** Botón para el modal de inviatción
           *
           */}
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Nuevo botón para Invitaciones */}
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors border border-slate-600"
            >
              Invitar Colaborador
            </button>

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