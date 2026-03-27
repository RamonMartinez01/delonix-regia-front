// src/features/workspaces/types/index.ts

export interface Workspace {
    id: string;
    name: string;
    subscription_tier: string;
    gpu_quota_minutes: number;
    used_gpu_minutes: number;
    created_at: string;
  }