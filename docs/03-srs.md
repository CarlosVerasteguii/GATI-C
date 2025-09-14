Software Requirements Specification (SRS) - GATI-C v2.2 (Final)
1. System Design
•	1.1. Type: Web-based application, architected with a desktop-first philosophy. The UI must be fully responsive, ensuring complete functionality on tablets and a usable, streamlined experience on mobile devices.
•	1.2. Modules (Modular Monolith): The backend is a single, deployable Node.js application, internally structured into discrete, loosely-coupled modules. This provides initial development velocity while paving the way for future migration to microservices if needed.
o	Core Modules:
	Inventory: Manages products, stock, lifecycle states, and soft-deletes.
	Identity & Access Management (IAM): Handles users, roles, permissions, and authentication.
	Task Management: Manages "Tareas Pendientes" (Carga/Retiro Rápido).
	Document Management: Handles file uploads, UUID-based immutable storage (stored as `uuid.ext`), and universal soft-delete semantics (no trash) for documents; participates in product-cascaded soft-delete.
	Auditing: Responsible for all logging and history tracking.
•	1.3. Inter-Module Communication: La comunicación entre módulos se realiza a través de llamadas de servicio directas, gestionadas por un contenedor de Inversión de Control (IoC) como `tsyringe`. Esto promueve la simplicidad y la mantenibilidad para la escala actual del proyecto. La Auditoría es asíncrona y desacoplada; no participa en transacciones de negocio y sus fallos no bloquean operaciones.
2. Architecture Pattern
•	2.1. Pattern: Decoupled Client-Server Architecture.
•	2.2. Frontend (Client): A Single-Page Application (SPA) built with React and Next.js (App Router). Its sole responsibility is to render the UI and manage user interactions. It is a "dumb" client that consumes data from the API.
•	2.3. Backend (Server): A stateless Node.js/Express application. It handles all business logic, data validation, and database interactions.
•	2.4. Communication Protocol: All client-server communication will occur over HTTPS via a versioned, stateless RESTful API.
3. State Management
•	3.1. Client-Side (Frontend):
o	Primary Library: Zustand. Chosen for its minimal API, high performance, and ability to prevent unnecessary re-renders, directly supporting the requirement for an "extremadamente fluida" UI.
o	UI Strategy: Optimistic UI is the default strategy for all common data mutation operations. Upon user action, the UI will update instantly. A robust error-handling mechanism will revert the UI state and display a user-friendly Toast notification if the backend API call fails (e.g., due to network loss).
•	3.2. Server-Side (Backend): The backend is stateless. No session data will be stored in server memory. Each API request is self-contained and authenticated independently.
4. Data Flow
•	4.1. Standard Request Lifecycle:
1.	User interaction triggers an event in a React component.
2.	The corresponding action calls a service function that constructs and sends an API request (e.g., using fetch o axios).
3.	The request hits the Express API endpoint.
4.	An Express middleware authenticates the request by validating the JWT.
5.	The endpoint controller receives the request and uses Zod to validate the entire request body/params against a strict schema. Invalid requests are rejected with a 400 Bad Request and a clear error message.
6.	The controller passes the validated data to the appropriate service module.
7.	The service executes the business logic, interacting with the database via the Prisma ORM.
8.	The API responds with a standard JSON structure, including the full, updated resource on success.
9.	Post-commit and post-response, the service emits an audit event handled by `AuditService` asynchronously. Any failure to persist the audit log is recorded internally and does not affect the already completed user operation.
•	4.2. Real-time Notifications: Des-priorizado. Las actualizaciones de datos críticos (como nuevas "Tareas Pendientes") se gestionarán mediante la actualización manual o el re-fetching de datos tras una acción del usuario. Esto es suficiente para los flujos de trabajo actuales y evita la complejidad del polling.
5. Technical Stack
•	Frontend:
o	Framework/Language: Next.js 14+ (App Router), React 18+, TypeScript 5+.
o	Styling: Tailwind CSS.
o	UI Components: shadcn/ui.
o	State Management: Zustand.
o	Forms: React Hook Form.
o	Data Fetching: SWR o React Query.
•	Backend:
o	Environment/Framework: Node.js (LTS), Express.js, TypeScript 5+.
	o	Database ORM: Prisma.
