// src/features/team/types/index.ts

export type TeamRole = 'owner' | 'engineer' | 'member';

export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: TeamRole;
  joined_at: string;
  assigned_projects: { id: string; name: string }[];
}

export interface PendingInvite {
  id: string;
  email: string;
  role: TeamRole;
  project_name?: string;
  expires_at: string;
}

export interface TeamMatrix {
  members: TeamMember[];
  pending_invitations: PendingInvite[];
}