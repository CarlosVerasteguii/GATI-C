# 1. Refactoring Rules & Guiding Principles (v2.0 - Battle-Hardened)

## Primary Objective

Align the frontend to the backend API contract (English, camelCase) while preserving a fast, smooth UI and minimizing risk. The frontend remains a "dumb client": UI-only, with business logic and validation on the server. 

Non-goals: No microservices or realtime features are introduced by this refactor; we keep the modular monolith, direct service calls with IoC, and deprioritize realtime. 
 

Business reality to respect: Prioritize UX fluidity over “perfect” data consistency, and treat audit logging as best-effort (must never block the main action).

This document establishes the constitution for our controlled frontend refactoring effort. The goal is to align all frontend data structures, variables, and object keys with the backend API contract (English, camelCase) while improving overall code quality, maintainability, and type safety.

## Refactoring Quality Checklist (GUIDELINES)

Use this as a guide - not a bureaucracy. Focus on the spirit, not perfection:

### ✅ TypeScript Compliance
- [ ] `tsc --noEmit` passes without critical errors
- [ ] Fix obvious `noImplicitAny` issues, but don't over-engineer edge cases
- [ ] Use `@ts-ignore` if it's a temporary fix for a complex external library issue

### ✅ Architecture Alignment
- [ ] File generally follows patterns from `04-Target-Architecture.md`
- [ ] Remove major data mapping layers, but keep pragmatic transformations
- [ ] Use backend data as primary source, but adapt for UX when it makes sense

### ✅ Code Quality Standards
- [ ] Use consistent naming: PascalCase for types, camelCase for variables
- [ ] Fix ESLint errors that matter - ignore style warnings that don't impact functionality
- [ ] Write clear, understandable code - don't over-optimize for perfect "cleanliness"

### ✅ Test Coverage Preservation
- [ ] Don't decrease existing test coverage significantly
- [ ] Add basic tests for critical business logic when practical
- [ ] If tests are failing due to refactoring, fix them - don't let perfect be the enemy of good

## Golden Rules (PRINCIPLES - Not Dogma)

### Backend Contract is Primary Source
The backend API's data contract is the primary source of truth, but adapt when it makes UX sense:
- **PRIORITY:** Match backend field names and types when possible
- **PRAGMATISM:** Transform data for better UX when the cost-benefit makes sense
- **JUDGMENT:** Use your best judgment - perfect consistency isn't worth terrible UX
- **SIMPLICITY:** Keep transformations simple and obvious, not complex mapping layers

### Commit Atomicity
Each file or small, logical group of related files will be refactored and committed individually to maintain a clean, revertible git history:
- One logical change per commit
- Clear, descriptive commit messages following conventional commit format
- Ability to revert individual changes without affecting unrelated code
- Each commit should compile successfully and pass basic type checking

### Test Coverage Preservation (CRITICAL)
**Refactoring must never decrease test coverage.** If a file lacks adequate tests:
- Add basic unit tests covering the main functionality as part of the refactoring
- Document test coverage gaps with `// TODO: Add comprehensive tests for edge cases`
- Critical business logic files must have at least 70% coverage post-refactor

### Separation of Concerns (GUIDELINE)
**Pull Requests should be focused, but use your judgment:**
- **RECOMMENDED:** Keep refactoring and new features separate when practical
- **PRAGMATIC APPROACH:** If a small fix during refactoring makes sense, include it - don't create bureaucracy for tiny changes
- **LARGE CHANGES:** Split major features from refactoring into separate PRs
- **SPEED OVER BUREAUCRACY:** Prioritize developer productivity over perfect separation

## 4. Naming & Casing Constitution

This section is the absolute source of truth for all naming conventions. All code, identifiers, comments, commit messages, and docs are in English. UI copy is also in English for now. Spanish i18n may be added later (out of scope of this refactor).

### 4.1. TypeScript/JavaScript Code
- Convention: `camelCase`
- Applies to: variables, function names, object properties
- Example: `const productPrice = calculateDiscount(product.unitPrice);`

### 4.2. TypeScript Types, Classes & Components
- Convention: `PascalCase`
- Applies to: interfaces, types, classes, React component names
- Example: `interface InventoryItem { ... }`, `class AuthService { ... }`, `function ProductTable() { ... }`

### 4.3. Enums and Enum Values
- Single standard: `UPPER_SNAKE_CASE` string values across the entire stack (API/DB/wire).
- TypeScript (preferred): string literal unions that exactly match the API/DB values.
- If TypeScript enums are used: members must be string-valued and equal to the same `UPPER_SNAKE_CASE` tokens (no numeric enums).
- Prisma: enum members must be the same `UPPER_SNAKE_CASE` tokens; persisted as such.
- Examples:
  - TypeScript (preferred): `export type UserRole = 'ADMINISTRATOR' | 'EDITOR' | 'READER';`
  - TypeScript enum (allowed): `export enum UserRole { ADMINISTRATOR = 'ADMINISTRATOR', EDITOR = 'EDITOR', READER = 'READER' }`
  - Prisma: `enum UserRole { ADMINISTRATOR EDITOR READER }`

