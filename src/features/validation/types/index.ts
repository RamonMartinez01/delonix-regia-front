// src/features/validation/types/index.ts

// Usamos Record<string, any> para imitar el comportamiento de JSONB. 
// Esto nos permite enviar CUALQUIER estructura sin que TypeScript se queje.
export type PolymorphicData = Record<string, any>;

export interface FeedbackCreate {
  input_data: PolymorphicData;
  prediction: PolymorphicData;
  human_evaluation?: PolymorphicData | null;
}

export interface FeedbackResponse {
  id: string; // UUID
  deployment_id: string; // UUID
  input_data: PolymorphicData;
  prediction: PolymorphicData;
  human_evaluation: PolymorphicData | null;
  created_at: string; // Fecha en formato ISO
}