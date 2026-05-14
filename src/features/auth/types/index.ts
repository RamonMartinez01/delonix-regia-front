// src/features/auth/types/index.ts

// --- 1. Autenticación Básica ---
// Lo que el usuario escribe en el formulario de React
export interface LoginCredentials {
  email: string;
  password: string;
}

/** 
 * Ya no recibimos el token aquí. el 'access_token' viaja oculto en el header Set-Cookie.
 */
export interface AuthResponse {
  detail: string;
  full_name?: string; 
}

// --- 2. Perfil y Autorización (RBAC Contextual) ---

// Definimos los roles exactos que existen en nuestra BD (app/models/user_workspace.py)
export type UserRole = 'owner' | 'engineer' | 'member';

// El contexto individual de cada espacio de trabajo
export interface UserWorkspaceContext {
  workspace_id: string;
  workspace_name: string;
  role: UserRole;
}

// El contrato maestro que devuelve nuestro endpoint GET /api/auth/me
export interface User {
  id: string;
  full_name: string;
  email: string;
  created_at: string; // Las fechas ISO-8601 llegan como strings en JSON
  workspaces: UserWorkspaceContext[];
}