o	Schema Validation: Zod.
•	Database:
o	System: MySQL 8.0+.
•	DevOps & Best Practices:
o	Database Migrations: All schema changes must be managed via Prisma Migrate. No manual ALTER TABLE statements are permitted on production.
o	Code Quality: ESLint and Prettier configured for both frontend and backend to enforce a consistent style.
o	Reporting Queries: For a very limited set of pre-approved, complex, read-only reporting endpoints, the use of Prisma's raw SQL query functionality is permitted, provided it is justified by a significant performance gain over the ORM equivalent.
6. Authentication & Authorization Process
•	6.1. Strategy: JWT stored in a secure, httpOnly cookie.
•	6.2. Endpoints:
o	POST /api/v1/auth/login: Accepts credentials, returns JWT in a cookie.
o	POST /api/v1/auth/logout: Clears the cookie.
o	GET /api/v1/auth/me: Returns the current user's profile based on the token.
•	6.3. Route Protection: A top-level component/middleware in Next.js will guard all private routes. If no valid JWT is present, it will perform an immediate, unconditional redirect to /login.
•	6.4. Role-Based Access Control (RBAC): A middleware on the backend will check the user's role (from the JWT payload) for endpoints that require specific permissions (e.g., only Admin can access user management endpoints).
7. API & Route Design
•	7.1. Versioning: All API routes are prefixed with /api/v1/.
•	7.2. Endpoint Aggregation: To minimize latency, primary data-fetching endpoints will be aggregated.
o	GET /api/v1/view/inventory?page=1&limit=25&search=...&category=...: Returns paginated products and all necessary metadata (categories, brands) for the inventory view.
•	7.3. Naming Conventions: RESTful conventions will be used (e.g., GET /products, GET /products/:id, POST /products).
•	7.4. Response Structure:
o	Success: { "success": true, "data": { ... } }
o	Error: { "success": false, "error": { "code": "...", "message": "..." } }
•	7.5. Delete Semantics (Soft-Delete Universal):
o	DELETE /api/v1/products/:id: Marca el producto con `deleted_at` y, en la misma transacción lógica, aplica soft-delete a sus documentos asociados. Devuelve 204 No Content o { "success": true }.
o	DELETE /api/v1/products/:productId/documents/:id: Marca el documento con `deleted_at`. Devuelve 204 No Content o { "success": true }.
o	List endpoints excluyen por defecto registros con `deleted_at` no nulo. Peticiones GET/PUT sobre recursos soft-deleted devuelven 404.
•	7.6. Document Upload/Download Semantics (UUID Storage):
o	POST /api/v1/products/:id/documents (multipart/form-data): Acepta el archivo, valida tipo y tamaño, genera UUID v4, guarda como `uuid.ext`, persiste `original_filename` y `stored_uuid_filename`, y retorna el recurso Document completo.
o	GET /api/v1/products/:productId/documents/:id/download: Verifica que ni el producto ni el documento estén soft-deleted; sirve el archivo desde `stored_uuid_filename` con encabezado `Content-Type` correcto y `Content-Disposition: attachment; filename*=UTF-8''<original_filename_urlencoded>`.
o	Seguridad: Rechaza paths arbitrarios, valida extensión vs MIME, y registra auditoría de subida/descarga.
•	7.7. Catalog Deletion Semantics (Strict Protection):
o	DELETE /api/v1/brands/:id, /api/v1/categories/:id, /api/v1/locations/:id: Si existen productos asociados, la API responde 409 Conflict con payload { count: <n>, examples: [<product_ids>], required_action: "reassign" }.
o	Sin productos asociados: elimina con soft-delete (marca `deleted_at`) y devuelve 204 No Content o { "success": true }.
o	No existe endpoint de “forzar borrado” para nulear FKs. La reasignación de productos es una operación explícita separada (p.ej., PATCH /api/v1/products/bulk-reassign-brand).
8. Database Design ERD (Entity-Relationship Design)
•	8.1. Core Tables:
o	User (id, name, email, password_hash, role, trusted_ip, deleted_at - Este campo se usará para la funcionalidad de 'Acceso Rápido' desde el login, permitiendo identificar al usuario por su IP registrada para atribuirle automáticamente las acciones rápidas que realice. La relación es de un solo trusted_ip por usuario.)
o	Product (id, name, serial_number, description, cost, purchase_date, condition, ..., deleted_at)
o	Brand (id, name, deleted_at)
o	Category (id, name, deleted_at)
o	Location (id, name, deleted_at)
o	Document (id, original_filename, stored_uuid_filename, product_id, deleted_at)
o	AuditLog (id, user_id, action, target_type, target_id, changes_json)
o	PendingTask (id, creator_id, type, status, details_json)
o	TaskAuditLog (id, task_id, user_id, event, details)
•	8.2. Key Relationships:
o	Product -> Brand (Many-to-One)
o	Product -> Category (Many-to-One)
o	Product -> Location (Many-to-One)
o	Product -> Document (One-to-Many)
•	8.3. Data Integrity Policies:
o	Trazabilidad de Mejor Esfuerzo: Las operaciones de auditoría (logging) se consideran secundarias, asíncronas y desacopladas. `AuditLog` no forma parte de ninguna transacción de negocio. Garantía at-most-once: se prioriza no duplicar eventos; omisiones puntuales por fallos del subsistema son aceptables. Los fallos de auditoría no bloquean ni hacen fallar la acción principal del usuario, y no provocan rollback de operaciones de negocio.
o	Soft Deletes (Universal): Todas las entidades eliminables usan un mecanismo de soft-delete mediante la columna `deleted_at`. No existe papelera visible para el usuario ni endpoints de restauración. El borrado de un `Product` provoca el soft-delete de sus `Document` asociados en la misma transacción lógica. Las lecturas por defecto excluyen registros con `deleted_at` no nulo; peticiones `GET`/`PUT` sobre recursos soft-deleted devuelven 404. Las descargas de archivos se bloquean si el `Document` o su `Product` asociado están soft-deleted.
o	File Naming & Storage Policy: En la subida de archivos, el servicio genera un UUID v4 y almacena el archivo en disco como `uuid.ext` (extensión derivada del MIME/filename validado). La base de datos guarda `stored_uuid_filename` y `original_filename`. En descargas, el servicio sirve el binario desde `stored_uuid_filename` y establece `Content-Disposition` con `original_filename` (UTF-8). Esta política elimina colisiones y evita exposición de información sensible en rutas del sistema de archivos.
o	Catálogo: Protección Estricta de Borrado: Eliminar Brands, Categories o Locations está prohibido si existen Products que los referencian. La API devuelve 409 Conflict con el conteo de dependencias y metadatos para facilitar su reasignación. La UI debe guiar al administrador a reasignar manualmente los productos afectados (ej. filtro preaplicado y acción de reasignación). No existe "forzar borrado" que ponga FKs a NULL.
•	8.4. Stock Logic for Non-Serialized Items: The "división de registros" strategy will be used. A loan/assignment of 1 unit from a lot of 10 will update the original row's quantity to 9 and create a new row with quantity 1 and the new status.
9. Accessibility
•	Standard: Accesibilidad Razonable. Se priorizará una experiencia de usuario funcional y clara sin necesidad de una auditoría formal de cumplimiento de WCAG 2.1 AA.
•	Requirements:
	o	Full keyboard navigability.
	o	Semantic HTML5 elements.
	o	aria-label attributes for all icon-only buttons and controls.
	o	Sufficient color contrast ratios for all text.
	o	Focus states (focus-visible) must be clear and consistent.

