// src/features/deployments/types/index.ts

export type DeploymentStatus = 'active' | 'stopped';

// El contrato completo que devolverá FastAPI
export interface Deployment {
  id: string;
  project_id: string;
  experiment_id: string | null; // null si OWNER/ENGINEER borra el experimento en el futuro
  name: string;
  instructions: string | null;
  status: DeploymentStatus;
  endpoint_url: string | null;
  created_at: string;
  updated_at: string;
}

// El JSON que le enviaremos a FastAPI para crear el escaparate
export interface CreateDeploymentPayload {
  project_id: string;
  experiment_id: string;
  name: string;
  instructions: string;
}