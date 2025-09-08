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

This section is the source of truth for naming conventions as implemented today. Code identifiers (variables, functions, types, etc.) are in English. User‑facing strings (API error messages, comments) may currently be in Spanish. English‑only UI copy and broader i18n are out of scope for this refactor.

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
- Boundary transformations are handled within the module’s Zod schemas (see 4.7).
- Success example: `{"success": true, "data": {"id":"cuid123","serialNumber":"SN-456","purchaseDate":"2024-01-15T00:00:00.000Z"}}`
- NOTE: The inventory module currently accepts legacy `snake_case` inputs and normalizes them to `camelCase` via Zod transforms for backward compatibility (e.g., `serial_number` -> `serialNumber`, `purchase_date` -> `purchaseDate`).

### 4.5. Database Schema (Prisma)
- Model/enum names: `PascalCase` (e.g., `model Product`, `enum UserRole`).
- Field names (in schema): `camelCase` (e.g., `serialNumber`).
- Column/table names (in DB): `snake_case` (singular).
- Implementation: fields are defined in `camelCase`. Use `@map("<snake_case>")` only when the database column name differs; tables use `@@map("<snake_case>")`.
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
- Boundary mapping only: transformations happen at the edges (controllers/transport), not scattered through services.
- Ownership (today): boundary transformations are handled within the module’s Zod schemas (e.g., in `inventory.types.ts`).
- DTOs: controllers accept/emit DTOs; services operate on domain types; Prisma models mapped via `@map` (when names differ).
- Prohibited: ad‑hoc, duplicated, or implicit mappings inside controllers/services.
- Temporary compatibility: accept legacy `snake_case` input and normalize to `camelCase` in schemas.
- (Future Enhancement): Log a warning when legacy `snake_case` payloads are received and plan depreciation.

### 4.8. Query Params & Headers
- Query params: `camelCase` (e.g., `GET /api/v1/products?includeDocuments=true&minCost=100`).
- Headers: standard HTTP header casing on the wire; map to idiomatic names in code helpers when needed.
- (Future Enhancement): A system‑wide `x-correlation-id` for tracing can be implemented later.

### 4.9. Error Payload Contract
- Shape (current, implemented):
  ```
  {
    "success": false,
    "error": { "code": "<ERROR_CODE>", "message": "<Human-readable message>" }
  }
  ```
- Mapping rules:
  - Operational errors (`AppError` and subclasses): HTTP status = `err.statusCode`; `error.code = err.name`; `error.message = err.message`.
  - 404 handler: `{ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint no encontrado' } }`.
  - Unhandled errors: HTTP 500 with `{ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Ha ocurrido un error inesperado' } }`.
- Notes:
  - There is no `details`, `traceId`, or `timestamp` field today.
  - Controllers should forward errors to the global handler for consistent serialization.

### 4.10. Language Policy (Repo‑Wide)
- Code identifiers (variables, functions, types, etc.) MUST be in English.
- User‑facing strings (API error messages, comments) may currently be in Spanish.
- (Future Enhancement): Converge on English‑only user‑facing strings and/or add i18n as needed.

### 4.11. Examples & Anti‑Examples
- Good (API body, enums, DB mapping aligned):
  - Request: `{"name":"Laptop","serialNumber":"SN-001","purchaseDate":"2024-01-15T00:00:00.000Z","role":"EDITOR"}`
  - Prisma model field: `serialNumber @map("serial_number")`
  - Prisma enum: `EDITOR`
  - Error response: `{"success": false, "error": { "code": "NOT_FOUND", "message": "Endpoint no encontrado" }}`
- Bad (avoid in new code):
  - Request with `snake_case` keys: `{"serial_number":"SN-001"}` — currently accepted in the inventory module for backward compatibility and normalized to `camelCase` via Zod; prefer `camelCase`.
  - Mixed-language identifiers: `numeroSerie`, `LECTOR`.

### 4.12. Phased Migration Plan (Future Enhancements)
- Phase 1 — Backend Enhancements (planned)
  - Prisma: continue defining fields in `camelCase`; use `@map` only where column names differ; tables use `@@map` to singular `snake_case`.
  - Validation: keep expecting `camelCase` API keys; maintain compatibility to accept legacy `snake_case` input while it’s needed.
  - Mapping: consider introducing dedicated mappers (`src/mappers/*`) and DTOs if complexity grows; today, Zod schemas handle boundary normalization.
  - Errors: consider enhancing the error contract with optional `details`/`traceId`/`timestamp` fields if/when needed.
  - Observability: consider adding a system‑wide `x-correlation-id` and deprecation warnings for legacy `snake_case` inputs.
- Phase 2 — Frontend Alignment
  - Types: prefer English `camelCase` properties (e.g., `numeroSerie` -> `serialNumber`).
  - API: ensure requests use `camelCase` keys; adjust API client and tests as needed.
  - UI Copy: converge on English as appropriate.
- Phase 3 — Deprecation & Cleanup
  - Remove legacy `snake_case` acceptance when clients are migrated; delete temporary normalization paths/logs.
  - Sweep for mixed casing and non‑English identifiers; fix with codemods where feasible.
  - Update docs/ADR/SRS accordingly.
- Phase 4 — Quality Gates
  - Enforce ESLint `@typescript-eslint/naming-convention` for `camelCase`/`PascalCase`.
  - Add contract tests to validate API shapes and enum values.
  - Run E2E/smoke tests focusing on inventory/auth flows and enum‑dependent behavior.
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


