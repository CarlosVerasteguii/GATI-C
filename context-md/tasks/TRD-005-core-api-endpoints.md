# TRD-005: Core API Endpoints - Detailed Implementation Guide

## Task Overview
- **Priority**: P1 (High)
- **Status**: Not Started
- **Complexity**: Very High
- **Estimated Hours**: 40-60 hours
- **Dependencies**: TRD-001 (Backend Foundation), TRD-002 (Database), TRD-003 (JWT Auth), TRD-004 (RBAC)
- **Related Frontend Files**: 
  - `app/(app)/configuracion/umbrales-inventario/page.tsx`
  - `contexts/app-context.tsx`

## Implementation Notes / Change Log

- **[2025-07-24 00:00] System:** INIT - Task documentation created following new TRD standards
- **[2025-07-24 00:00] System:** DOC - Timestamp corrected to current real date as per TRD documentation rules
- **[Next Entry]:** [Awaiting first implementation step]

## Technical Specifications

### Core API Endpoints Required

#### Thresholds Configuration API
```typescript
// Endpoint: GET /api/v1/thresholds
// Description: Retrieve all threshold configurations
// Auth: JWT Required, Admin/Editor roles
// Response Format:
{
  "success": true,
  "data": {
    "globalThreshold": 5,
    "categoryThresholds": {
      "Laptops": 3,
      "Monitores": 2,
      "Teclados": 1
    },
    "productThresholds": {
      "prod-123": 1,
      "prod-456": 2
    }
  }
}

// Endpoint: POST /api/v1/thresholds/global
// Description: Update global threshold
// Auth: JWT Required, Admin role only
// Request Body:
{
  "value": 7
}
// Response Format:
{
  "success": true,
  "data": {
    "globalThreshold": 7,
    "updatedBy": "user-123",
    "updatedAt": "2025-07-24T00:00:00Z"
  }
}

// Endpoint: POST /api/v1/thresholds/category/:categoryName
// Description: Update category-specific threshold
// Auth: JWT Required, Admin role only
// Request Body:
{
  "value": 4
}
// Response Format:
{
  "success": true,
  "data": {
    "category": "Laptops",
    "threshold": 4,
    "updatedBy": "user-123",
    "updatedAt": "2025-07-24T00:00:00Z"
  }
}

// Endpoint: DELETE /api/v1/thresholds/category/:categoryName
// Description: Remove category-specific threshold (falls back to global)
// Auth: JWT Required, Admin role only
// Response Format:
{
  "success": true,
  "data": {
    "category": "Laptops",
    "removed": true,
    "fallbackThreshold": 5
  }
}

// Endpoint: POST /api/v1/thresholds/product/:productId
// Description: Update product-specific threshold
// Auth: JWT Required, Admin role only
// Request Body:
{
  "value": 2
}

// Endpoint: DELETE /api/v1/thresholds/product/:productId
// Description: Remove product-specific threshold
```

### Error Response Standards
```typescript
// Validation Error (400)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El umbral debe ser un número positivo",
    "details": [
      {
        "field": "value",
        "message": "Expected number, received string"
      }
    ]
  }
}

// Permission Error (403)
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Solo los administradores pueden configurar umbrales de inventario"
  }
}

// Not Found Error (404)
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Categoría no encontrada"
  }
}
```

### Database Schema Requirements
```sql
-- Thresholds table for flexible threshold management
CREATE TABLE thresholds (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  type ENUM('global', 'category', 'product') NOT NULL,
  reference_id VARCHAR(255) NULL, -- category name or product id
  threshold_value INT NOT NULL,
  created_by VARCHAR(36) NOT NULL,
  updated_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id),
  
  -- Ensure only one global threshold
  UNIQUE KEY unique_global (type, reference_id),
  
  -- Ensure one threshold per category/product
  INDEX idx_type_reference (type, reference_id)
);
```

### Zod Validation Schemas
```typescript
import { z } from 'zod';

export const ThresholdValueSchema = z.object({
  value: z.number()
    .int('El umbral debe ser un número entero')
    .min(0, 'El umbral debe ser mayor o igual a 0')
    .max(9999, 'El umbral no puede exceder 9999')
});

export const CategoryParamSchema = z.object({
  categoryName: z.string()
    .min(1, 'El nombre de categoría es requerido')
    .max(100, 'El nombre de categoría es demasiado largo')
});

export const ProductParamSchema = z.object({
  productId: z.string()
    .uuid('ID de producto inválido')
});

export const ThresholdQuerySchema = z.object({
  includeInactive: z.boolean().optional().default(false),
  format: z.enum(['flat', 'hierarchical']).optional().default('hierarchical')
});
```

## Code Locations

### Frontend Integration Points
- **File**: `app/(app)/configuracion/umbrales-inventario/page.tsx`
  - **Lines 42-62**: Current validation logic (to be replaced with API calls)
  - **Lines 78-95**: Save handlers (to be updated with fetch calls)
  - **Lines 120-145**: State management (to be migrated to API-based state)

- **File**: `contexts/app-context.tsx`
  - **Lines 1061-1124**: localStorage simulation (to be replaced with API calls)

### Backend Implementation Structure
```
src/modules/inventory/
├── controllers/
│   └── thresholds.controller.ts
├── services/
│   └── thresholds.service.ts
├── schemas/
│   └── thresholds.schemas.ts
├── models/
│   └── threshold.model.ts
└── routes/
    └── thresholds.routes.ts
```

