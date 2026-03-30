// src/features/projects/types/index.ts

// Lo que recibimos del servidor (ProjectResponse de FastAPI)
export interface Project {
    id: string;
    name: string;
    slug: string; 
    description: string | null;
    workspace_id: string;
    created_at: string;
    updated_at: string;
}

// Lo que enviamos al servidor para crear (ProjectCreate de FastAPI)
export interface ProjectCreate {
    name: string;
    description?: string; // Opcional, por eso usamos el signo de interrogación
    // Nota: NO enviamos el slug ni el workspace_id, FastAPI se encarga.
}