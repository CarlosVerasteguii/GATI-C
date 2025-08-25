# 3. GATI-C: The Data Domain Encyclopedia

This document is the canonical source of truth for all data structures, types, interfaces, and naming conventions within the GATI-C application. All current and future code (frontend and backend) must strictly adhere to this encyclopedia to ensure consistency and maintainability.

## Core Principles

### Language
English is the official language for all code constructs. All types, interfaces, properties, and comments must use English terms.

### Casing Conventions
- **PascalCase** for types, interfaces, and classes (e.g., `User`, `Product`, `InventoryItem`)
- **camelCase** for properties, variables, and functions (e.g., `firstName`, `emailAddress`, `getUserById()`)
- **SCREAMING_SNAKE_CASE** for constants and enums (e.g., `USER_ROLE`, `ADMINISTRATOR`)

### Naming Guidelines
- **Clarity over Brevity**: Names should be descriptive and unambiguous
- **Consistency**: Use the same term for the same concept across the entire application
- **Avoid Abbreviations**: Use `serialNumber` instead of `serialNo`, `emailAddress` instead of `email`
- **Boolean Properties**: Use positive forms (e.g., `isActive`, `isDeleted`, not `inactive`, `notDeleted`)

## Domain Models & Properties

| Model (PascalCase) | Property (camelCase) | Data Type | Description | Old Name (for refactoring) |
|---|---|---|---|---|
| `User` | `id` | `string` | The unique identifier for the user. | `id` |
| `User` | `name` | `string` | The full name of the user. | `name` |
| `User` | `email` | `string` | The email address of the user. | `email` |
| `User` | `passwordHash` | `string` | The hashed password for authentication. | `password_hash` |
| `User` | `role` | `UserRole` | The role assigned to the user. | `role` |
| `User` | `isActive` | `boolean` | Whether the user account is active. | `isActive` |
| `User` | `lastLoginAt` | `DateTime \| null` | The timestamp of the user's last login. | `lastLoginAt` |
| `User` | `trustedIp` | `string \| null` | The IP address registered for 'Quick Access'. | `trusted_ip` |
| `User` | `createdAt` | `DateTime` | The timestamp when the user was created. | `createdAt` |
| `User` | `updatedAt` | `DateTime` | The timestamp when the user was last updated. | `updatedAt` |
| `User` | `auditLogs` | `AuditLog[]` | The audit logs associated with this user. | `auditLogs` |
| `User` | `pendingTasks` | `PendingTask[]` | The pending tasks created by this user. | `pendingTasks` |
| `Product` | `id` | `string` | The unique identifier for the product. | `id` |
| `Product` | `name` | `string` | The name of the product. | `name` |
| `Product` | `serialNumber` | `string \| null` | The unique serial number of the product. | `serial_number` |
| `Product` | `description` | `string \| null` | The description of the product. | `description` |
| `Product` | `cost` | `number \| null` | The cost of the product. | `cost` |
| `Product` | `purchaseDate` | `DateTime \| null` | The date when the product was purchased. | `purchase_date` |
| `Product` | `condition` | `string \| null` | The current condition of the product. | `condition` |
| `Product` | `brandId` | `string \| null` | The identifier of the product's brand. | `brandId` |
| `Product` | `categoryId` | `string \| null` | The identifier of the product's category. | `categoryId` |
| `Product` | `locationId` | `string \| null` | The identifier of the product's location. | `locationId` |
| `Product` | `createdAt` | `DateTime` | The timestamp when the product was created. | `createdAt` |
| `Product` | `updatedAt` | `DateTime` | The timestamp when the product was last updated. | `updatedAt` |
| `Product` | `documents` | `Document[]` | The documents associated with this product. | `documents` |
| `Product` | `brand` | `Brand \| null` | The brand associated with this product. | `brand` |
| `Product` | `category` | `Category \| null` | The category associated with this product. | `category` |
| `Product` | `location` | `Location \| null` | The location associated with this product. | `location` |
| `Brand` | `id` | `string` | The unique identifier for the brand. | `id` |
| `Brand` | `name` | `string` | The name of the brand. | `name` |
| `Brand` | `products` | `Product[]` | The products associated with this brand. | `products` |
| `Category` | `id` | `string` | The unique identifier for the category. | `id` |
| `Category` | `name` | `string` | The name of the category. | `name` |
| `Category` | `products` | `Product[]` | The products associated with this category. | `products` |
| `Location` | `id` | `string` | The unique identifier for the location. | `id` |
| `Location` | `name` | `string` | The name of the location. | `name` |
| `Location` | `products` | `Product[]` | The products associated with this location. | `products` |
| `Document` | `id` | `string` | The unique identifier for the document. | `id` |
| `Document` | `originalFilename` | `string` | The original filename of the document. | `original_filename` |
| `Document` | `storedUuidFilename` | `string` | The UUID-based stored filename. | `stored_uuid_filename` |
| `Document` | `productId` | `string` | The identifier of the associated product. | `productId` |
| `Document` | `deletedAt` | `DateTime \| null` | The timestamp when the document was deleted. | `deleted_at` |
| `Document` | `createdAt` | `DateTime` | The timestamp when the document was created. | `createdAt` |
| `Document` | `product` | `Product` | The product associated with this document. | `product` |
| `AuditLog` | `id` | `string` | The unique identifier for the audit log entry. | `id` |
| `AuditLog` | `userId` | `string` | The identifier of the user who performed the action. | `userId` |
| `AuditLog` | `action` | `string` | The action that was performed. | `action` |
| `AuditLog` | `targetType` | `string` | The type of the target entity. | `target_type` |
| `AuditLog` | `targetId` | `string` | The identifier of the target entity. | `target_id` |
| `AuditLog` | `changesJson` | `Json` | The JSON representation of the changes made. | `changes_json` |
| `AuditLog` | `createdAt` | `DateTime` | The timestamp when the audit log was created. | `createdAt` |
| `AuditLog` | `user` | `User` | The user associated with this audit log. | `user` |
| `PendingTask` | `id` | `string` | The unique identifier for the pending task. | `id` |
| `PendingTask` | `creatorId` | `string` | The identifier of the user who created the task. | `creatorId` |
| `PendingTask` | `type` | `string` | The type of the pending task. | `type` |
| `PendingTask` | `status` | `string` | The current status of the task. | `status` |
| `PendingTask` | `detailsJson` | `Json` | The JSON representation of task details. | `details_json` |
| `PendingTask` | `createdAt` | `DateTime` | The timestamp when the task was created. | `createdAt` |
| `PendingTask` | `updatedAt` | `DateTime` | The timestamp when the task was last updated. | `updatedAt` |
| `PendingTask` | `creator` | `User` | The user who created this task. | `creator` |
| `PendingTask` | `taskAudit` | `TaskAuditLog[]` | The audit logs for this task. | `taskAudit` |
| `TaskAuditLog` | `id` | `string` | The unique identifier for the task audit log. | `id` |
| `TaskAuditLog` | `taskId` | `string` | The identifier of the associated task. | `taskId` |
| `TaskAuditLog` | `userId` | `string` | The identifier of the user who performed the action. | `userId` |
| `TaskAuditLog` | `event` | `string` | The event that occurred. | `event` |
| `TaskAuditLog` | `details` | `string \| null` | Additional details about the event. | `details` |
| `TaskAuditLog` | `createdAt` | `DateTime` | The timestamp when the audit log was created. | `createdAt` |
| `TaskAuditLog` | `task` | `PendingTask` | The task associated with this audit log. | `task` |

