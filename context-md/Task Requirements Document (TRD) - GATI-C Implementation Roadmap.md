Task Requirements Document (TRD) - GATI-C Implementation Roadmap
Version: 1.0
Date: [Current Date]
Abbreviation: TRD (Reference with @TRD)

# TRD DOCUMENTATION AND TRACKING RULES

## CRITICAL RULE: AI Task Analysis and Documentation Standards

**WHENEVER THIS DOCUMENT IS REFERENCED WITH @TRD, THE AI MUST:**

1. **AUTOMATICALLY APPLY TASK TRACKING PROTOCOL:**
   - Identify which TRD task(s) are being worked on or referenced
   - Check the current status and implementation notes for that task
   - Update the task status if work is being performed
   - Add implementation notes with timestamp and detailed description
   - Maintain traceability between code changes and TRD tasks

2. **MANDATORY TASK DOCUMENTATION FORMAT:**
   ```markdown
   #### Implementation Notes / Change Log
   - **[YYYY-MM-DD HH:MM] [Author]:** [Change Type] - [Detailed Description]
     - Location: [File paths and line numbers]
     - Technical Details: [Implementation specifics]
     - Dependencies: [What this affects or depends on]
     - Next Steps: [What should be done next]
     - Status: [Not Started → In Progress → Completed → Blocked]
   ```

3. **DATE AND TIME ACCURACY:**
   - All timestamps in implementation notes and changelogs MUST use the current real date and time (YYYY-MM-DD HH:MM) in the user's timezone.
   - The AI MUST always verify and use the correct date by querying @Web or the system clock before logging any change.
   - If the date is incorrect, the AI must correct it and note the correction in the changelog.

4. **CHANGE TYPE CLASSIFICATIONS:**
   - **INIT**: Initial task setup or planning
   - **IMPL**: Implementation or code changes
   - **FIX**: Bug fixes or corrections
   - **REF**: Refactoring or optimization
   - **DOC**: Documentation updates
   - **TEST**: Testing implementation
   - **DEP**: Dependency or requirement changes
   - **BLOCK**: Task blocked or waiting for dependency

5. **TASK STATUS TRACKING:**
   - Always update task status when making changes
   - Reference specific line numbers and file paths
   - Cross-reference related tasks that are impacted
   - Flag dependencies that need attention

## MODULAR TASK DOCUMENTATION STRATEGY

### Primary Structure:
- **TRD (this file)**: Master overview, task summaries, priorities, dependencies
- **Detailed Task Files**: Individual documentation in `context-md/tasks/` directory

### Task File Naming Convention:
```
context-md/tasks/
├── TRD-001-backend-foundation.md
├── TRD-002-database-implementation.md
├── TRD-003-jwt-authentication.md
├── TRD-005-core-api-endpoints.md
├── TRD-007-zod-validation.md
└── ...
```

### Master TRD Task Format (Updated):
```markdown
### TASK: TRD-XXX - [Task Name]
**Priority**: PX | **Status**: [Status] | **Complexity**: [Level]
**Description**: [Brief description]
**Dependencies**: [References]
**Detailed Documentation**: → See `context-md/tasks/TRD-XXX-[name].md`

#### Quick Status / Recent Changes:
- **[Latest Date]:** [Latest significant change or status update]
```

### Detailed Task File Format:
```markdown
# TRD-XXX: [Task Name] - Detailed Implementation Guide

## Task Overview
- **Priority**: 
- **Status**: 
- **Complexity**: 
- **Estimated Hours**: 
- **Dependencies**: 

## Implementation Notes / Change Log
[Ultra-detailed chronological log of all changes]

## Technical Specifications
[Detailed technical requirements, code examples, architecture decisions]

## Code Locations
[Specific file paths, line numbers, function names]

## Testing Requirements
[Test cases, validation criteria]

## Dependencies and Impact Analysis
[What this affects, what affects this]

## Next Steps / TODO
[Specific actionable items]

## Risk Assessment
[Potential issues, mitigation strategies]
```

## AI WORKFLOW WHEN @TRD IS CALLED:

1. **ANALYZE CONTEXT:** Determine which task(s) are being worked on
2. **CHECK STATUS:** Review current task status and recent changes
3. **PERFORM WORK:** Execute the requested changes/analysis
4. **UPDATE DOCUMENTATION:** 
   - Add implementation notes to TRD master file
   - Create/update detailed task file if needed
   - Update status and cross-references
5. **VALIDATE DEPENDENCIES:** Check if other tasks are impacted
6. **PROVIDE SUMMARY:** Report what was done and what's next

## TASK WORKFLOW PHASES:

### Phase 1: Task Initiation
- Create detailed task file in `context-md/tasks/`
- Define technical specifications and requirements
- Identify dependencies and risks
- Estimate effort and timeline

### Phase 2: Implementation
- Log all changes with timestamps and details
- Track file locations and code changes
- Update status regularly
- Cross-reference related tasks

### Phase 3: Completion
- Final status update
- Implementation summary
- Testing validation
- Impact assessment on other tasks

### Phase 4: Maintenance
- Monitor for issues or required updates
- Track technical debt
- Plan future enhancements

# OVERVIEW AND PURPOSE

This document serves as the comprehensive implementation roadmap for GATI-C, identifying critical gaps, inconsistencies, and missing components between current frontend implementation and the specifications defined in @PRD and @SRS. It acts as the central reference for all pending tasks, technical debt, and alignment requirements.

