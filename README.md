# Delonix - Frontend (MLOps Workflow Showcase)

Delonix Regia is a specialized frontend dashboard built to showcase the operational lifecycle of Machine Learning models, specifically focusing on User Acceptance Testing (UAT) and deployment monitoring. 

The core mission of this repository is to demonstrate the practical application of MLOps as a bridge, translating complex analytical models into interactive, validated business assets.

## Architectural Approach: Production Baseline vs. Simulation

To provide a comprehensive demonstration without the infrastructural overhead of active GPU clusters, the system architecture purposefully decouples production-grade operational logic from compute simulation:

* **Production-Grade Infrastructure:** * **Security:** Full JSON Web Token (JWT) authentication workflow operating through secure `HttpOnly` cookies to mitigate XSS vulnerabilities.
  * **Multi-Tenancy & Context Shifting:** True multi-tenant workspace isolation. The client dynamically manages and appends the active workspace context (`X-Workspace-ID`) via Axios API interceptors.
  * **Strict RBAC Enforcement:** Role-Based Access Control (`OWNER`, `ENGINEER`, `MEMBER`) is strictly validated by the backend. The frontend maps these scopes directly via type-safe route guards.
  * **Asynchronous Invitations:** Collaborative invitations utilize automated cryptographic token validation, backed by an asynchronous thread worker pool using Resend.
* **Simulated ML Environment:** * The actual model training, model forks, and live inferences are handled via a robust asynchronous background runner (`ml_runner.py`) in the backend using `asyncio.sleep` pools and randomized hyper-realistic metric matrices. The frontend consumes these state transitions identically to a live deployment pipeline.

## Frontend Engineering & Technical Patterns

### 1. Feature-Driven Architecture
The repository adheres to a feature-sliced directory structure, isolating components, API mutations (TanStack Query), and types by localized domains (`validation`, `deployments`, `experiments`, `workspaces`). This minimizes cross-module coupling and scales cleanly.

### 2. State & Cache Synchronization
* **Client State (Zustand):** Manages volatile layout states, active workspace selections, and runtime session context.
* **Server State (TanStack Query):** Manages data caching, optimistic UI updates, and explicit invalidation cycles (e.g., refreshing the stakeholder feedback history seamlessly upon new entry submissions).

### 3. Identity Hydration & Protective Routing
The `ProtectedRoute` wrapper acts as an operational gatekeeper. It intercepts routing initialization during client store hydration (`isHydrating`), checking authenticated profile telemetry against strict role arrays before rendering child outlets.

### 4. Technical Editorial UI/UX
The user interface rejects standard flashy trends in favor of an editorial, documentation-first design language:
* **Typography Hierarchy:** Uses crisp sans-serif configurations for high-level documentation and monospace formatting exclusively for technical metadata, hyper-parameters, and model logs.
* **Affordance & Physics:** Relies on clear structural bordering and tactile interaction indicators (inner shadows for text-area inputs, subtle elevation translations for selection cards) to facilitate accurate data entry during validation procedures.

## Tech Stack

* **Core Runtime:** React 18, TypeScript
* **Routing Infrastructure:** React Router DOM
* **Asynchronous Server Cache:** TanStack Query (React Query v5)
* **Global Store Management:** Zustand
* **Styling Framework:** Tailwind CSS
* **Iconography Integration:** Lucide React
* **Build Architecture:** Vite

## Module Index

* `src/features/workspaces`: Context orchestration and active multi-tenant shifting logic.
* `src/features/experiments`: Views mapping training iterations, hyperparameter tracking, model lineage records, and fine-tuning fork selectors.
* `src/features/deployments`: Configuration forms for UAT deployment targets, endpoint provisioning, and confidence thresholds.
* `src/features/validation` (V-Hub): Dedicated stakeholder workspace containing the input-output Inference Arena and the persistent history audit log.

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   
2. Install runtime dependencies:
   npm install
   
3. Initialize the local development server:
   npm run dev
