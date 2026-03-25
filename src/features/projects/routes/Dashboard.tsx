// src/features/projects/routes/Dashboard.tsx
import { ProjectsList } from '../components/ProjectsList';

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
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
          
          <button className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-900/20">
            + Nuevo Proyecto
          </button>
        </header>
        
        <main>
          {/* Aquí inyectamos el cerebro asíncrono que construimos */}
          <ProjectsList />
        </main>
      </div>
    </div>
  );
};