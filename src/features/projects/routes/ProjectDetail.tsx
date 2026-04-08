// src/features/projects/routes/ProjectDetail.tsx  
import { useState } from "react"; 
import { useParams, Link } from "react-router-dom";
import { ExperimentList } from "../../experiments/components/ExperimentList";
import { CreateExperimentModal } from "../../experiments/components/CreateExperimentModal";

export const ProjectDetail = () => {

    // Extrae el ID dinámico de la URL
    const { projectId } = useParams<{ projectId: string }>();

    // Estado para controlar el modal CreateExperimentModla
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Escudo defensivo por si la URL está malformada
    if (!projectId) {
        return (
            <div className="min-h-screen bg-slate-900 p-8 flex justify-center items-center ">
                <div className="bg-red-900/50 text-red-400 p-4 rounded border border-red-500">
                    Error: ID de proyecto no encontrado en la URL
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Navegación de regreso al Dashboard */}
            <div className="mb-6">
              <Link to="/" className="text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2">
                &larr; Volver al Centro de Comando
              </Link>
            </div>
    
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800 pb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-100">
                  Detalles del Proyecto
                </h1>
                <p className="text-slate-400 mt-1 font-mono text-sm">
                  ID: {projectId}
                </p>
              </div>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
                + Nuevo Experimento
              </button>
            </header>
            
            <main>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-200 mb-2">Bitácora de Experimentos</h2>
                <p className="text-slate-400 text-sm">Telemetría reactiva de los modelos asociados a este entorno.</p>
              </div>
              
              {/* 2. Inyectamos nuestra tabla inteligente pasándole el ID */}
              <ExperimentList projectId={projectId} />
            </main>

            {/* Modal - abre con el botón '+ Nuevo Experimento'*/}
            <CreateExperimentModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              projectId={projectId} 
            />
          </div>
        </div>
      );
}