## Document Structure
- **Priority Levels**: P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
- **Status**: Not Started, In Progress, Completed, Blocked
- **Dependencies**: Cross-references to @PRD, @SRS, and @Visual Style Guide
- **Implementation Complexity**: Low, Medium, High, Very High

---

# SECTION 1: BACKEND INFRASTRUCTURE (CRITICAL PRIORITY)

## 1.1 Core Backend Architecture

### TASK: TRD-001 - Backend Foundation Setup
**Priority**: P0 | **Status**: Not Started | **Complexity**: Very High
**Description**: Implement the complete backend infrastructure as specified in @SRS Section 1.2
**Dependencies**: @SRS 1.2, @SRS 2.3, @SRS 5
**Detailed Documentation**: → See `context-md/tasks/TRD-001-backend-foundation.md`

#### Implementation Notes / Change Log
- **[2025-07-25 15:45] System:** INIT - Task created, awaiting implementation initiation

#### Sub-tasks:
- **TRD-001a**: Node.js/Express.js application setup with TypeScript 5+
- **TRD-001b**: Modular monolith architecture implementation
- **TRD-001c**: Internal Event Bus (Mediator pattern) for module communication
- **TRD-001d**: Core modules implementation:
  - Inventory Module
  - Identity & Access Management (IAM) Module
  - Task Management Module
  - Document Management Module
  - Auditing Module

**Gap Analysis**: Frontend currently operates with localStorage simulation. Complete backend missing.
**Implementation Notes**: 
- Must follow @SRS 1.3 - no direct module imports allowed
- Use Node.js EventEmitter for internal Event Bus implementation
- Implement middleware pipeline with Express.js for request/response lifecycle
- Apply enterprise-grade error handling middleware following Context7 patterns
- Structure directories by domain modules (inventory/, auth/, tasks/, documents/, audit/)
- Initialize with `express.json()`, `express.urlencoded()` for parsing
- Configure Helmet.js for security headers (CSRF, XSS, content-type sniffing)

**Reference Implementation Pattern**:
```typescript
// Module communication via EventEmitter
const eventBus = new EventEmitter();
eventBus.on('inventory.updated', (data) => auditModule.log(data));
eventBus.on('user.assigned', (data) => taskModule.createTask(data));
```

### TASK: TRD-002 - Database Design and Implementation
**Priority**: P0 | **Status**: Not Started | **Complexity**: High
**Description**: Implement MySQL 8.0+ database with Prisma ORM as per @SRS Section 8
**Dependencies**: @SRS 8.1, @SRS 8.2, @SRS 8.3, @SRS 8.4

#### Database Schema Requirements:
```sql
-- Core Tables (from @SRS 8.1)
User (id, name, email, password_hash, role, trusted_ip)
Product (id, name, serial_number, description, cost, purchase_date, condition, ...)
Brand (id, name)
Category (id, name)
Location (id, name)
Document (id, original_filename, stored_uuid_filename, product_id, deleted_at)
AuditLog (id, user_id, action, target_type, target_id, changes_json)
PendingTask (id, creator_id, type, status, details_json)
TaskAuditLog (id, task_id, user_id, event, details)
```

**Critical Implementation Details**:
- Soft delete mechanism for Documents (@SRS 8.3)
- Stock logic for non-serialized items (@SRS 8.4)
- Cascading delete restrictions (@SRS 8.3)

**Prisma Migration Strategy**:
```bash
# Initialize Prisma schema
npx prisma migrate dev --name init

# Generate baseline migration from empty schema
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql

# Mark as applied for existing database
npx prisma migrate resolve --applied 0_init
```

**Database Performance Optimizations**:
- Index on `Product(serial_number)` for unique lookups
- Index on `AuditLog(user_id, timestamp)` for audit queries  
- Index on `PendingTask(status, created_at)` for task filtering
- Index on `Document(product_id, deleted_at)` for soft delete queries
- Composite index on `Product(category_id, status)` for inventory filtering

**Prisma Client Configuration**:
```typescript
// Enable query logging for development
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
  ],
})

// Log query execution time
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Duration: ' + e.duration + 'ms')
})
```

---

# SECTION 2: AUTHENTICATION & AUTHORIZATION (CRITICAL PRIORITY)

## 2.1 JWT Authentication System

### TASK: TRD-003 - JWT Authentication Implementation
**Priority**: P0 | **Status**: Not Started | **Complexity**: High
**Description**: Implement JWT-based authentication with httpOnly cookies
**Dependencies**: @SRS 6.1, @SRS 6.2, @PRD 2.1

#### Required Endpoints:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

**Current Gap**: Frontend simulates authentication in app-context.tsx
**Location**: `contexts/app-context.tsx` lines 1061-1124

**JWT Implementation Strategy**:
```typescript
// JWT middleware for protected routes
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'UNAUTHORIZED', message: 'Access token required' }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
};
```

**Security Configuration**:
- JWT Secret: 256-bit minimum, stored in environment variables
- Token Expiration: 24 hours for regular sessions, 7 days for "remember me"
- Refresh Token: Implement rotation for enhanced security
- Cookie Settings: `httpOnly: true, secure: true, sameSite: 'strict'`
- IP Tracking: Log login attempts and suspicious activity

### TASK: TRD-004 - Role-Based Access Control (RBAC)
**Priority**: P0 | **Status**: Not Started | **Complexity**: High
**Description**: Implement backend RBAC middleware matching @PRD Matrix of Permissions
**Dependencies**: @PRD 2.1, @SRS 6.4

