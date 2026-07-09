# Delonix - Frontend

This repository contains the frontend application for **Delonix**, a B2B SaaS platform designed for Machine Learning Model User Acceptance Testing (UAT) and deployment monitoring. 

The interface facilitates the workflow between ML engineers managing models and stakeholders, validating them through a structured feedback loop (Data Flywheel).

## Tech Stack

* **Core:** React, TypeScript
* **Routing:** React Router (DOM)
* **Data Fetching & Caching:** TanStack Query (React Query)
* **State Management:** Zustand
* **Styling:** Tailwind CSS
* **Iconography:** Lucide React
* **Build Tool:** Vite

## Architecture (Feature-Driven)

The codebase is organized using a feature-based architecture to encapsulate logic, UI, and state by domain:

* `workspaces` & `projects`: Context management and grouping for ML operations.
* `team` & `invitations`: Role-Based Access Control (RBAC) handling (Owner, Engineer, Member) and secure access routing.
* `experiments`: Interfaces for model telemetry, hyperparameter tracking, and architecture forking.
* `deployments`: Configuration panels for UAT endpoints, hardware targets, and confidence thresholds.
* `validation` (V-Hub): The stakeholder portal, featuring the Inference Arena for direct model testing and the Feedback History for audit logs.

## Design System

The UI relies on a functional, editorial design language optimized for B2B technical tools:
* **Layout:** High contrast, structurally bordered containers over dark/neon themes to reduce visual fatigue.
* **Typography:** Strict separation between natural language (sans-serif) and technical metadata/metrics (monospaced, uppercase).
* **Interaction:** Predictable tactile affordances (inner shadows for inputs, subtle elevations for interactive cards).

## API Communication

Server state is managed exclusively through TanStack Query. API calls are isolated in `api/` directories within each feature module and utilize a centralized Axios instance (`src/config/axios.ts`) for interceptors and authentication headers.
