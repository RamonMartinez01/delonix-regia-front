// src/features/experiments/types/index.ts

// ==========================================
// 1. ENUMS Y TIPOS LITERALES (Espejo de SQLAlchemy)
// ==========================================
export type ExperimentStatus = 'queued' | 'processing' | 'completed' | 'failed';
export type MLTaskType = 'text_classification' | 'text_generation' | 'tabular_regression' | 'image_classification';
export type ExperimentForkType = 'fine_tuning' | 're_training';

// ==========================================
// 2. SUB-CONTRATOS (JSONB y Relaciones)
// ==========================================
export interface ExperimentMetrics {
  accuracy?: number;
  loss?: number;
  f1_score?: number;
  epochs_completed?: number;
  [key: string]: any; // Flexibilidad total para el JSONB
}

export interface DeploymentShort {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

// ==========================================
// 3. CONTRATO PRINCIPAL (Espejo de ExperimentResponse)
// ==========================================
export interface Experiment {
  // Identificadores
  id: string;
  project_id: string;
  name: string | null;
  
  // Datos vitales de MLOps
  status: ExperimentStatus;
  task_type: MLTaskType;
  model_source_uri: string;
  dataset_uri: string | null;
  artifact_uri: string | null;
  
  // Entradas y Salidas
  hyperparameters: Record<string, any> | null;
  metrics: ExperimentMetrics | null;
  
  // Trazabilidad
  compute_time_seconds: number;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string | null;

  // --- LINAJE DE MODELOS ---
  parent_id: string | null;
  root_id: string | null;
  version: number;
  evolution_notes: string | null;
  fork_type: ExperimentForkType | null;

  // --- RELACIONES ---
  deployments: DeploymentShort[];
}
