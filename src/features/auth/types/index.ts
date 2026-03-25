// src/features/auth/types/index.ts

// 1. Lo que el usuario escribe en el formulario de React
export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  // 2. El contrato exacto que nos devuelve FastAPI (Token esquema Pydantic)
  export interface TokenResponse {
    access_token: string;
    token_type: string;
  }