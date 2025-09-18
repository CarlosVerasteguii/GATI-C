# Checklist de Tareas — Refactorización del Módulo de Inventario (GATI‑C)

Versión: 1.0  
Fecha: 2025-09-15

Nota: Este checklist operacionaliza el “Plan Estratégico de Refactorización — Módulo de Inventario”. Se agrupa por fases y usa numeración Tarea X.Y para trazabilidad.

## Fase 1: Fundación de la API y Contratos

- [x] Tarea 1.1 (Contratos): Verificar disponibilidad de tipos canónicos en `types/generated`. Si faltan, coordinar generación desde backend (Prisma/Zod) y versionar.
- [x] Tarea 1.2 (Schemas): Crear `lib/api/schemas/inventory.ts` con `ProductWireSchema`, `ProductListResponseSchema` y helpers de parseo.
- [x] Tarea 1.3 (API Client): Implementar `lib/api/client.ts` con `baseURL = process.env.NEXT_PUBLIC_API_URL`, `credentials: 'include'`, cabeceras JSON y mapeo de errores; alinear `lib/api/http.ts` (reexportar o deprecado).
- [x] Tarea 1.4 (Endpoints): Crear `lib/api/endpoints/inventory.ts` con funciones puras `listProducts`, `getProduct`, `createProduct`, `updateProduct`, `deleteProduct` (sin estado, tipadas, validando respuestas con Zod).
- [x] Tarea 1.5 (Hooks — Lista): Crear `lib/api/hooks/use-inventory.ts` con keygen estable (`all`, `list(params)`), uso de SWR, `keepPreviousData` y `fallbackData` opcional.
- [x] Tarea 1.6 (Hooks — Mutaciones): Crear `lib/api/hooks/use-create-product.ts`, `use-update-product.ts`, `use-delete-product.ts` con `useSWRMutation` e invalidación de `inventoryKeys.all()` en `onSuccess`.
- [x] Tarea 1.7 (ViewModel): Crear `types/view-models/inventory.ts` con `export type InventoryViewModel` y `export function toViewModel(product: ProductResultType): InventoryViewModel` para la tabla (etiquetas en español, keys canónicas intactas).
- [x] Tarea 1.8 (Env): Documentar y configurar `NEXT_PUBLIC_API_URL` en `.env.local`; actualizar README corto en `lib/api/` explicando la capa.
- [x] Tarea 1.9 (Tests — Base): Añadir unit tests para `client.ts` (errores/headers), parsers Zod y endpoints (mocks). Ubicación sugerida: `__tests__/lib/api/`.
- [x] Tarea 1.10 (Quality Gate): Activar en CI lint + type‑check y unit tests de `lib/api/*` con umbral de cobertura ≥70%.
- [x] Tarea 1.11 (Criterio de salida): Verificar que no existan URLs hardcodeadas (`rg 'http://localhost' hooks app components`), y que UI no importe `fetch/axios` directos.

## Fase 1.5: Endurecimiento de la API para UI

- [x] Tarea 1.5.1 (Contrato de params): Definir y documentar en `lib/api/schemas/inventory.ts` el contrato tipado `ListParams` (ej. `{ q?, page?, pageSize?, sort?, brandId?, categoryId?, condition?, locationId? }`) con Zod y tipos exportados.
- [x] Tarea 1.5.2 (Endpoints — Lista con params): Extender `lib/api/endpoints/inventory.ts` → `listProducts(params: ListParams)` para construir query string tipado, validar respuesta con Zod y garantizar orden estable.
- [x] Tarea 1.5.3 (Hooks — Lista con params): Actualizar `lib/api/hooks/use-inventory.ts` → `useInventoryList(params, { fallbackData })`; usar `inventoryKeys.list(params)` en keygen, pasar `params` al fetcher, mantener `keepPreviousData` y `fallbackData`.
- [x] Tarea 1.5.4 (Tests — Params y Keys): Unit tests para construcción de query, estabilidad de `inventoryKeys` con `params` y fetcher parametrizado (mocks). Cobertura ≥70% en `lib/api/*`.
- [x] Tarea 1.5.5 (Docs): Documentar el contrato de `params` y el patrón de claves/invalidación en `docs/04-frontend-architecture.md` y README de `lib/api/`.

## Fase 2: Reconstrucción de la UI en v2 (Sandbox RSC)