#### Permission Matrix Implementation:
| Module/Action | Admin | Editor | Reader | Backend Validation Required |
|---------------|-------|--------|--------|----------------------------|
| Create Products | ✅ | ✅ | ❌ | JWT + Role check |
| Edit Products | ✅ | ✅ | ❌ | JWT + Role check |
| Delete Products | ✅ | ✅ | ✅ | JWT + Role check |
| Manage Users | ✅ | ❌ | ❌ | Admin-only middleware |
| View Trash | ✅ | ❌ | ❌ | Admin-only middleware |

**Current Gap**: Frontend shows/hides UI elements but no backend validation
**Locations**: 
- `components/document-manager.tsx` lines 35-92
- `app/(app)/papelera-documentos/page.tsx` lines 40-85

---

# SECTION 3: API DESIGN & DATA FLOW (HIGH PRIORITY)

## 3.1 RESTful API Implementation

### TASK: TRD-005 - Core API Endpoints
**Priority**: P1 | **Status**: Not Started | **Complexity**: Very High
**Description**: Implement all RESTful endpoints following @SRS Section 7
**Dependencies**: @SRS 7.1, @SRS 7.2, @SRS 7.3, @SRS 7.4

#### Primary Endpoints Required:
```
GET /api/v1/view/inventory?page=1&limit=25&search=...&category=...
GET /api/v1/products
GET /api/v1/products/:id
POST /api/v1/products
PUT /api/v1/products/:id
DELETE /api/v1/products/:id
GET /api/v1/tasks/pending
POST /api/v1/tasks/pending
PUT /api/v1/tasks/pending/:id
GET /api/v1/audit/logs
```

**Response Structure Standardization**:
```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "...", "message": "..." } }
```

### TASK: TRD-006 - Pagination, Search & Filtering Backend
**Priority**: P1 | **Status**: Not Started | **Complexity**: Medium
**Description**: Implement server-side pagination, search, and filtering
**Dependencies**: @SRS 7.2, Current frontend implementation

#### Frontend-Backend Alignment Required:
**Frontend Locations**:
- `app/(app)/inventario/page.tsx` lines 202-234 (currentPage, searchTerm, filters)
- `app/(app)/asignados/page.tsx` lines 97-130 (filteredAssignments)
- `app/(app)/historial/page.tsx` lines 81-141 (search and filter logic)

**Backend Implementation Needs**:
- Query parameter validation (Zod schemas)
- Database indexing for search fields
- Consistent filter field names across all endpoints

---

# SECTION 4: VALIDATION & ERROR HANDLING (HIGH PRIORITY)

## 4.1 Input Validation System

### TASK: TRD-007 - Zod Schema Validation
**Priority**: P1 | **Status**: Not Started | **Complexity**: Medium
**Description**: Implement comprehensive Zod validation schemas for all endpoints
**Dependencies**: @SRS 4.1, @SRS 5 (Backend tech stack)

#### Validation Requirements from Frontend Analysis:
**Location**: `app/(app)/configuracion/umbrales-inventario/page.tsx` lines 42-62
```typescript
// Current frontend validation
const value = Number(productInputs[id]);
if (isNaN(value) || value <= 0) {
    setProductError(e => ({ ...e, [id]: 'El umbral debe ser un número positivo.' }));
    return;
}
```

**Backend Needs**:
- Product threshold validation
- Unique name/serial number validation
- File upload validation (type, size)
- Required field validation

**Comprehensive Zod Schema Implementation**:
```typescript
// Product validation schema
const ProductCreateSchema = z.object({
  name: z.string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no puede exceder 255 caracteres"),
  serial_number: z.string()
    .optional()
    .refine(async (val) => {
      if (!val) return true;
      const existing = await prisma.product.findFirst({ 
        where: { serial_number: val } 
      });
      return !existing;
    }, "El número de serie ya existe"),
  category_id: z.number().int().positive(),
  cost: z.number().positive().optional(),
  threshold: z.number()
    .int()
    .min(0, "El umbral debe ser un número positivo")
    .max(9999, "El umbral no puede exceder 9999"),
});

// File upload validation
const FileUploadSchema = z.object({
  file: z.custom<File>()
    .refine((file) => file.size <= 100 * 1024 * 1024, "El archivo no puede exceder 100MB")
    .refine((file) => 
      ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(file.type), 
      "Solo se permiten archivos PDF y Word (.docx)"
    ),
});

// Query parameter validation
const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['Disponible', 'Asignado', 'Prestado', 'Pendiente de Retiro', 'Retirado']).optional(),
});
```

**Validation Middleware Implementation**:
```typescript
const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.safeParseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Datos de entrada inválidos',
            details: result.error.errors,
          },
        });
      }

      req.validatedData = result.data;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Error en validación' },
      });
    }
  };
};
```

### TASK: TRD-008 - Error Message Standardization
**Priority**: P1 | **Status**: Not Started | **Complexity**: Low
**Description**: Standardize error messages between frontend expectations and backend responses
**Dependencies**: @PRD 3 (Error handling requirements)

#### Error Messages from @PRD:
- "Error al procesar el archivo. Por favor, intente con otro archivo."
- "Tipo de archivo no permitido. Solo se aceptan PDF y Word."
- "El archivo excede el tamaño máximo permitido de 100MB."
- "Ocurrió un error en el servidor al subir el archivo."

**Implementation Location**: Backend error middleware and frontend error handling

---

# SECTION 5: DOCUMENT MANAGEMENT SYSTEM (HIGH PRIORITY)

## 5.1 File Upload & Storage

