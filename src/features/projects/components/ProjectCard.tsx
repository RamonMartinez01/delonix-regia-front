// src/features/projects/components/ProjectCard.tsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {

    return (
        /* Envolvemos la tarjeta en un Link. Aplicamos la base interactiva al grupo. */
        <Link to={`/dashboard/projects/${project.id}`} className="block h-full group focus:outline-none rounded-2xl transition-all">
            
            <div className="bg-white border border-[#EAEAE8] rounded-2xl p-6 hover:border-brand-accent transition-all shadow-sm hover:shadow-md hover:-translate-y-1 flex flex-col h-full cursor-pointer relative">
                
                <div className="grow relative z-10">
                    <h3 className="text-xl font-bold font-display text-[#111111] mb-2 truncate group-hover:text-brand-primary transition-colors" title={project.name}>
                        {project.name}
                    </h3>
                    <p className="text-[#5A5855] text-sm mb-6 line-clamp-2 font-medium">
                        {project.description || 'Sin descripción proporcionada.'}
                    </p>
                </div>

                {/* Pie de tarjeta: Metadatos estructurales */}
                <div className="pt-5 border-t border-[#EAEAE8] mt-auto flex justify-between items-center relative z-10">
                    
                    {/* ID como etiqueta de inventario */}
                    <span className="font-sans text-[10px] font-bold text-[#A1A19A] tracking-widest uppercase bg-[#F7F7F5] px-2.5 py-1 rounded-md border border-[#EAEAE8]">
                        ID: {project.id.split('-')[0]}
                    </span>
                    
                    <div className="flex items-center gap-3">
                        {/* Fecha estandarizada a nuestro formato de metadatos */}
                        <span className="text-[10px] font-bold text-[#A1A19A] tracking-widest uppercase">
                            {new Date(project.updated_at).toLocaleDateString('es-ES', { 
                                day: '2-digit', month: 'short', year: 'numeric' 
                            }).replace('.', '')}
                        </span>
                        
                        {/* Micro-interacción: Botón circular de avance (Affordance) */}
                        <div className="w-7 h-7 rounded-full bg-[#F7F7F5] border border-[#EAEAE8] flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-colors">
                            <ArrowRight size={14} className="text-[#A1A19A] group-hover:text-white transition-colors" />
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    );
};