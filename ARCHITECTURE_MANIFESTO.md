# GATI-C Architecture Manifesto v1.0

This document is the single source of truth for all code style and naming conventions in the GATI-C project. All code, new and refactored, MUST adhere strictly to these rules. All AI-driven refactoring will be audited against this manifesto.

## I. Casing Conventions

The casing of an identifier is determined by its semantic role in the codebase.

### 1. `PascalCase`
Used exclusively for defining "shapes" or "templates".
- **TypeScript Types & Interfaces:** `interface InventoryItem { ... }`, `type UserRole = ...`
- **Classes:** `class ApiService { ... }`
- **React Components:** `function ProductTable() { ... }`, `const UserAvatar = () => ...`

### 2. `camelCase`
Used for all instances of data, logic, and files. This is our default standard.
- **Variables & Constants:** `const currentUser = ...`, `let itemCount = 0;`
- **Object Properties:** `product.serialNumber`, `user.firstName`
- **Functions & Methods:** `function getUserById() { ... }`
- **String Literal Values (Enums):** `status: 'pendingRetirement'`, `action: 'productCreation'`
- **File Names (for non-component files):** `useAuthStore.ts`, `apiClient.ts`

### 3. `kebab-case`
Used exclusively for routing and styling.
- **URL Routes:** `/pending-tasks`, `/user-profile`
- **Page/Layout File Names (Next.js App Router):** `(app)/pending-tasks/page.tsx`
- **CSS Class Names (if not using Tailwind utility classes):** `.main-title { ... }`

### 4. `SCREAMING_SNAKE_CASE`
Used exclusively for globally available, immutable constants.
- **Environment Variables:** `process.env.DATABASE_URL`
- **Global Constants:** `const MAX_LOGIN_ATTEMPTS = 5;`