### TASK: TRD-009 - Document Upload System
**Priority**: P1 | **Status**: Not Started | **Complexity**: High
**Description**: Implement complete document management system
**Dependencies**: @PRD 3 (Document management requirements), @SRS 8.1 (Document table)

#### Requirements from @PRD:
- PDF and Word (.docx) file support
- 100MB maximum file size
- Multiple documents per product
- Original filename preservation
- Server filesystem organization

**Current Frontend Implementation**: 
- `components/document-manager.tsx` (UI components ready)
- `components/document-upload.tsx` (upload interface ready)
- `components/document-viewer.tsx` (viewer interface ready)

**Multer Configuration for Enterprise File Handling**:
```typescript
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productId = req.params.productId;
    const uploadPath = path.join(process.env.UPLOAD_DIR!, 'products', productId);
    
    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    const storedFilename = `${uniqueId}${extension}`;
    
    // Store mapping in request for database save
    req.fileMapping = {
      originalFilename: file.originalname,
      storedFilename,
      uniqueId,
    };
    
    cb(null, storedFilename);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan PDF y Word.'));
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 5, // Maximum 5 files per upload
  },
}).array('documents', 5);
```

**Document Storage Structure**:
```
uploads/
├── products/
│   ├── product-123/
│   │   ├── uuid-1.pdf
│   │   ├── uuid-2.docx
│   └── product-456/
│       └── uuid-3.pdf
└── trash/
    ├── 2024-01-15/
    │   ├── uuid-deleted-1.pdf
    └── 2024-01-20/
        └── uuid-deleted-2.docx
```

**Document API Endpoints Implementation**:
```typescript
// Upload documents
app.post('/api/v1/products/:productId/documents', 
  authenticateJWT,
  authorizeRoles(['Admin', 'Editor']),
  uploadMiddleware,
  async (req, res) => {
    try {
      const { productId } = req.params;
      const files = req.files as Express.Multer.File[];
      
      const documentRecords = await Promise.all(
        files.map(file => 
          prisma.document.create({
            data: {
              original_filename: file.originalname,
              stored_uuid_filename: req.fileMapping.storedFilename,
              product_id: parseInt(productId),
              file_size: file.size,
              mime_type: file.mimetype,
              uploaded_by: req.user.id,
            },
          })
        )
      );
      
      res.json({ success: true, data: documentRecords });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: { code: 'UPLOAD_ERROR', message: 'Error al subir archivo' }
      });
    }
  }
);

// Get document (with proper Content-Type headers)
app.get('/api/v1/documents/:documentId',
  authenticateJWT,
  async (req, res) => {
    try {
      const document = await prisma.document.findFirst({
        where: { 
          id: parseInt(req.params.documentId),
          deleted_at: null 
        },
        include: { product: true }
      });
      
      if (!document) {
        return res.status(404).json({ 
          success: false, 
          error: { code: 'NOT_FOUND', message: 'Documento no encontrado' }
        });
      }
      
      const filePath = path.join(
        process.env.UPLOAD_DIR!, 
        'products', 
        document.product_id.toString(), 
        document.stored_uuid_filename
      );
      
      res.setHeader('Content-Type', document.mime_type);
      res.setHeader('Content-Disposition', `inline; filename="${document.original_filename}"`);
      res.sendFile(filePath);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: { code: 'RETRIEVAL_ERROR', message: 'Error al obtener archivo' }
      });
    }
  }
);
```

### TASK: TRD-010 - Document Soft Delete & Trash System
**Priority**: P1 | **Status**: Not Started | **Complexity**: Medium
**Description**: Implement logical deletion and 30-day retention policy
**Dependencies**: @PRD 3 (30-day retention), @SRS 8.3 (Soft deletes)

#### Implementation Requirements:
- `deleted_at` column in Document table
- Admin-only trash visibility
- Automatic permanent deletion after 30 days
- Audit trail for all document operations

**Frontend Ready**: `app/(app)/papelera-documentos/page.tsx` (UI implemented)

---

# SECTION 6: AUDIT SYSTEM & LOGGING (HIGH PRIORITY)

## 6.1 Comprehensive Audit Trail

### TASK: TRD-011 - Audit Logging System
**Priority**: P1 | **Status**: Not Started | **Complexity**: High
**Description**: Implement complete audit trail as required by @PRD transparency requirements
**Dependencies**: @PRD 3 (Trazabilidad absoluta), @SRS 8.1 (AuditLog table)

#### Audit Requirements from @PRD:
- Log every action on assets (creation, editing, assignment, loan, status change, retirement)
- Include before/after values for all changes
- Track user, timestamp, and action details
- Immutable log entries

**Database Schema**:
```sql
AuditLog (
    id, 
    user_id, 
    action, 
    target_type, 
    target_id, 
    changes_json,
    timestamp,
    ip_address
)
```

