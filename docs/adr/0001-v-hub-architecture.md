# ADR 0001: Architecture, Security, and UI Design for the Validation Hub (V-Hub)

**Date:** April 2026
**Status:** Accepted
**Domain:** Frontend (React) / Backend (FastAPI)

## 1. Context and Problem
Delonix-Regia requires a specialized environment where Stakeholders (`MEMBER` role, e.g., "Azul") can evaluate Machine Learning models deployed by Engineers (`OWNER`/`ENGINEER` roles, e.g., "Penélope").

Initially, the validation environment shared endpoints with the engineering domain, the inference playground relied on local JavaScript simulations for "Cold Starts," and deployment IDs were hardcoded. 

As the platform evolves to support A/B Testing methodologies (Champion/Challenger), Stakeholders need to test and compare multiple active deployments within a single project without cognitive overload. Furthermore, the platform must guarantee absolute Tenant Isolation and granular access control.

## 2. Architectural Decision
We have decided to implement a **Zero Trust Architecture** and refactor the V-Hub using a **Master-Detail pattern** coupled with **Feature-Sliced Design (FSD)** principles.

### 2.1 Security and Isolation (Backend)
* **Strict RBAC Guard:** The React Router has been upgraded to restrict the `/v-hub` path exclusively to the `member` role.
* **Query Forking:** Read endpoints (`GET /api/projects` and `GET /api/deployments`) now implement dynamic SQL branching. If the user is a `MEMBER`, the query enforces a `JOIN` with the `project_members` table, ensuring only explicitly shared data is transmitted.

### 2.2 UI Design and UX (Frontend)
* **Rejection of Traditional Tabs:** We discarded top-level tabs or "Preview" landing pages to minimize friction and prevent context loss during model comparison.
* **Micro-Card Sidebar Implementation:** The `VHubPlayground.tsx` container acts as an **Orchestrator**. A left sidebar renders dynamic "Micro-Cards" fetched from the `/deployments/project/{id}` endpoint, allowing instantaneous toggling between active models.
* **Inference Arena Isolation (`InferenceArena.tsx`):** Inference logic and polymorphic feedback mutations (`JSONB`) are delegated to a specialized child component. This component is re-mounted cleanly whenever the Orchestrator updates the active `deployment_id`.

### 2.3 Inference Engine Communication
* The client-side JavaScript mock for "Cold Starts" has been removed. The `InferenceArena` now executes real POST requests to `/api/deployments/{id}/infer` via an abstracted API layer, connecting the V-Hub to actual backend GPU simulation cycles.

## 3. Consequences

### Positive:
* **A/B Scalability:** Engineers can publish multiple models per project, and the V-Hub UI will adapt dynamically.
* **Hardened Security:** Horizontal privilege escalation and data leak risks between tenants are fully mitigated.
* **Premium UX:** The Micro-Card navigation and ephemeral toast notifications provide a "white-glove" experience suitable for high-level stakeholders.

### Negative / Risks:
* Increased state complexity in React due to the need for synchronizing the "Selected Deployment" between the Orchestrator and the Arena.

---

# ADR 0001: Arquitectura, Seguridad y Diseño de Interfaz del Validation Hub (V-Hub)

**Fecha:** Abril 2026
**Estado:** Aceptado
**Dominio:** Frontend (React) / Backend (FastAPI)

## 1. Contexto y Problema
Delonix-Regia requiere un entorno donde los Stakeholders (rol `MEMBER`, ej. "Azul") puedan evaluar modelos de Machine Learning desplegados por los Ingenieros (rol `OWNER`/`ENGINEER`, ej. "Penélope"). 

Inicialmente, el entorno de validación compartía endpoints con el entorno de ingeniería, la interfaz de prueba (Playground) simulaba localmente las inferencias mediante JavaScript, y el ID del despliegue estaba codificado de forma rígida (`hardcoded`). 

A medida que se introducen metodologías de A/B Testing (Champion/Challenger), los Stakeholders necesitan probar y comparar múltiples despliegues activos dentro de un mismo proyecto sin sufrir sobrecarga cognitiva, y la plataforma requiere garantías absolutas de aislamiento de inquilinos (Tenant Isolation).

## 2. Decisión Arquitectónica
Se ha decidido implementar una arquitectura de Confianza Cero (Zero Trust) y rediseñar el V-Hub bajo el patrón de diseño "Master-Detail" acoplado a Feature-Sliced Design (FSD).

### 2.1 Seguridad y Aislamiento (Backend)
* **RBAC Estricto en Enrutador:** Se configuró el enrutador de React para restringir la ruta `/v-hub` exclusivamente al rol `MEMBER`.
* **Query Forking:** Los endpoints de lectura (`GET /api/projects` y `GET /api/deployments`) ahora bifurcan la consulta SQL. Si el usuario es `MEMBER`, se exige un `JOIN` con la tabla `project_members`, garantizando que solo los datos explícitamente compartidos viajen por la red.

### 2.2 Diseño de Interfaz y UX (Frontend)
* **Rechazo de Pestañas Tradicionales:** Se descartó el uso de pestañas superiores o una vista de "Sala de Espera" (Preview) para evitar clics innecesarios y pérdida de contexto al comparar modelos.
* **Adopción de Micro-Tarjetas (Barra Lateral):** El contenedor `VHubPlayground.tsx` actúa como un Orquestador. Una barra lateral izquierda renderiza "Micro-Tarjetas" dinámicas obtenidas del endpoint `/deployments/project/{id}`, permitiendo alternar rápidamente entre modelos activos.
* **Aislamiento de la Arena (`InferenceArena.tsx`):** La lógica de inferencia y la mutación de retroalimentación polimórfica (`JSONB`) se delegaron a un componente hijo especializado. Este componente se destruye y se reconstruye limpiamente cada vez que el Orquestador cambia el `deployment_id` activo.

### 2.3 Comunicación con el Motor de Inferencia
* Se eliminó el *mock* de Cold Start en JavaScript. La `InferenceArena` ahora ejecuta una petición POST real hacia `/api/deployments/{id}/infer` a través de una función asíncrona pura en la capa API de Axios, conectando el V-Hub con los ciclos de GPU simulados o reales del backend.

## 3. Consecuencias

### Positivas:
* **Escalabilidad A/B:** Los Ingenieros pueden publicar *n* cantidad de modelos para un mismo proyecto y el V-Hub se adaptará automáticamente.
* **Seguridad:** Riesgo de fuga de datos (Data Leak) entre inquilinos completamente mitigado.
* **UX Premium:** La navegación por Micro-Tarjetas y las notificaciones efímeras (Toasts) reemplazan los `alerts()` nativos, ofreciendo una experiencia "guante blanco".

### Negativas / Riesgos:
* Aumenta ligeramente la complejidad del estado en React al tener que sincronizar el "Despliegue Seleccionado" entre el padre (`VHubPlayground`) y el hijo (`InferenceArena`).