## Frontend-Specific Types (Inventory Domain)

| Model (PascalCase) | Property (camelCase) | Data Type | Description | Old Name (for refactoring) |
|---|---|---|---|---|
| `InventoryItem` | `id` | `number` | The unique identifier for the inventory item. | `id` |
| `InventoryItem` | `name` | `string` | The name of the inventory item. | `nombre` |
| `InventoryItem` | `brand` | `string` | The brand of the inventory item. | `marca` |
| `InventoryItem` | `model` | `string` | The model of the inventory item. | `modelo` |
| `InventoryItem` | `serialNumber` | `string \| null` | The serial number of the inventory item. | `numeroSerie` |
| `InventoryItem` | `category` | `string` | The category of the inventory item. | `categoria` |
| `InventoryItem` | `description` | `string \| null` | The description of the inventory item. | `descripcion` |
| `InventoryItem` | `status` | `InventoryStatus` | The current status of the inventory item. | `estado` |
| `InventoryItem` | `quantity` | `number` | The quantity of the inventory item. | `cantidad` |
| `InventoryItem` | `entryDate` | `string` | The date when the item entered inventory. | `fechaIngreso` |
| `InventoryItem` | `location` | `string \| null` | The location of the inventory item. | `ubicacion` |
| `InventoryItem` | `supplier` | `string \| null` | The supplier of the inventory item. | `proveedor` |
| `InventoryItem` | `cost` | `number \| null` | The cost of the inventory item. | `costo` |
| `InventoryItem` | `acquisitionDate` | `string \| null` | The acquisition date of the item. | `fechaAdquisicion` |
| `InventoryItem` | `warrantyExpirationDate` | `string \| null` | The warranty expiration date. | `fechaVencimientoGarantia` |
| `InventoryItem` | `usefulLife` | `string \| null` | The useful life of the inventory item. | `vidaUtil` |
| `InventoryItem` | `history` | `HistoryEvent[]` | The history events for this item. | `historial` |
| `InventoryItem` | `attachedDocuments` | `{ name: string; url: string }[]` | The attached documents. | `documentosAdjuntos` |
| `InventoryItem` | `isSerialized` | `boolean \| null` | Whether the item is serialized. | `isSerialized` |
| `InventoryItem` | `contractId` | `string \| null` | The contract identifier. | `contratoId` |
| `InventoryItem` | `assignedTo` | `string \| null` | Who the item is assigned to. | `asignadoA` |
| `InventoryItem` | `assignmentDate` | `string \| null` | The assignment date. | `fechaAsignacion` |
| `InventoryItem` | `loanedTo` | `string \| null` | Who the item is loaned to. | `prestadoA` |
| `InventoryItem` | `loanDate` | `string \| null` | The loan date. | `fechaPrestamo` |
| `InventoryItem` | `returnDate` | `string \| null` | The return date. | `fechaDevolucion` |
| `InventoryItem` | `reactKey` | `string \| null` | React key for rendering. | `reactKey` |
| `InventoryItem` | `isVirtual` | `boolean \| null` | Whether the item is virtual. | `isVirtual` |
| `InventoryItem` | `originalId` | `number \| null` | The original identifier. | `originalId` |
| `User` | `id` | `number` | The unique identifier for the user. | `id` |
| `User` | `name` | `string` | The name of the user. | `nombre` |
| `User` | `email` | `string` | The email address of the user. | `email` |
| `User` | `password` | `string \| null` | The password (for frontend use). | `password` |
| `User` | `role` | `"Administrator" \| "Editor" \| "Reader"` | The role of the user. | `rol` |
| `User` | `department` | `string \| null` | The department of the user. | `departamento` |
| `GroupedProduct` | `isParent` | `true` | Whether this is a parent product. | `isParent` |
| `GroupedProduct` | `product` | `object` | The product information. | `product` |
| `GroupedProduct` | `summary` | `object` | The summary information. | `summary` |
| `GroupedProduct` | `children` | `InventoryItem[]` | The child inventory items. | `children` |
| `GroupedProduct` | `highlightedChildId` | `string \| null` | The highlighted child identifier. | `highlightedChildId` |
| `HistoryEvent` | `date` | `string` | The date of the history event. | `fecha` |
| `HistoryEvent` | `user` | `string` | The user who performed the action. | `usuario` |
| `HistoryEvent` | `action` | `string` | The action that was performed. | `accion` |
| `HistoryEvent` | `details` | `string` | The details of the action. | `detalles` |