**Enterprise Audit Implementation**:
```typescript
interface AuditLogEntry {
  user_id: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ASSIGN' | 'LOAN' | 'RETURN' | 'RETIRE';
  target_type: 'Product' | 'User' | 'Document' | 'PendingTask';
  target_id: number;
  changes_json: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    metadata?: Record<string, any>;
  };
  ip_address: string;
  user_agent?: string;
}

class AuditService {
  static async logAction(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          ...entry,
          timestamp: new Date(),
          changes_json: JSON.stringify(entry.changes_json),
        },
      });
      
      // Emit event for real-time notifications
      eventBus.emit('audit.logged', entry);
    } catch (error) {
      // Critical: Audit failures should be logged to external system
      console.error('CRITICAL: Audit log failed:', error);
      // TODO: Send to external logging service (e.g., Sentry, LogRocket)
    }
  }

  static async getAuditTrail(
    targetType: string, 
    targetId: number
  ): Promise<AuditLogEntry[]> {
    return await prisma.auditLog.findMany({
      where: { target_type: targetType, target_id: targetId },
      orderBy: { timestamp: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      },
    });
  }
}

// Middleware for automatic audit logging
const auditMiddleware = (action: string, targetType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const targetId = req.params.id || req.params.productId || req.body.id;
        
        if (targetId) {
          AuditService.logAction({
            user_id: req.user.id,
            action: action as any,
            target_type: targetType as any,
            target_id: parseInt(targetId),
            changes_json: {
              before: req.originalData, // Set by service layer
              after: req.updatedData,   // Set by service layer
              metadata: {
                endpoint: req.originalUrl,
                method: req.method,
              },
            },
            ip_address: req.ip,
            user_agent: req.get('User-Agent'),
          });
        }
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};
```

**Audit Query Implementation for Admin Dashboard**:
```typescript
// GET /api/v1/audit/logs (Admin only)
app.get('/api/v1/audit/logs',
  authenticateJWT,
  authorizeRoles(['Admin']),
  validateRequest(z.object({
    query: z.object({
      page: z.coerce.number().min(1).default(1),
      limit: z.coerce.number().min(1).max(100).default(25),
      user_id: z.coerce.number().optional(),
      action: z.string().optional(),
      target_type: z.string().optional(),
      start_date: z.string().datetime().optional(),
      end_date: z.string().datetime().optional(),
    }),
  })),
  async (req, res) => {
    const { page, limit, user_id, action, target_type, start_date, end_date } = req.query;
    
    const where: any = {};
    if (user_id) where.user_id = user_id;
    if (action) where.action = action;
    if (target_type) where.target_type = target_type;
    if (start_date || end_date) {
      where.timestamp = {};
      if (start_date) where.timestamp.gte = new Date(start_date);
      if (end_date) where.timestamp.lte = new Date(end_date);
    }
    
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: { select: { name: true, email: true } }
        },
      }),
      prisma.auditLog.count({ where }),
    ]);
    
    res.json({
      success: true,
      data: {
        logs: logs.map(log => ({
          ...log,
          changes_json: JSON.parse(log.changes_json),
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  }
);
```

### TASK: TRD-012 - Audit Log Access & Filtering
**Priority**: P1 | **Status**: Not Started | **Complexity**: Medium
**Description**: Implement admin-only audit log endpoints with filtering
**Dependencies**: @PRD 2.1 (Admin permissions), TRD-011

#### Frontend Preparation Needed:
- Audit log viewing page (admin-only)
- Filtering by user, action type, date range
- Pagination for large audit datasets

---

# SECTION 7: TASK MANAGEMENT SYSTEM (HIGH PRIORITY)

## 7.1 Pending Tasks Implementation

### TASK: TRD-013 - Pending Tasks Backend
**Priority**: P1 | **Status**: Not Started | **Complexity**: High
**Description**: Implement "Tareas Pendientes" system for rapid load/retirement
**Dependencies**: @PRD 3 (Módulo de Tareas Pendientes), @SRS 8.1 (PendingTask table)

#### Task Types from @PRD:
- **Carga Rápida**: Quick asset entry with minimal data
- **Retiro Rápido**: Quick asset retirement marking
- **Processing**: Complete form filling for pending tasks

**Frontend Implementation Status**: 
- `app/(app)/tareas-pendientes/page.tsx` (UI ready, needs backend integration)

### TASK: TRD-014 - Task Audit Trail
**Priority**: P1 | **Status**: Not Started | **Complexity**: Medium
**Description**: Implement detailed logging for task lifecycle
**Dependencies**: @PRD 3 (Task history), @SRS 8.1 (TaskAuditLog table)

---

# SECTION 8: INVENTORY MANAGEMENT (MEDIUM PRIORITY)

## 8.1 Stock Logic Implementation

### TASK: TRD-015 - Non-Serialized Item Logic
**Priority**: P2 | **Status**: Not Started | **Complexity**: Medium
**Description**: Implement "división de registros" strategy for stock management
**Dependencies**: @SRS 8.4, Current frontend inventory logic

**Implementation Details**: 
- Loan/assignment of 1 unit from lot of 10 creates new row with quantity 1
- Original row quantity reduced to 9
- New row gets new status (Prestado/Asignado)

**Frontend Location**: `app/(app)/inventario/page.tsx` (inventory table implementation)

