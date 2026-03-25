// src/features/projects/components/ProjectCard.tsx
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-emerald-500 transition-colors shadow-lg flex flex-col h-full">
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-slate-100 mb-2 truncate" title={project.name}>
          {project.name}
        </h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
          {project.description || 'Sin descripción proporcionada.'}
        </p>
      </div>
      
      <div className="pt-4 border-t border-slate-700 mt-auto flex justify-between items-center text-xs text-slate-500">
        <span className="font-mono bg-slate-900 px-2 py-1 rounded">
          ID: {project.id.split('-')[0]}
        </span>
        <span>
          {new Date(project.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};