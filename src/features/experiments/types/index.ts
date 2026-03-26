// src/features/experiments/types/index.ts

// Los estados posibles de nuestros experimentos
export type ExperimentStatus = 'queued' | 'running' | 'completed' | 'failed';

// El contrato con el backend
export interface Experiment {
  id: string;
  project_id: string;
  name: string;
  model_source_uri: string;
  dataset_uri: string | null;
  hyperparameters: Record<string, any>; // Usamos Record para el JSON dinámico
  status: ExperimentStatus;
  compute_time_seconds: number | null;
  created_at: string;
  finished_at: string | null;
}