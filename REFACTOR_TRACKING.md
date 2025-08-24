# English Unification Conquest Map

## Root
- [ ] .eslintrc.json
- [ ] .cursorignore
- [ ] .cursorules
- [x] AGENTS.md
- [x] GEMINI.md
- [x] CHANGELOG.md
- [x] CONTRIBUTING.md
- [x] docs-setup.md
- [ ] components.json
- [ ] docker-compose.yml
- [ ] next.config.mjs
- [ ] next-env.d.ts
- [ ] package.json
- [ ] postcss.config.mjs
- [ ] reset-project.ps1
- [ ] tailwind.config.ts
- [ ] tsconfig.json
- [ ] tatus
- [ ] how-branch --all

## app
- [ ] app/ClientLayout.tsx
- [ ] app/globals.css
- [ ] app/layout.tsx
- [x] app/page.tsx

### app/login
- [ ] app/login/page.tsx

### app/(app)
- [ ] app/(app)/layout.tsx

#### app/(app)/dashboard
- [ ] app/(app)/dashboard/page.tsx

#### app/(app)/prestamos
- [ ] app/(app)/prestamos/page.tsx
- [ ] app/(app)/prestamos/loading.tsx

#### app/(app)/asignados
- [ ] app/(app)/asignados/page.tsx
- [ ] app/(app)/asignados/loading.tsx

#### app/(app)/configuracion
- [ ] app/(app)/configuracion/page.tsx
- [ ] app/(app)/configuracion/loading.tsx

##### app/(app)/configuracion/umbrales-inventario
- [ ] app/(app)/configuracion/umbrales-inventario/page.tsx

#### app/(app)/tareas-pendientes
- [ ] app/(app)/tareas-pendientes/page.tsx
- [ ] app/(app)/tareas-pendientes/loading.tsx

#### app/(app)/inventario
- [ ] app/(app)/inventario/page.tsx
- [ ] app/(app)/inventario/loading.tsx

#### app/(app)/perfil
- [ ] app/(app)/perfil/page.tsx
- [ ] app/(app)/perfil/loading.tsx

#### app/(app)/papelera-documentos
- [ ] app/(app)/papelera-documentos/page.tsx
- [ ] app/(app)/papelera-documentos/loading.tsx

#### app/(app)/historial
- [ ] app/(app)/historial/page.tsx
- [ ] app/(app)/historial/loading.tsx

## components
- [ ] components/access-request-modal.tsx
- [ ] components/action-menu.tsx
- [ ] components/activity-detail-sheet.tsx
- [ ] components/app-layout.tsx
- [ ] components/assign-modal.tsx
- [ ] components/brand-combobox.tsx
- [ ] components/breadcrumbs.tsx
- [ ] components/bulk-assign-modal.tsx
- [ ] components/bulk-edit-modal.tsx
- [ ] components/bulk-lend-modal.tsx
- [ ] components/bulk-retire-modal.tsx
- [ ] components/confirmation-dialog-for-editor.tsx
- [ ] components/detail-sheet.tsx
- [ ] components/document-manager.tsx
- [ ] components/document-preview.tsx
- [ ] components/document-upload.tsx
- [ ] components/document-viewer.tsx
- [ ] components/edit-product-modal.tsx
- [ ] components/edit-task-sheet.tsx
- [ ] components/empty-state.tsx
- [ ] components/help-modal.tsx
- [ ] components/keyboard-shortcuts-help.tsx
- [ ] components/lend-modal.tsx
- [ ] components/location-combobox.tsx
- [ ] components/navigation-demo.tsx
- [ ] components/product-search-combobox.tsx
- [ ] components/provider-combobox.tsx
- [ ] components/quick-load-modal.tsx
- [ ] components/quick-retire-modal.tsx
- [ ] components/retire-product-modal.tsx
- [ ] components/status-badge.tsx
- [ ] components/task-audit-log-sheet.tsx
- [ ] components/theme-provider.tsx
- [ ] components/theme-toggle.tsx
- [ ] components/toast-demo.tsx

### components/ui
- [ ] components/ui/accordion.tsx
- [ ] components/ui/alert.tsx
- [ ] components/ui/alert-dialog.tsx
- [ ] components/ui/aspect-ratio.tsx
- [ ] components/ui/avatar.tsx
- [ ] components/ui/badge.tsx
- [ ] components/ui/breadcrumb.tsx
- [ ] components/ui/button.tsx
- [ ] components/ui/calendar.tsx
- [ ] components/ui/card.tsx
- [ ] components/ui/carousel.tsx
- [ ] components/ui/chart.tsx
- [ ] components/ui/checkbox.tsx
- [ ] components/ui/collapsible.tsx
- [ ] components/ui/command.tsx
- [ ] components/ui/context-menu.tsx
- [ ] components/ui/date-picker-with-range.tsx
- [ ] components/ui/dialog.tsx
- [ ] components/ui/drawer.tsx
- [ ] components/ui/dropdown-menu.tsx
- [ ] components/ui/filter-badge.tsx
- [ ] components/ui/form.tsx
- [ ] components/ui/hover-card.tsx
- [ ] components/ui/input.tsx
- [ ] components/ui/input-otp.tsx
- [ ] components/ui/label.tsx
- [ ] components/ui/menubar.tsx
- [ ] components/ui/navigation-menu.tsx
- [ ] components/ui/pagination.tsx
- [ ] components/ui/particle-background.tsx
- [ ] components/ui/popover.tsx
- [ ] components/ui/progress.tsx
- [ ] components/ui/radio-group.tsx
- [ ] components/ui/resizable.tsx
- [ ] components/ui/scroll-area.tsx
- [ ] components/ui/select.tsx
- [ ] components/ui/separator.tsx
- [ ] components/ui/sheet.tsx
- [ ] components/ui/sidebar.tsx
- [ ] components/ui/skeleton.tsx
- [ ] components/ui/slider.tsx
- [ ] components/ui/sonner.tsx
- [ ] components/ui/switch.tsx
- [ ] components/ui/table.tsx
- [ ] components/ui/tabs.tsx
- [ ] components/ui/textarea.tsx
- [ ] components/ui/toast.tsx
- [ ] components/ui/toaster.tsx
- [ ] components/ui/toggle.tsx
- [ ] components/ui/toggle-group.tsx
- [ ] components/ui/tooltip.tsx
- [ ] components/ui/user-combobox.tsx

