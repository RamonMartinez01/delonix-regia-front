// src/features/experiments/types/index.ts

// Los estados posibles de nuestros experimentos
export type ExperimentStatus = 'queued' | 'processing' | 'completed' | 'failed';

// Tipado de las métricas
export interface ExperimentMetrics {
  accuracy?: number;
  loss?: number;
  f1_score?: number;
  epochs_completed?: number;
  [key: string]: any; // Por si en el futuro mandamos otras métricas distintas
}

// El contrato con el backend
export interface Experiment {
  id: string;
  project_id: string;
  name: string | null;
  status: ExperimentStatus;
  model_source_uri: string;
  dataset_uri: string | null;
  hyperparameters: Record<string, any> | null; // Usamos Record para el JSON dinámico
  metrics: ExperimentMetrics | null;
  compute_time_seconds: number | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string | null;
}