### 4.4. API JSON Payloads (Client <-> Server)
- Convention: `camelCase` keys for all JSON bodies; enum values are `UPPER_SNAKE_CASE` strings.
- Backend owns transformations to/from DB and other layers.
- Success example: `{"success": true, "data": {"id":"cuid123","serialNumber":"SN-456","purchaseDate":"2024-01-15T00:00:00.000Z"}}`
- Error shape is standardized (see 4.9).

### 4.5. Database Schema (Prisma)
- Model/enum names: `PascalCase` (e.g., `model Product`, `enum UserRole`).
- Field names (in schema): `camelCase` (e.g., `serialNumber`).
- Column/table names (in DB): `snake_case` (singular).
- Implementation: fields MUST use `@map("<snake_case>")`; tables MUST use `@@map("<snake_case>")`.
- Example:
  ```
  model Product {
    id           String    @id @default(cuid())
    name         String
    serialNumber String?   @map("serial_number")
    purchaseDate DateTime? @map("purchase_date")
    // ...
    @@map("product")
  }

  enum UserRole {
    ADMINISTRATOR
    EDITOR
    READER
  }
  ```

### 4.6. Environment Variables (.env)
- Convention: `UPPER_SNAKE_CASE`
- Examples: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`

### 4.7. Mapping Policy & Ownership
- Boundary mapping only: all transformations happen at the edges (controllers/transport), not scattered through services.
- Ownership:
  - Server: `src/mappers/<aggregate>Mapper.ts` for API <-> Domain <-> Persistence (if needed).
  - Client: `lib/mappers/<aggregate>Mapper.ts` for API <-> ViewModel (only where necessary).
- DTOs: controllers accept/emit DTOs; services operate on domain types; Prisma models mapped via `@map`.
- Prohibited: ad‑hoc, duplicated, or implicit mappings inside controllers/services.
- Temporary compatibility: during migration, accept legacy `snake_case` input, normalize to `camelCase`, and log a deprecation warning. Remove after the deprecation window ends.

### 4.8. Query Params & Headers
- Query params: `camelCase` (e.g., `GET /api/v1/products?includeDocuments=true&minCost=100`).
- Headers: dash-case on the wire (e.g., `x-correlation-id`); `camelCase` in code helpers (`xCorrelationId`).
- Always propagate/log a correlation id (`x-correlation-id`) across services for traceability.

### 4.9. Error Payload Contract
- Shape (always `camelCase` keys; enum-like codes in `UPPER_SNAKE_CASE`):
  ```
  {
    "success": false,
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [{ "field": "serialNumber", "message": "Required" }],
    "traceId": "uuid-or-correlation-id",
    "timestamp": "2025-01-15T12:34:56.000Z"
  }
  ```
- Standard codes: `VALIDATION_ERROR`, `AUTHENTICATION_ERROR`, `AUTHORIZATION_ERROR`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_SERVER_ERROR`, `RATE_LIMIT_EXCEEDED`, `SERVICE_UNAVAILABLE`.
- Controllers must consistently forward errors; a global error handler serializes them to this contract.

### 4.10. Language Policy (Repo‑Wide)
- English only for code, identifiers, comments, docs, commit messages, and branch names.
- UI copy in English for now. Spanish i18n may be added later; keep identifiers English regardless.

### 4.11. Examples & Anti‑Examples
- Good (API body, enums, DB mapping aligned):
  - Request: `{"name":"Laptop","serialNumber":"SN-001","purchaseDate":"2024-01-15T00:00:00.000Z","role":"EDITOR"}`
  - Prisma model field: `serialNumber @map("serial_number")`
  - Prisma enum: `EDITOR`
- Bad:
  - Request with `snake_case` keys: `{"serial_number":"SN-001"}` (allowed only temporarily during migration).
  - Mixed-language identifiers: `numeroSerie`, `LECTOR`.

### 4.12. Phased Migration Plan (Authoritative)
- Phase 1 — Backend Foundations
  - Prisma: change model fields to `camelCase` with `@map` for `snake_case` columns; set tables to singular `snake_case` with `@@map`.
  - Enums: migrate existing data from Spanish to English `UPPER_SNAKE_CASE` (e.g., `ADMINISTRADOR` -> `ADMINISTRATOR`, `LECTOR` -> `READER`). Provide SQL/data migration scripts.
  - Validation: update Zod schemas to expect `camelCase` API keys; add compatibility to accept legacy `snake_case` input (normalize + warn).
  - Mappers: introduce `src/mappers/*` and use DTOs at controllers; services speak domain types.
  - Errors: implement the standardized error contract (4.9) in the global error handler.
