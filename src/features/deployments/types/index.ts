// src/features/deployments/types/index.ts

export type DeploymentStatus = 'active' | 'stopped';
// Tipamos estrictamente el hardware para tener autocompletado en el Modal
export type HardwareTarget = 'shared_cpu' | 'nvidia_t4' | 'nvidia_a100'; 

// El contrato completo que devolverá FastAPI
export interface Deployment {
  id: string;
  project_id: string;
  experiment_id: string | null;
  name: string;
  instructions: string | null;
  status: DeploymentStatus;
  endpoint_url: string | null;
  task_type: string; //  El ADN heredado
  hardware_target: HardwareTarget | string; //  Entorno de ejecución
  confidence_threshold: number; //  Umbral de certeza
  store_prompts: boolean; //  Bucle de recolección de datos
  created_at: string;
  updated_at: string;
}

// El JSON que le enviaremos a FastAPI para crear el escaparate
export interface CreateDeploymentPayload {
  project_id: string;
  experiment_id: string;
  name: string;
  instructions: string;
  // Añadimos la configuración de grado industrial (el frontend la enviará)
  hardware_target: HardwareTarget | string;
  confidence_threshold: number;
  store_prompts: boolean;
}