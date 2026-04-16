// src/features/invitations/types/index.ts

// El contrato de creación tras hacer el POST /api/invitations
export interface CreateInvitationPayload {
  email: string;
  project_id?: string | null; // Es opcional en tu backend
  role?: string;              // Tiene un default "MEMBER", pero podemos enviarlo
}

export interface CreateInvitationResponse {
  message: string;
  token: string;
  fallback_link: string;
}

// El contrato que nos devuelve el GET /api/invitations/{token}
export interface ValidateInviteResponse {
  id: string;
  email: string;
  workspace_name: string;
  project_name: string | null;
  invited_by_name: string;
  expires_at: string;
}

// Lo que Azul escribirá en nuestro formulario
export interface AcceptInvitePayload {
  token: string;
  full_name: string;
  password: string;
}

// El contrato de éxito tras hacer el POST /api/invitations/accept
// Nota: Se parece al TokenResponse de auth, pero es específico de este flujo.
export interface AcceptInviteResponse {
  message: string;
  access_token: string;
  token_type: string;
}