- Phase 2 — Frontend Alignment
  - Types: rename Spanish properties to English `camelCase` (e.g., `numeroSerie` -> `serialNumber`).
  - API: ensure all requests use `camelCase` keys; adjust API client and mocks/tests.
  - UI Copy: English; no Spanish identifiers.
- Phase 3 — Deprecation & Cleanup
  - Remove legacy `snake_case` acceptance; delete temporary mapping branches/logs.
  - Sweep for Spanish identifiers and mixed casing; fix with codemods where feasible.
  - Update docs/ADR/SRS to reflect the final contract and conventions.
- Phase 4 — Quality Gates
  - Enforce ESLint `@typescript-eslint/naming-convention` for `camelCase`/`PascalCase`.
  - Add contract tests (OpenAPI or schema-based) to validate API shapes and enum values.
  - Run E2E and smoke tests focusing on inventory/auth flows and enum-dependent behavior.
  - CI: fail builds on naming violations or contract drift.

## [DEPRECATED] Naming and Casing Conventions

### TypeScript Types/Interfaces
All TypeScript types and interfaces MUST use `PascalCase`:
```typescript
// ✅ Correct
interface InventoryItem {
  id: number;
  productName: string;
  serialNumber?: string;
}

// ❌ Incorrect
interface inventoryItem {
  id: number;
  product_name: string;
  serial_number?: string;
}
```
**Enforcement:** This rule will be enforced by ESLint with the `@typescript-eslint/naming-convention` rule.

### Object Properties/Variables/Functions
All object properties, variables, and functions MUST use `camelCase`:
```typescript
// ✅ Correct
const userProfile = {
  firstName: "John",
  lastName: "Doe",
  emailAddress: "john.doe@example.com",
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
};

// ❌ Incorrect
const user_profile = {
  first_name: "John",
  last_name: "Doe",
  email_address: "john.doe@example.com",
  get_full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }
};
```
**Enforcement:** This rule will be enforced by ESLint with the `@typescript-eslint/naming-convention` rule.

### File Names
- **Component files**: Use `PascalCase` (e.g., `InventoryTable.tsx`, `UserProfile.tsx`, `ProductCard.tsx`)
- **Service/utility files**: Use `camelCase` (e.g., `apiClient.ts`, `validationUtils.ts`, `dateFormatter.ts`)
- **Configuration files**: Use appropriate naming conventions for their purpose
- **Index files**: Use `index.ts` for barrel exports

## Architecture Fusion Rules (GUIDELINES)

### New Files
New files should generally follow the patterns in `04-Target-Architecture.md`, but use judgment:
- **GOOD STARTING POINT:** Use the architectural patterns as a foundation
- **ADAPT AS NEEDED:** Modify for specific use cases if it makes the code simpler
- **CONSISTENCY MATTERS:** Keep similar files following similar patterns

### Modified Files
When modifying files, improve them - but don't force complete rewrites for tiny changes:
- **IMPROVE WHAT YOU TOUCH:** If you're in a file, make pragmatic improvements
- **WHOLE REWRITES:** Reserve for major functionality changes, not minor updates
- **PRAGMATIC APPROACH:** Fix obvious issues, but don't over-engineer simple changes

## Process and Workflow

### Follow the Map (But Stay Flexible)
Use these documents as guides, not straightjackets:
- `02-Full-File-Checklist.md`: Starting point for file inventory
- `03-Domain-Encyclopedia.md`: Reference for naming conversions
- `04-Target-Architecture.md`: Architectural patterns and inspiration

### Work Efficiently
Focus on productivity over perfection:
- **BATCH SIMILAR WORK:** Group similar files together when it makes sense
- **FIX AS YOU GO:** Don't wait to fix obvious issues - address them when you see them
- **JUDGMENT CALLS:** Skip the complex dependency analysis for simple, isolated files

### Build and Test Pragmatically
Quality checks should help, not hinder:
- **BUILD REGULARLY:** Run `npm run build` after major changes, not every tiny edit
- **TEST WHAT MATTERS:** Focus on critical functionality tests, not 100% coverage
- **FIX WHAT BREAKS:** When something breaks, fix it - don't let perfect prevent progress

### Quality Assurance (Pragmatic)
Each refactored file should generally:
- Compile without critical errors
- Maintain core functionality
- Use consistent naming patterns
- Be understandable by other developers
- Pass existing tests (when they exist and matter)