## Status Types & Enums

| Enum/Model (PascalCase) | Value | Description |
|---|---|---|
| `UserRole` | `ADMINISTRATOR` | Full administrative access. |
| `UserRole` | `EDITOR` | Can edit and manage inventory. |
| `UserRole` | `READER` | Read-only access. |
| `InventoryStatus` | `"Available"` | Item is available for use. |
| `InventoryStatus` | `"Assigned"` | Item is assigned to someone. |
| `InventoryStatus` | `"Loaned"` | Item is loaned out. |
| `InventoryStatus` | `"Retired"` | Item is retired from service. |
| `InventoryStatus` | `"PendingRetirement"` | Item is pending retirement. |
| `LoanStatus` | `"Active"` | Loan is currently active. |
| `LoanStatus` | `"Returned"` | Item has been returned. |
| `LoanStatus` | `"Overdue"` | Loan is overdue. |
| `AssignmentStatus` | `"Active"` | Assignment is currently active. |
| `AssignmentStatus` | `"Returned"` | Item has been returned. |
| `TaskStatus` | `"Pending"` | Task is pending approval. |
| `TaskStatus` | `"Approved"` | Task has been approved. |
| `TaskStatus` | `"Rejected"` | Task has been rejected. |
| `TaskStatus` | `"QuickLoad"` | Quick load operation. |
| `TaskStatus` | `"QuickRetirement"` | Quick retirement operation. |
| `TaskStatus` | `"BulkEdit"` | Bulk edit operation. |
| `TaskStatus` | `"BulkAssignment"` | Bulk assignment operation. |
| `TaskStatus` | `"BulkLoan"` | Bulk loan operation. |
| `TaskStatus` | `"BulkRetirement"` | Bulk retirement operation. |