- [x] Tarea 2.1 (Ruta v2): Crear `app/(app)/inventario-v2/page.tsx` como RSC; definir revalidate/tags si aplica.
- [x] Tarea 2.2 (Client Shell): Crear `components/inventory/InventoryClient.tsx` con `'use client'`; usar los `searchParams` de la URL como la única fuente de verdad para filtros y paginación (leer/escribir con `useSearchParams`/`router.replace`), derivando el estado local y consumiendo los hooks de `lib/api/hooks` sin duplicar estado.
- [x] Tarea 2.3 (Toolbar): Crear `components/inventory/InventoryToolbar.tsx` (búsqueda, filtros, toggles de columna). Prop‑driven, sin acceso directo a API.
- [x] Tarea 2.4 (Tabla): Crear `components/inventory/InventoryTable.tsx` (presentación, ordenamiento, selección); consumir `InventoryViewModel`. Debe implementar la lógica de agrupación y expansión de productos (stacks vs serializados) para lograr paridad funcional con la versión legacy.
- [x] Tarea 2.5 (Detalle): Crear/ajustar components/inventory/InventoryDetailSheet.tsx para detalle; sin lógica de acceso a datos.
- [x] Tarea 2.5.1 (Orquestación de UI): Refactorizar `InventoryClient.tsx` para que gestione el estado de la UI (producto seleccionado, panel de detalle abierto) e integre completamente la `Toolbar`, la `Table` y el `DetailSheet`.
- [x] Tarea 2.6 (Diálogo Crear): Crear `components/inventory/CreateProductDialog.tsx` usando `useCreateProduct` y toasts; Optimistic UI + revalidación.
- [x] Tarea 2.7 (Zustand Preferencias): Centralizar preferencias de columnas en store (si no existe, crear) y usarlas desde Toolbar/Tabla.
- [x] Tarea 2.8 (Anti‑Corruption opcional): Si algún subcomponente legacy lo exige, crear `lib/api/adapters/inventory.legacy.ts` con `toLegacyInventoryItem()` y usarlo solo en el borde RSC. Registrar issue con kill‑date.
- [x] Tarea 2.9 (SWR integración): Estándar de claves: `inventoryKeys` (las claves deben incluir los `params` de lista); usar `fallbackData` en cliente en caso de SSR hydrate; evitar doble caché.
- [x] Tarea 2.10 (Loading/Errores UX): Añadir `app/(app)/inventario-v2/loading.tsx` (skeletons) y `app/(app)/inventario-v2/error.tsx` (degradación elegante con reintento); evitar spinners largos.
- [x] Tarea 2.11 (Tests — UI): Component tests (RTL) para Toolbar/Tabla/Dialog; mocks de hooks. Ubicación sugerida: `components/inventory/__tests__/`.
- [x] Tarea 2.12 (E2E — Flujos): Playwright para crear/editar/eliminar/filtrar/paginar; smoke suite en CI.
- [ ] Tarea 2.13 (Criterio de salida): Paridad funcional con la ruta legacy, sin dependencias a `hooks/useInventory.ts` ni a `types/inventory.ts` en v2.
- [ ] Tarea 2.14 (SSR — Cookies/Fetch): Si `NEXT_PUBLIC_API_URL` es cross‑origin, definir estrategia para SSR con cookies en RSC: preferir un Route Handler proxy (server‑side) o configurar `fetch` con `credentials: 'include'` y política de cookies adecuada; integrar `next: { tags: ['inventory'] }`/`revalidate` y documentar la decisión.

// ——— Alcance de Paridad Funcional (Expansión Fase 2) ———
- [ ] Tarea 2.15 (Filtros Avanzados): Implementar controles y lógica para filtros avanzados (fecha de compra desde/hasta, proveedor, contratoId, costo mínimo/máximo, hasSerialNumber, locationId). Los filtros deben ser derivados exclusivamente de `searchParams` y reflejarse en la URL.
- [ ] Tarea 2.16 (Diálogo Editar): Crear `components/inventory/EditProductDialog.tsx` con formulario completo para todos los campos editables definidos en el PRD; validar con Zod y revalidar claves/tags al guardar.
- [ ] Tarea 2.17 (Flujo Eliminar): Implementar soft‑delete con diálogo de confirmación, respetando la Política de Borrado Unificada del PRD; excluir elementos eliminados de vistas por defecto y revalidar claves/tags.
- [ ] Tarea 2.18.1 (UI de Selección): Implementar en `InventoryTable` la selección múltiple (grupos “stack” y serializados) y contador de ítems/selección parcial.
- [ ] Tarea 2.18.2 (Acción — Asignar en Lote): Implementar diálogo y lógica para asignación masiva con validaciones de rol/estado; invalidar/revalidar datos.
- [ ] Tarea 2.18.3 (Acción — Prestar en Lote): Implementar diálogo y lógica para préstamo masivo con validaciones de rol/estado; invalidar/revalidar datos.
- [ ] Tarea 2.18.4 (Acción — Retirar en Lote): Implementar diálogo y lógica para marcar Pendiente de Retiro en lote; invalidar/revalidar datos.
- [ ] Tarea 2.19 (Importación CSV): Implementar UI y lógica para importar CSV con validación Zod, manejo de errores amigable y actualización de lista tras ingestión.
- [ ] Tarea 2.20 (Docs — SSR): Actualizar `docs/04-frontend-architecture.md` documentando la política de “Propagación Directa de Cookies” en SSR con snippet y consideraciones operativas.

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

