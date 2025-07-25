# Backend Architecture & API Mocking (GATI-C)

## Overview
This documentation describes the backend architecture, API endpoint design, and mocking strategy for the GATI-C project, strictly aligned with the Product Requirements Document (PRD) and Software Requirements Specification (SRS).

- **Stack:** Node.js (Express, TypeScript), RESTful API, JWT authentication, RBAC, Zod validation, Prisma ORM (future real backend).
- **API Versioning:** All endpoints are under `/api/v1/`.
- **Response Format:**
  - Success: `{ "success": true, "data": { ... } }`
  - Error: `{ "success": false, "error": { code, message } }`
- **Mocking:** We use Next.js API routes to simulate backend endpoints for frontend integration and rapid prototyping.

## Endpoints (Mocked)
- `GET /api/v1/thresholds` — Retrieve all thresholds (global, category, product)
- `POST /api/v1/thresholds/global` — Update global threshold (Admin only)
- `POST /api/v1/thresholds/category/:categoryName` — Update category threshold (Admin only)
- `POST /api/v1/thresholds/product/:productId` — Update product threshold (Admin only)

## Why Mock?
- Enables frontend development and integration before the real backend is ready.
- Allows testing of error handling, RBAC, and response formats as per PRD/SRS.
- Ensures a smooth transition to the real backend: only the fetch URLs and authentication logic will need to change.

## Migration Strategy
- All TODOs are clearly marked for future backend, audit logging, and JWT/RBAC integration.
- The mock API follows the same contract as the real backend, minimizing refactor effort.

---

## See also
- [Product Requirements Document (PRD)](../Product%20Requirements%20Document%20(PRD)%20de%20GATI-C.md)
- [Software Requirements Specification (SRS)](../Software%20Requirements%20Specification%20(SRS)%20-%20GATI-C%20v2.0%20(Enterprise-Grade).md) 