**Stock Division Logic Implementation**:
```typescript
interface StockDivisionRequest {
  originalProductId: number;
  quantityToSeparate: number;
  newStatus: 'Asignado' | 'Prestado';
  assignedTo?: number; // user_id for assignment
  loanDetails?: {
    borrower: string;
    expectedReturn: Date;
    notes?: string;
  };
}

class InventoryService {
  static async divideStock(request: StockDivisionRequest): Promise<{
    originalProduct: Product;
    newProduct: Product;
    auditEntries: AuditLogEntry[];
  }> {
    return await prisma.$transaction(async (tx) => {
      // 1. Get original product and validate
      const originalProduct = await tx.product.findUnique({
        where: { id: request.originalProductId },
      });
      
      if (!originalProduct) {
        throw new Error('Producto no encontrado');
      }
      
      if (originalProduct.serial_number) {
        throw new Error('Los productos serializados no pueden dividirse');
      }
      
      if (!originalProduct.quantity || originalProduct.quantity < request.quantityToSeparate) {
        throw new Error('Cantidad insuficiente en stock');
      }
      
      // 2. Update original product quantity
      const updatedOriginal = await tx.product.update({
        where: { id: request.originalProductId },
        data: {
          quantity: originalProduct.quantity - request.quantityToSeparate,
        },
      });
      
      // 3. Create new product record with separated quantity
      const newProduct = await tx.product.create({
        data: {
          name: originalProduct.name,
          description: originalProduct.description,
          category_id: originalProduct.category_id,
          brand_id: originalProduct.brand_id,
          location_id: originalProduct.location_id,
          cost: originalProduct.cost,
          purchase_date: originalProduct.purchase_date,
          condition: originalProduct.condition,
          quantity: request.quantityToSeparate,
          status: request.newStatus,
          parent_product_id: originalProduct.id, // Track division relationship
          assigned_to: request.assignedTo,
          loan_details: request.loanDetails ? JSON.stringify(request.loanDetails) : null,
        },
      });
      
      // 4. Create audit entries for both operations
      const auditEntries = [
        {
          user_id: 1, // TODO: Get from request context
          action: 'UPDATE' as const,
          target_type: 'Product' as const,
          target_id: originalProduct.id,
          changes_json: {
            before: { quantity: originalProduct.quantity },
            after: { quantity: updatedOriginal.quantity },
            metadata: { reason: 'Stock division', newProductId: newProduct.id },
          },
          ip_address: '127.0.0.1', // TODO: Get from request
        },
        {
          user_id: 1,
          action: 'CREATE' as const,
          target_type: 'Product' as const,
          target_id: newProduct.id,
          changes_json: {
            after: newProduct,
            metadata: { 
              reason: 'Stock division', 
              originalProductId: originalProduct.id,
              divisionType: request.newStatus,
            },
          },
          ip_address: '127.0.0.1',
        },
      ];
      
      return {
        originalProduct: updatedOriginal,
        newProduct,
        auditEntries,
      };
    });
  }

  static async consolidateStock(productIds: number[]): Promise<Product> {
    return await prisma.$transaction(async (tx) => {
      // Logic for consolidating multiple product records back into one
      // When items are returned from loan/assignment
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });
      
      // Validate all products can be consolidated (same name, category, etc.)
      const consolidatedQuantity = products.reduce((sum, p) => sum + (p.quantity || 1), 0);
      
      // Update the first product with total quantity
      const primaryProduct = await tx.product.update({
        where: { id: products[0].id },
        data: {
          quantity: consolidatedQuantity,
          status: 'Disponible',
          assigned_to: null,
          loan_details: null,
        },
      });
      
      // Delete the other product records
      await tx.product.deleteMany({
        where: { id: { in: productIds.slice(1) } },
      });
      
      return primaryProduct;
    });
  }
}
```

**API Endpoints for Stock Management**:
```typescript
// POST /api/v1/inventory/divide-stock
app.post('/api/v1/inventory/divide-stock',
  authenticateJWT,
  authorizeRoles(['Admin', 'Editor']),
  validateRequest(z.object({
    body: z.object({
      originalProductId: z.number(),
      quantityToSeparate: z.number().min(1),
      newStatus: z.enum(['Asignado', 'Prestado']),
      assignedTo: z.number().optional(),
      loanDetails: z.object({
        borrower: z.string(),
        expectedReturn: z.string().datetime(),
        notes: z.string().optional(),
      }).optional(),
    }),
  })),
  async (req, res) => {
    try {
      const result = await InventoryService.divideStock(req.body);
      
      // Log audit entries
      await Promise.all(
        result.auditEntries.map(entry => AuditService.logAction(entry))
      );
      
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: { code: 'DIVISION_ERROR', message: error.message },
      });
    }
  }
);
```

### TASK: TRD-016 - Inventory Status Management
**Priority**: P2 | **Status**: Not Started | **Complexity**: Medium
**Description**: Implement status lifecycle management
**Dependencies**: @PRD 3 (Asset lifecycle states)

#### Status Colors from @PRD:
- Disponible (Verde)
- Asignado (Púrpura)  
- Prestado (Amarillo)
- Pendiente de Retiro (Naranja)
- Retirado (Rojo)

**Frontend Status**: Implemented in `components/status-badges/` directory

---

# SECTION 9: DATA MIGRATION & SYNC (MEDIUM PRIORITY)

## 9.1 LocalStorage to Database Migration

### TASK: TRD-017 - Data Migration Strategy
**Priority**: P2 | **Status**: Not Started | **Complexity**: Medium
**Description**: Migrate existing localStorage data to database
**Dependencies**: TRD-002 (Database setup)

**Current Data Location**: `contexts/app-context.tsx` and `lib/mocks/inventory-mock-data.ts`

### TASK: TRD-018 - State Management Migration
**Priority**: P2 | **Status**: Not Started | **Complexity**: High
**Description**: Replace localStorage context with API calls using Zustand
**Dependencies**: @SRS 3.1 (Zustand state management), TRD-005 (API endpoints)

---

# SECTION 10: UI/UX ALIGNMENT (MEDIUM PRIORITY)

## 10.1 Visual Style Guide Compliance

### TASK: TRD-019 - CFE Color Palette Implementation
**Priority**: P2 | **Status**: Partially Complete | **Complexity**: Low
**Description**: Ensure complete compliance with @Visual Style Guide
**Dependencies**: @Visual Style Guide Section 2