## Testing Requirements

### Unit Tests
- Threshold validation logic
- Permission checking middleware
- Database operations (CRUD)
- Error handling scenarios

### Integration Tests
- Complete API endpoint testing
- Authentication flow testing
- Role-based access control validation
- Frontend-backend data contract verification

### Test Cases
```typescript
describe('Thresholds API', () => {
  describe('GET /api/v1/thresholds', () => {
    it('should return all thresholds for authenticated admin');
    it('should return 403 for non-admin users');
    it('should return 401 for unauthenticated requests');
  });
  
  describe('POST /api/v1/thresholds/global', () => {
    it('should update global threshold with valid data');
    it('should reject negative values');
    it('should reject non-numeric values');
    it('should create audit log entry');
  });
  
  describe('POST /api/v1/thresholds/category/:categoryName', () => {
    it('should create new category threshold');
    it('should update existing category threshold');
    it('should validate category exists');
  });
});
```

## Dependencies and Impact Analysis

### Upstream Dependencies (Blocking)
- **TRD-001**: Backend foundation must be established
- **TRD-002**: Database schema and Prisma setup required
- **TRD-003**: JWT authentication system needed
- **TRD-004**: RBAC middleware must be implemented

### Downstream Impact (This blocks)
- **TRD-011**: Audit logging for threshold changes
- **TRD-018**: State management migration from localStorage
- **Frontend**: Configuration UI functionality
- **Future Dashboard**: Threshold monitoring and alerts

### Cross-Dependencies
- **TRD-007**: Zod validation schemas (parallel development)
- **TRD-015**: Inventory status management (data integration)

## Next Steps / TODO

### Immediate Actions (Phase 1)
1. **Create API contract documentation** (in progress)
2. **Set up Next.js mock endpoints** for frontend development
3. **Define TypeScript interfaces** shared between frontend/backend
4. **Create Zod validation schemas**

### Implementation Phase (Phase 2)
1. **Implement backend controllers** following the defined contract
2. **Set up database migrations** for thresholds table
3. **Create service layer** for business logic
4. **Implement middleware** for authentication and authorization

### Integration Phase (Phase 3)
1. **Replace frontend localStorage** with API calls
2. **Migrate context state management** to API-based approach
3. **Implement error handling** in frontend
4. **Add loading states** and optimistic UI updates

### Testing Phase (Phase 4)
1. **Write comprehensive unit tests**
2. **Implement integration tests**
3. **Perform frontend-backend contract validation**
4. **Load testing** for scalability validation

## Risk Assessment

### High Risk
- **API Contract Misalignment**: Frontend expectations vs backend implementation
  - **Mitigation**: Define contracts before implementation, use shared TypeScript types
  - **Detection**: Implement contract testing with tools like Pact

- **Permission System Gaps**: Frontend shows UI but backend rejects operations
  - **Mitigation**: Implement backend validation first, then align frontend
  - **Detection**: Comprehensive RBAC testing

### Medium Risk
- **State Management Complexity**: Migration from localStorage to API calls
  - **Mitigation**: Implement incremental migration, maintain backward compatibility during transition
  - **Detection**: User acceptance testing during migration

- **Performance Impact**: Database queries for threshold lookups
  - **Mitigation**: Implement caching strategy, database indexing
  - **Detection**: Performance monitoring and load testing

### Low Risk
- **Validation Consistency**: Different validation rules between frontend/backend
  - **Mitigation**: Share Zod schemas between frontend and backend
  - **Detection**: Automated validation testing

## Success Criteria

### Functional Requirements
- ✅ Admin can view all threshold configurations
- ✅ Admin can update global, category, and product thresholds
- ✅ Non-admin users cannot modify thresholds
- ✅ Invalid threshold values are rejected with clear error messages
- ✅ Threshold changes are logged for audit purposes

### Technical Requirements
- ✅ All endpoints follow standardized response format
- ✅ Proper authentication and authorization
- ✅ Comprehensive input validation
- ✅ Database operations are transactional
- ✅ Error handling provides user-friendly messages

### Performance Requirements
- ✅ Threshold retrieval responds within 1 second
- ✅ Threshold updates complete within 3 seconds
- ✅ System supports concurrent threshold modifications
- ✅ Database queries are optimized with proper indexing

## Notes and Considerations

### Design Decisions
- **Separate thresholds table**: Allows for flexible threshold management without modifying core product/category tables
- **Audit logging**: Every threshold change creates an audit entry for compliance
- **Fallback logic**: Product → Category → Global threshold hierarchy
- **Soft validation**: Frontend provides immediate feedback, backend provides authoritative validation

### Future Enhancements
- **Bulk threshold operations**: Update multiple thresholds in a single request
- **Threshold history**: Track historical changes with rollback capability
- **Threshold templates**: Predefined threshold configurations for new categories
- **Real-time notifications**: Alert users when thresholds are modified

### Security Considerations
- **Input sanitization**: All threshold values are validated and sanitized
- **SQL injection prevention**: Use parameterized queries through Prisma ORM
- **Rate limiting**: Prevent abuse of threshold modification endpoints
- **Audit trail**: Comprehensive logging for security and compliance

---

**Last Updated**: 2025-07-24 00:00  
**Next Review**: [To be scheduled after Phase 1 completion]  
**Assigned**: [To be assigned] 