10. Availability & Operations (Pragmatic)
•	10.1. Operating Philosophy: El sistema prioriza simplicidad y rapidez de recuperación por encima de la alta disponibilidad. Se aceptan mantenimientos planificados y caídas esporádicas.
•	10.2. Service Windows: Horario operativo principal 8:00–16:00. Fuera de horario no se garantizan SLO.
•	10.3. SLO & Targets:
	o	SLO de disponibilidad (horario laboral): 95–97% mensual.
	o	MTTR objetivo para incidencias típicas: ≤ 30 minutos.
	o	RPO objetivo: ≤ 24 horas (copias nocturnas).
•	10.4. Infrastructure:
	o	Despliegue single-node (app + DB en un mismo host o hosts separados sin replicación obligatoria).
	o	Sin clustering ni failover automático. Se prioriza reinicio/restore rápido y procedimientos documentados.
•	10.5. Deployments & Maintenance:
	o	No se requiere zero-downtime deploy. Se permiten interrupciones breves durante despliegues y mantenimiento.
	o	Mantenimientos planificados preferentemente fuera de horario; comunicar con antelación.
•	10.6. Health & Monitoring:
	o	Endpoint `GET /healthz` para liveness/readiness básicos.
	o	Logging a archivos con rotación; métricas mínimas (CPU, RAM, disco) del host.
	o	Alertas simples a administradores ante caídas prolongadas o errores críticos.
•	10.7. Backups & Recovery:
	o	Backups de base de datos: copia nocturna (full o incremental) con retención mínima de 7 días.
	o	Pruebas periódicas de restore en entorno de pruebas para validar RPO/MTTR.
•	10.8. Operational Runbooks:
	o	Procedimientos documentados para: reinicio de servicios, restauración desde backup, rotación de logs, verificación de salud post-incidente.