#### Color Variables Status:
- ✅ `cfe-green` (#008E5A) - Implemented
- ✅ `cfe-black` (#111111) - Implemented  
- ⚠️ `cfe-green-dark`, `cfe-green-very-dark` - Need implementation
- ⚠️ CSS variables for theme consistency - Need implementation

**Implementation Location**: `tailwind.config.ts` and global CSS

### TASK: TRD-020 - Accessibility Compliance
**Priority**: P2 | **Status**: In Progress | **Complexity**: Medium
**Description**: Ensure WCAG 2.1 AA compliance across all components
**Dependencies**: @SRS 9, @Visual Style Guide

#### Current Status Analysis:
- ✅ aria-labels implemented in key components
- ✅ Focus states defined
- ⚠️ Color contrast verification needed
- ⚠️ Keyboard navigation testing needed

---

# SECTION 11: PERFORMANCE & SCALABILITY (MEDIUM PRIORITY)

## 11.1 Performance Requirements

### TASK: TRD-021 - Performance Optimization
**Priority**: P2 | **Status**: Not Started | **Complexity**: Medium
**Description**: Meet performance targets from @PRD Section 4.1
**Dependencies**: @PRD 4.1 (Performance requirements)

#### Performance Targets:
- Search/load operations: < 1 second
- General operations: < 3 seconds
- 3,000 asset capacity without degradation

### TASK: TRD-022 - Database Indexing Strategy
**Priority**: P2 | **Status**: Not Started | **Complexity**: Low
**Description**: Implement database indexes for search and filter operations
**Dependencies**: TRD-002 (Database), TRD-006 (Search/filter)

---

# SECTION 12: SECURITY IMPLEMENTATION (MEDIUM PRIORITY)

## 12.1 Security Hardening

### TASK: TRD-023 - Input Sanitization
**Priority**: P2 | **Status**: Not Started | **Complexity**: Low
**Description**: Implement comprehensive input sanitization
**Dependencies**: @PRD Section 5 (Security considerations)

### TASK: TRD-024 - Security Headers
**Priority**: P2 | **Status**: Not Started | **Complexity**: Low
**Description**: Implement Helmet.js and security headers
**Dependencies**: @PRD Section 5, @SRS tech stack

---

# SECTION 13: TESTING & QUALITY ASSURANCE (LOW PRIORITY)

## 13.1 Test Coverage

### TASK: TRD-025 - Unit Test Implementation
**Priority**: P3 | **Status**: Not Started | **Complexity**: Medium
**Description**: Implement comprehensive test suite
**Dependencies**: Project setup, all core functionality

### TASK: TRD-026 - Integration Testing
**Priority**: P3 | **Status**: Not Started | **Complexity**: High
**Description**: API integration and end-to-end testing
**Dependencies**: TRD-025, backend completion

---

# SECTION 14: DOCUMENTATION & DEPLOYMENT (LOW PRIORITY)

## 14.1 Documentation Updates

### TASK: TRD-027 - API Documentation
**Priority**: P3 | **Status**: Not Started | **Complexity**: Low
**Description**: Generate comprehensive API documentation
**Dependencies**: TRD-005 (API implementation)

### TASK: TRD-028 - Deployment Pipeline
**Priority**: P3 | **Status**: Not Started | **Complexity**: Medium
**Description**: Set up production deployment pipeline
**Dependencies**: Backend completion

---

# SECTION 15: CRITICAL DEPENDENCIES MATRIX

## High-Impact Dependencies
| Task | Blocks | Critical Path | Est. Days |
|------|--------|---------------|-----------|
| TRD-001 | All backend tasks | ✅ | 14-21 |
| TRD-002 | All data operations | ✅ | 7-10 |
| TRD-003 | All auth features | ✅ | 5-7 |
| TRD-005 | Frontend integration | ✅ | 10-14 |

## Implementation Phases

### Phase 1: Foundation (P0 - Critical)
- TRD-001: Backend Architecture
- TRD-002: Database Setup  
- TRD-003: Authentication
- TRD-004: Authorization

### Phase 2: Core Features (P1 - High)
- TRD-005: API Endpoints
- TRD-007: Validation
- TRD-009: Document Management
- TRD-011: Audit System

### Phase 3: Advanced Features (P2 - Medium)
- TRD-015: Stock Logic
- TRD-017: Data Migration
- TRD-019: UI Compliance
- TRD-021: Performance

### Phase 4: Polish & Deploy (P3 - Low)
- TRD-025: Testing
- TRD-027: Documentation
- TRD-028: Deployment

---

# SECTION 16: RISK ASSESSMENT & MITIGATION

## High-Risk Items
1. **Data Migration Complexity**: LocalStorage to database migration may lose data
   - **Mitigation**: Implement backup/restore functionality
   - **Prevention**: Create migration scripts with rollback capability
   - **Detection**: Implement data validation checks post-migration

2. **Permission System Gaps**: Frontend assumes permissions that backend might reject
   - **Mitigation**: Implement backend validation first, then align frontend
   - **Testing**: Create comprehensive RBAC test suite
   - **Monitoring**: Log permission violations for security analysis

3. **Performance at Scale**: 3,000+ items may impact frontend performance
   - **Mitigation**: Implement proper pagination and lazy loading
   - **Optimization**: Database indexing strategy for search/filter operations
   - **Monitoring**: Track query performance with Prisma query logging

4. **Audit Log Performance**: Excessive audit logging may impact database performance
   - **Mitigation**: Implement audit log archiving strategy
   - **Optimization**: Use separate database connection pool for audit operations
   - **Monitoring**: Track audit log table size and query performance

## Medium-Risk Items
1. **API Contract Misalignment**: Frontend expects different data structure
   - **Mitigation**: Define API contracts before implementation
   - **Validation**: Use TypeScript interfaces shared between frontend/backend
   - **Testing**: Implement contract testing with tools like Pact

2. **File Storage Scalability**: Local filesystem may not scale
   - **Mitigation**: Plan cloud storage migration path (AWS S3, Azure Blob)
   - **Monitoring**: Track disk usage and file access patterns
   - **Backup**: Implement automated backup for uploaded documents

3. **Event Bus Reliability**: Internal EventEmitter may lose events on failure
   - **Mitigation**: Implement event persistence for critical events
   - **Fallback**: Direct service calls as backup for critical operations
   - **Monitoring**: Track event processing success rates

## Low-Risk Items
1. **JWT Token Security**: Token compromise or replay attacks
   - **Mitigation**: Short token expiration times with refresh tokens
   - **Prevention**: Implement token rotation and blacklisting
   - **Detection**: Monitor for unusual login patterns

2. **Concurrent Stock Operations**: Race conditions in stock division
   - **Mitigation**: Use database transactions for all stock operations
   - **Prevention**: Implement optimistic locking with version fields
   - **Detection**: Monitor for negative stock quantities

## Risk Monitoring Strategy
```typescript
// Performance monitoring middleware
const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log slow requests
    if (duration > 3000) {
      console.warn(`SLOW REQUEST: ${req.method} ${req.path} took ${duration}ms`);
    }
    
    // Track performance metrics
    eventBus.emit('performance.logged', {
      method: req.method,
      path: req.path,
      duration,
      statusCode: res.statusCode,
    });
  });
  
  next();
};

// Error tracking middleware
const errorTrackingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error with context
  console.error('API Error:', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    user: req.user?.id,
    timestamp: new Date().toISOString(),
  });
  
  // Send to external monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(err, { user: req.user, extra: { path: req.path } });
  }
  
  next(err);
};
```

---

# APPENDIX A: REFERENCE LOCATIONS

## Key Frontend Files Requiring Backend Integration
- `contexts/app-context.tsx` - State management (lines 1061-1124)
  - Contains localStorage simulation that needs API integration
  - User authentication state management
  - Global application state (inventory, users, tasks)
- `app/(app)/inventario/page.tsx` - Inventory management
  - Pagination, search, and filtering logic (lines 202-234)
  - Bulk operations UI (selection, actions)
  - Status display and management
- `app/(app)/tareas-pendientes/page.tsx` - Task management
  - Quick load/retirement task creation
  - Task processing and completion
  - Task status tracking
- `components/document-manager.tsx` - Document operations
  - File upload interface and validation
  - Document listing and management
  - Permission-based UI controls (lines 35-92)
- `app/(app)/configuracion/umbrales-inventario/page.tsx` - Configuration
  - Threshold validation logic (lines 42-62)
  - Settings management and persistence

## Additional Frontend Integration Points
- `app/(app)/asignados/page.tsx` - Assignment filtering (lines 97-130)
- `app/(app)/historial/page.tsx` - History search and filters (lines 81-141)
- `app/(app)/papelera-documentos/page.tsx` - Trash management (lines 40-85)
- `components/status-badges/` - Status visualization components
- `hooks/use-pending-tasks.tsx` - Task management hooks

## Configuration Files
- `tailwind.config.ts` - Theme and color configuration
  - CFE color palette definitions
  - Component styling variables
- `package.json` - Dependencies and scripts
  - Backend dependencies to add: prisma, @prisma/client, zod, jsonwebtoken, multer, helmet
- `tsconfig.json` - TypeScript configuration
  - Ensure strict mode enabled for backend development
- `next.config.mjs` - Next.js configuration
  - API route configuration and middleware setup

## Environment Variables Required
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/gati_c"

# Authentication
JWT_SECRET="your-256-bit-secret"
JWT_EXPIRES_IN="24h"

# File Storage
UPLOAD_DIR="/var/uploads/gati-c"
MAX_FILE_SIZE="104857600" # 100MB

# Security
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# Performance
DB_CONNECTION_POOL_SIZE="10"
AUDIT_LOG_BATCH_SIZE="100"
```

## Backend Directory Structure Recommendation
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.middleware.ts
│   │   └── auth.schemas.ts
│   ├── inventory/
│   │   ├── inventory.controller.ts
│   │   ├── inventory.service.ts
│   │   └── inventory.schemas.ts
│   ├── documents/
│   │   ├── document.controller.ts
│   │   ├── document.service.ts
│   │   └── document.middleware.ts
│   ├── audit/
│   │   ├── audit.service.ts
│   │   └── audit.controller.ts
│   └── tasks/
│       ├── task.controller.ts
│       ├── task.service.ts
│       └── task.schemas.ts
├── shared/
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── audit.middleware.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── encryption.ts
│   │   └── file-utils.ts
│   └── types/
│       ├── auth.types.ts
│       ├── api.types.ts
│       └── audit.types.ts
├── config/
│   ├── database.ts
│   ├── jwt.ts
│   └── app.config.ts
├── events/
│   ├── event-bus.ts
│   └── event-handlers.ts
└── app.ts
```

---

**Document Maintenance**: This TRD should be updated as tasks are completed and new requirements are discovered. All task statuses and priorities should be reviewed bi-weekly during active development.

**Next Review Date**: [To be scheduled after first implementation phase] 