### components/inventory
- [ ] components/inventory/advanced-filter-form.tsx
- [ ] components/inventory/child-row.tsx
- [ ] components/inventory/column-toggle-menu.tsx
- [ ] components/inventory/grouped-inventory-table.tsx
- [ ] components/inventory/parent-row.tsx
- [ ] components/inventory/search-bar.tsx

#### components/inventory/modals
- [ ] components/inventory/modals/assign-modal.tsx
- [ ] components/inventory/modals/quick-retire-modal.tsx

## contexts
- [x] contexts/app-context.tsx

## hooks
- [x] hooks/use-debounce.ts
- [ ] hooks/use-device.tsx
- [ ] hooks/use-keyboard-shortcuts.tsx
- [ ] hooks/use-navigation.tsx
- [x] hooks/use-pending-tasks.tsx
- [ ] hooks/use-toast.ts
- [ ] hooks/useInventory.ts

## lib
- [ ] lib/document-storage.ts
- [ ] lib/particle-presets.ts
- [ ] lib/utils.ts

### lib/api
- [ ] lib/api/auth.ts
- [ ] lib/api/client.ts
- [ ] lib/api/inventory.ts

### lib/stores
- [ ] lib/stores/useAuthStore.ts

### lib/mocks
- [ ] lib/mocks/inventory-mock-data.ts

## types
- [x] types/inventory.ts

## styles
- [ ] styles/globals.css

## rules
- [ ] rules/conventional-commits.md

## documentation
- [ ] documentation/api_integration_guide.md
- [ ] documentation/docker_setup.md
- [ ] documentation/document_system_implementation.md
- [ ] documentation/enhanced_toast_system.md
- [ ] documentation/inventory_module_changes.md
- [ ] documentation/layout_fixes.md
- [ ] documentation/navigation_improvements.md

### documentation/backend
- [ ] documentation/backend/

### documentation/inventory
- [ ] documentation/inventory/

## context-md
- [ ] context-md/Guía Maestra de Estilo Visual.md
- [ ] context-md/Product Requirements Document (PRD) de GATI-C.md
- [ ] context-md/Product Requirements Document (PRD) - GATI-C v2.1 (Pragmatic).md
- [ ] context-md/Software Requirements Specification (SRS) - GATI-C v2.0 (Enterprise-Grade).md
- [ ] context-md/Software Requirements Specification (SRS) - GATI-C v2.1 (Pragmatic).md
- [ ] context-md/business_context_clarification.md
- [ ] context-md/Guía de Migración de Layout.md

## backend
- [ ] backend/README.md
- [ ] backend/package.json
- [ ] backend/tsconfig.json
- [ ] backend/env.example

### backend/src
- [ ] backend/src/server.ts

#### backend/src/config
- [ ] backend/src/config/constants.ts
- [ ] backend/src/config/env.ts
- [ ] backend/src/config/prisma.ts

#### backend/src/middleware
- [ ] backend/src/middleware/auth.middleware.ts
- [ ] backend/src/middleware/rbac.middleware.ts

#### backend/src/modules
- [ ] backend/src/modules/auth/auth.controller.ts
- [ ] backend/src/modules/auth/auth.routes.ts
- [ ] backend/src/modules/auth/auth.service.ts
- [ ] backend/src/modules/audit/audit.controller.ts
- [ ] backend/src/modules/audit/audit.service.ts
- [ ] backend/src/modules/inventory/inventory.controller.ts
- [ ] backend/src/modules/inventory/inventory.routes.ts
- [ ] backend/src/modules/inventory/inventory.service.ts
- [ ] backend/src/modules/inventory/inventory.types.ts

#### backend/src/types
- [ ] backend/src/types/auth.types.ts
- [ ] backend/src/types/express.d.ts

#### backend/src/utils
- [ ] backend/src/utils/customErrors.ts

#### backend/src/routes
- [ ] backend/src/routes/

#### backend/src/events
- [ ] backend/src/events/

### backend/prisma
- [ ] backend/prisma/schema.prisma

### backend/docs
- [ ] backend/docs/openapi.yml

## public
- [ ] public/placeholder.jpg
- [ ] public/placeholder-logo.png
- [ ] public/placeholder-logo.svg
- [ ] public/placeholder-user.jpg
- [ ] public/placeholder.svg

## temp-assets
- [ ] temp-assets/logo-cfe.svg

---

## Total Files to Refactor: 156

### Frontend Files: 134
### Backend Files: 22

