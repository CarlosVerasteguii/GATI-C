# Plan Estratégico de Refactorización — Módulo de Inventario (GATI‑C)

Versión: 1.0  
Fecha: 2025-09-15

## Objetivos y Principios

- Coherencia canónica: usar exclusivamente tipos en inglés, camelCase, alineados con Prisma y validados con Zod.
- RSC‑first: `page.tsx` y vistas de solo lectura como Server Components; interactividad en componentes cliente pequeños.
- Capa de API formal: cliente HTTP único, endpoints puros y hooks SWR con claves estables; prohibido `fetch/axios` directo en UI.
- Mínima sorpresa: patrones y nombres predecibles; sin URLs hardcodeadas ni mapeos manuales opacos.
- Migración incremental (Strangler Fig): convivencia controlada hasta retirar el legado con fechas de corte claras.
- Calidad pragmática: pruebas unitarias/integra‑ ción/E2E en flujos críticos, con quality gates en CI.

## Fases de la Refactorización

### Fase 1: Fundación de la API y Contratos
- Objetivo: centralizar obtención/mutación de datos, estandarizar contratos y validación.
- Entregables clave:
  - `lib/api/client.ts` con `baseURL` por `NEXT_PUBLIC_API_URL`, `credentials: 'include'`, manejo de errores; `lib/api/http.ts` puede reexportar.
  - Endpoints puros en `lib/api/endpoints/inventory.ts` (list/get/create/update/delete).
  - Schemas Zod en `lib/api/schemas(*/inventory).ts` para request/response (reutilizando `types/generated` cuando aplique).
  - Hooks SWR en `lib/api/hooks/` con keygen estable e invalidación coherente.
  - `types/view-models/inventory.ts` con `InventoryViewModel` y `toViewModel()` para presentar sin renombrar keys de datos.
- Criterios de salida:
  - Ninguna URL hardcodeada; datos validados; hooks tipados reemplazan al fetching ad‑hoc existente.

### Fase 2: Reconstrucción de la UI en v2 (Sandbox RSC)
- Objetivo: implementar la UI refactorizada sin interrumpir la ruta actual.
- Entregables clave:
  - `app/(app)/inventario-v2/page.tsx` (RSC) + `components/inventory/InventoryClient.tsx` (cliente orquestador).
  - Componentes hoja: `InventoryToolbar.tsx`, `InventoryTable.tsx`, `InventoryDetailSheet.tsx`, `CreateProductDialog.tsx`.
  - Integración de hooks SWR; uso opcional de `fallbackData` para hidratar sin duplicar caché.
  - Anti‑Corruption Layer opcional en el borde RSC (p. ej., `toLegacyInventoryItem`) solo si fuese necesario durante la convivencia.
- Criterios de salida:
  - Paridad funcional con la página legacy; sin dependencias a `hooks/useInventory.ts` ni a tipos en español dentro de v2.

### Fase 3: El Cambio y Limpieza
- Objetivo: promover v2 a oficial y retirar legado/transitorios.
- Entregables clave:
  - Promoción de `inventario-v2` a `app/(app)/inventario/` y eliminación de la ruta anterior.
  - Retiro de `hooks/useInventory.ts`, `types/inventory.ts`, `lib/api/inventory.ts` (español), mocks obsoletos y cualquier adapter temporal.
  - Documentación actualizada y suite de pruebas verde.
- Criterios de salida:
  - Sin referencias al legado; CI con quality gates en verde; cobertura mínima y smoke E2E superados.

## Arquitectura Objetivo

- Tipos y Contratos:
  - Fuente canónica: `types/generated` + schemas Zod en `lib/api/schemas/*`.
  - `InventoryViewModel` solo para necesidades de presentación; prohibido renombrar keys de datos; traducciones en etiquetas de UI.
- Capa de API:
  - `lib/api/client.ts` unificado con manejo de errores y JSON estándar.
  - Endpoints puros en `lib/api/endpoints/inventory.ts`; hooks SWR en `lib/api/hooks` con keygen estable e invalidación (`mutate`) coherente.
- UI (RSC‑first):
  - `page.tsx` como RSC; `InventoryClient` coordina estado cliente mínimo.
  - Zustand únicamente para preferencias cross‑view (p. ej., columnas).
- Anti‑Corruption (opcional y acotado):
  - Solo en el borde RSC; con issue de retiro y fecha de corte definida.
- Pruebas y Calidad:
  - Unit: client/endpoints/schemas/transformers.
  - Component: tabla/toolbar/dialogs (React Testing Library).
  - E2E: flujos críticos (crear/editar/eliminar/filtrar/paginar) con Playwright.
  - Métricas mínimas: cobertura >= 70–80% en módulos críticos; smoke suite en CI.

## Gobernanza y Riesgos

- Quality Gates (CI):
  - Lint (ESLint) y type‑check (TS) obligatorios.
  - Unit tests con cobertura mínima y thresholds por paquete crítico.
  - Playwright smoke suite para rutas y flujos clave.
  - Presupuestos de rendimiento (LCP/TTI) observables al menos en entorno staging.
- Política “kill‑date” (código transitorio):
  - Cada adapter/anti‑corruption y la ruta `inventario-v2` deben crearse con issue de retirada y fecha límite (<= 2 iteraciones). 
  - Revisiones de cumplimiento en cada PR; no se permite posponer sin aprobación del comité técnico.
- Riesgos y mitigación:
  - Doble caché/invalidación: estandarizar keys SWR y preferir `fallbackData` para hidratar.
  - Deriva entre rutas (v2 vs legacy): limitar vida de v2; sincronizar cambios en un solo lugar (hooks/endpoints).
  - “Adapters zombis”: aplicar kill‑date y checks en CI para detectar referencias residuales.

