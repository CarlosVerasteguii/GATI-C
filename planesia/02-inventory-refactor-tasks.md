# Checklist de Tareas — Refactorización del Módulo de Inventario (GATI‑C)

Versión: 1.0  
Fecha: 2025-09-15

Nota: Este checklist operacionaliza el “Plan Estratégico de Refactorización — Módulo de Inventario”. Se agrupa por fases y usa numeración Tarea X.Y para trazabilidad.

## Fase 1: Fundación de la API y Contratos

- [x] Tarea 1.1 (Contratos): Verificar disponibilidad de tipos canónicos en `types/generated`. Si faltan, coordinar generación desde backend (Prisma/Zod) y versionar.
- [ ] Tarea 1.2 (Schemas): Crear `lib/api/schemas/inventory.ts` con `ProductWireSchema`, `ProductListResponseSchema` y helpers de parseo.
- [ ] Tarea 1.3 (API Client): Implementar `lib/api/client.ts` con `baseURL = process.env.NEXT_PUBLIC_API_URL`, `credentials: 'include'`, cabeceras JSON y mapeo de errores; alinear `lib/api/http.ts` (reexportar o deprecado).
- [ ] Tarea 1.4 (Endpoints): Crear `lib/api/endpoints/inventory.ts` con funciones puras `listProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct` (sin estado, tipadas, validando respuestas con Zod).
- [ ] Tarea 1.5 (Hooks — Lista): Crear `lib/api/hooks/use-inventory.ts` con keygen estable (`all`, `list(params)`), uso de SWR, `keepPreviousData` y `fallbackData` opcional.
- [ ] Tarea 1.6 (Hooks — Mutaciones): Crear `lib/api/hooks/use-create-product.ts`, `use-update-product.ts`, `use-delete-product.ts` con `useSWRMutation` e invalidación de `inventoryKeys.all()` en `onSuccess`.
- [ ] Tarea 1.7 (ViewModel): Crear `types/view-models/inventory.ts` con `export type InventoryViewModel` y `export function toViewModel(product: ProductResultType): InventoryViewModel` para la tabla (etiquetas en español, keys canónicas intactas).
- [ ] Tarea 1.8 (Env): Documentar y configurar `NEXT_PUBLIC_API_URL` en `.env.local`; actualizar README corto en `lib/api/` explicando la capa.
- [ ] Tarea 1.9 (Tests — Base): Añadir unit tests para `client.ts` (errores/headers), parsers Zod y endpoints (mocks). Ubicación sugerida: `__tests__/lib/api/`.
- [ ] Tarea 1.10 (Quality Gate): Activar en CI lint + type‑check y unit tests de `lib/api/*` con umbral de cobertura ≥70%.
- [ ] Tarea 1.11 (Criterio de salida): Verificar que no existan URLs hardcodeadas (`rg 'http://localhost' hooks app components`), y que UI no importe `fetch/axios` directos.

## Fase 2: Reconstrucción de la UI en v2 (Sandbox RSC)

- [ ] Tarea 2.1 (Ruta v2): Crear `app/(app)/inventario-v2/page.tsx` como RSC; definir revalidate/tags si aplica.
- [ ] Tarea 2.2 (Client Shell): Crear `components/inventory/InventoryClient.tsx` con `'use client'`; consumir hooks de `lib/api/hooks` y orquestar filtros/selección/paginación mínima.
- [ ] Tarea 2.3 (Toolbar): Crear `components/inventory/InventoryToolbar.tsx` (búsqueda, filtros, toggles de columna). Prop‑driven, sin acceso directo a API.
- [ ] Tarea 2.4 (Tabla): Crear `components/inventory/InventoryTable.tsx` (presentación, ordenamiento, selección); consumir `InventoryViewModel`.
- [ ] Tarea 2.5 (Detalle): Crear/ajustar `components/inventory/InventoryDetailSheet.tsx` para detalle; sin lógica de acceso a datos.
- [ ] Tarea 2.6 (Diálogo Crear): Crear `components/inventory/CreateProductDialog.tsx` usando `useCreateProduct` y toasts; Optimistic UI + revalidación.
- [ ] Tarea 2.7 (Zustand Preferencias): Centralizar preferencias de columnas en store (si no existe, crear) y usarlas desde Toolbar/Tabla.
- [ ] Tarea 2.8 (Anti‑Corruption opcional): Si algún subcomponente legacy lo exige, crear `lib/api/adapters/inventory.legacy.ts` con `toLegacyInventoryItem()` y usarlo solo en el borde RSC. Registrar issue con kill‑date.
- [ ] Tarea 2.9 (SWR integración): Estándar de claves: `inventoryKeys`; usar `fallbackData` en cliente en caso de SSR hydrate; evitar doble caché.
- [ ] Tarea 2.10 (Loading UX): Añadir `app/(app)/inventario-v2/loading.tsx` con skeletons; evitar spinners largos.
- [ ] Tarea 2.11 (Tests — UI): Component tests (RTL) para Toolbar/Tabla/Dialog; mocks de hooks. Ubicación sugerida: `components/inventory/__tests__/`.
- [ ] Tarea 2.12 (E2E — Flujos): Playwright para crear/editar/eliminar/filtrar/paginar; smoke suite en CI.
- [ ] Tarea 2.13 (Criterio de salida): Paridad funcional con la ruta legacy, sin dependencias a `hooks/useInventory.ts` ni a `types/inventory.ts` en v2.

## Fase 3: El Cambio y Limpieza

- [ ] Tarea 3.1 (Promoción): Mover contenido de `inventario-v2` a `app/(app)/inventario/`; renombrar/reubicar componentes a `components/inventory/` definitivos.
- [ ] Tarea 3.2 (Eliminar Legacy): Eliminar `hooks/useInventory.ts`, `types/inventory.ts`, `lib/api/inventory.ts` (contrato en español), `lib/mocks/inventory-mock-data.ts` y cualquier adapter temporal.
- [ ] Tarea 3.3 (Búsqueda de Residuos): `rg -n "types/inventory|useInventory\.|inventario-v2|inventory\.legacy"` y actualizar importaciones restantes.
- [ ] Tarea 3.4 (Docs): Actualizar `docs/04-frontend-architecture.md` (ejemplos de hooks/keys RSC) y README de `lib/api/` (patrones definitivos).
- [ ] Tarea 3.5 (Tests finales): Ejecutar suite completa (unit/component/E2E) y actualizar snapshots; cobertura ≥80% en módulos críticos.
- [ ] Tarea 3.6 (Quality Gate final): CI en verde con lint, type‑check, coverage thresholds y smoke E2E.
- [ ] Tarea 3.7 (Kill‑date): Cerrar issues de adapters y confirmar retiro; si existe código transitorio pasado de fecha, bloquear merge.
- [ ] Tarea 3.8 (Criterio de salida): Cero referencias a legacy/transitorios; build y pruebas estables; performance dentro de budgets acordados.

## Notas Operativas

- Gobernanza: cada PR debe enlazar tareas de este checklist; no mezclar fases en un mismo PR.
- Revisión técnica: al final de cada fase, realizar revisión conjunta (arquitectura + QA) antes de avanzar.
- Observabilidad: opcionalmente, registrar tiempos de respuesta del API y latencias de render para validar mejoras.

