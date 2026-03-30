// src/features/workspaces/utils/workspace.ts
const WORKSPACE_KEY = 'delonix_active_workspace';

export const setActiveWorkspace = (workspaceId: string) => {
  localStorage.setItem(WORKSPACE_KEY, workspaceId);
};

export const getActiveWorkspace = (): string | null => {
  return localStorage.getItem(WORKSPACE_KEY);
};

export const removeActiveWorkspace = () => {
  localStorage.removeItem(WORKSPACE_KEY);
};