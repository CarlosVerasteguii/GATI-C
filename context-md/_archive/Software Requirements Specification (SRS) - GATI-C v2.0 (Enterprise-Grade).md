Software Requirements Specification (SRS) - GATI-C v2.1 (Pragmatic)
1. System Design
•	1.1. Type: Web-based application, architected with a desktop-first philosophy. The UI must be fully responsive, ensuring complete functionality on tablets and a usable, streamlined experience on mobile devices.
•	1.2. Modules (Modular Monolith): The backend is a single, deployable Node.js application, internally structured into discrete, loosely-coupled modules. This provides initial development velocity while paving the way for future migration to microservices if needed.
o	Core Modules:
	Inventory: Manages products, stock, and lifecycle states.
	Identity & Access Management (IAM): Handles users, roles, permissions, and authentication.
	Task Management: Manages "Tareas Pendientes" (Carga/Retiro Rápido).
	Document Management: Handles file uploads, storage, and soft-deletes.
	Auditing: Responsible for all logging and history tracking.
•	1.3. Inter-Module Communication: La comunicación entre módulos se realiza a través de llamadas de servicio directas, gestionadas por un contenedor de Inversión de Control (IoC) como `tsyringe`. Esto promueve la simplicidad y la mantenibilidad para la escala actual del proyecto.
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
o	Database ORM: 4.
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
8. Database Design ERD (Entity-Relationship Design)
•	8.1. Core Tables:
o	User (id, name, email, password_hash, role, trusted_ip - Este campo se usará para la funcionalidad de 'Acceso Rápido' desde el login, permitiendo identificar al usuario por su IP registrada para atribuirle automáticamente las acciones rápidas que realice. La relación es de un solo trusted_ip por usuario.)
o	Product (id, name, serial_number, description, cost, purchase_date, condition, ...)
o	Brand (id, name)
o	Category (id, name)
o	Location (id, name)
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
o	Trazabilidad de Mejor Esfuerzo: Las operaciones de auditoría (logging) se consideran secundarias. Se registrarán como una operación de "mejor esfuerzo" que no debe bloquear ni hacer fallar la acción principal del usuario si el subsistema de auditoría falla.
o	Soft Deletes: Documents will use a soft-delete mechanism (deleted_at column).
o	Cascading Borrado Restringido: Deleting Brands, Categories, o Users is restricted by default if they are linked to Products. The API will return an error. The UI will present this error with an option to "Forzar Borrado", which triggers a separate, explicit API call that sets the foreign keys in the Products table to NULL.
•	8.4. Stock Logic for Non-Serialized Items: The "división de registros" strategy will be used. A loan/assignment of 1 unit from a lot of 10 will update the original row's quantity to 9 and create a new row with quantity 1 and the new status.
9. Accessibility
•	Standard: Accesibilidad Razonable. Se priorizará una experiencia de usuario funcional y clara sin necesidad de una auditoría formal de cumplimiento de WCAG 2.1 AA.
•	Requirements:
o	Full keyboard navigability.
o	Semantic HTML5 elements.
o	aria-label attributes for all icon-only buttons and controls.
o	Sufficient color contrast ratios for all text.
o	Focus states (focus-visible) must be clear and consistent.