## Filter & UI Types

| Model (PascalCase) | Property (camelCase) | Data Type | Description | Old Name (for refactoring) |
|---|---|---|---|---|
| `AdvancedFilterState` | `startDate` | `Date \| null` | The start date for filtering. | `fechaInicio` |
| `AdvancedFilterState` | `endDate` | `Date \| null` | The end date for filtering. | `fechaFin` |
| `AdvancedFilterState` | `supplier` | `string` | The supplier filter. | `proveedor` |
| `AdvancedFilterState` | `contractId` | `string` | The contract identifier filter. | `contratoId` |
| `AdvancedFilterState` | `minCost` | `number \| null` | The minimum cost filter. | `costoMin` |
| `AdvancedFilterState` | `maxCost` | `number \| null` | The maximum cost filter. | `costoMax` |
| `ColumnDefinition` | `id` | `string` | The unique identifier for the column. | `id` |
| `ColumnDefinition` | `label` | `string` | The display label for the column. | `label` |
| `ColumnDefinition` | `defaultVisible` | `boolean` | Whether the column is visible by default. | `defaultVisible` |
| `ColumnDefinition` | `sortable` | `boolean` | Whether the column is sortable. | `sortable` |
| `ColumnDefinition` | `type` | `'string' \| 'number' \| 'date' \| 'status' \| null` | The data type of the column. | `type` |
| `ColumnDefinition` | `fixed` | `"start" \| "end" \| null` | The fixed position of the column. | `fixed` |
| `ColumnDefinition` | `visible` | `boolean \| null` | Whether the column is currently visible. | `visible` |

## Implementation Guidelines

### Database Schema (Prisma)
- All database models and fields must match the property names defined in this encyclopedia
- Use snake_case for database column names (e.g., `serial_number`, `purchase_date`)
- Foreign key relationships must follow the defined naming patterns

### Backend Types (TypeScript)
- All backend types must use the exact property names defined here
- Use Prisma-generated types where possible for consistency
- Implement custom types for complex business logic that extends Prisma types

### Frontend Types (TypeScript)
- All frontend types must use the exact property names defined here
- Frontend types should mirror backend types for consistency
- Use the old name column as a guide for refactoring existing code

### API Contracts
- All API endpoints must return data using the property names defined here
- Request/response bodies must follow the established naming conventions
- Error messages and validation should reference the canonical property names

## Refactoring Migration Guide

### Phase 1: Database & Backend
1. Update Prisma schema to use English field names
2. Create database migration scripts
3. Update all backend services and controllers
4. Update API response serialization

### Phase 2: Frontend Types
1. Update `types/inventory.ts` and other type files
2. Update all React components that use the old property names
3. Update API client and service functions
4. Update form handling and validation logic

### Phase 3: UI Components & Pages
1. Update all UI components to use new property names
2. Update page components and layouts
3. Update any hardcoded strings or labels
4. Test all user interactions and data flows

### Phase 4: Testing & Validation
1. Update all test files and mock data
2. Validate API contracts and data flows
3. Perform end-to-end testing
4. Update documentation and comments

## Validation Checklist

- [ ] All TypeScript compilation passes without errors
- [ ] All database queries use the new property names
- [ ] All API endpoints return data with correct property names
- [ ] All frontend components render correctly with new data structure
- [ ] All forms submit data with correct property names
- [ ] All tests pass with updated mock data
- [ ] All documentation reflects the new naming conventions