# Plan de Refactorización del Módulo de Inventario (GATI‑C)

Apodo del autor: Arquitecto Codex Extension  
Versión: 1.0  
Fecha: 2025-09-14

## Resumen Ejecutivo
El módulo de Inventario actual presenta desalineación con el contrato de datos del backend (tipos no canónicos en español, mapeos manuales), un componente página monolítico marcado como cliente, y una capa de datos informal con URLs hardcodeadas. Este plan propone una refactorización por fases para: 1) alinear tipos con Prisma (inglés, camelCase), 2) formalizar la capa API en `lib/api/` con hooks SWR tipados, 3) migrar a un patrón RSC-first separando la vista cliente en componentes pequeños, y 4) eliminar deuda técnica sin sobre‑ingeniería.

---

## Diagnóstico (Auditoría Silenciosa) — Evidencia

- Contrato de datos desalineado y mapeos manuales:
  - `types/inventory.ts:10` define `InventoryItem` con campos en español (p.ej. `nombre`, `categoria`, `fechaIngreso`).
  - `lib/api/inventory.ts:4` declara `CreateProductData` en español y no usa tipos canónicos.
  - `hooks/useInventory.ts:10` función `mapBackendToFrontend` traduce nombres del backend a español; `hooks/useInventory.ts:42` usa URL hardcodeada `http://localhost:3001/api/v1/inventory`.
- Capa API inconsistente/incompleta:
  - `lib/api/http.ts` es un placeholder; no existe cliente formal ni manejo de errores/headers.
  - `hooks/useInventory.ts:2` intenta importar `@/lib/api/client` (inexistente). En raíz existe `api-client.ts` vacío.
- Violación del patrón RSC‑first y “componente dios”:
  - `app/(app)/inventario/page.tsx:1` está marcado como cliente y concentra fetching, estado, filtros, tabla, modales y acciones (700+ líneas).
- Anti‑patrones detectados:
  - URLs hardcodeadas; duplicación de estado y lógica; tipado mixto no canónico; hooks API fuera de `lib/api/hooks`.

Veredicto: REQUIERE REFACTORIZACIÓN.

---

## Objetivos de la Refactorización

- Alinear con contrato canónico: usar exclusivamente tipos derivados de Prisma (inglés, camelCase) y Zod generados (`types/generated`).
- Arquitectura sólida: formalizar `lib/api/` con endpoints y hooks SWR; eliminar fetch directo/hardcode.
- RSC‑first: `page.tsx` como RSC; mover interactividad a componentes cliente pequeños.
- Mantenibilidad: descomponer el componente dios; estados locales bien limitados; Zustand solo para cross‑page.
- Pragmatismo: aplicar Strangler Fig para coexistencia segura del código actual y el nuevo.

---

## Estrategia de Migración (Strangler Fig)

- Convivencia temporal: introducir nuevos endpoints y hooks en `lib/api/endpoints` y `lib/api/hooks` sin romper la UI actual.
- Gradualismo: primero consolidar la capa API y los tipos; luego migrar la página a RSC con un contenedor cliente nuevo; finalmente retirar tipos y hooks legacy.
- Feature toggle implícito: el nuevo `InventoryClient` vive junto a la página actual; el `page.tsx` RSC orquesta y podemos redirigir progresivamente el tráfico/uso interno.

---

## Plan por Fases

### Fase 1 — Capa API base y contratos

Objetivo: centralizar fetch, baseURL y tipos; eliminar hardcode y asegurar parsing.

Archivos clave (nuevos/actualizados):
- `lib/api/client.ts` (nuevo): wrapper de `fetch` con `baseURL = process.env.NEXT_PUBLIC_API_URL`, `credentials: 'include'`, manejo de errores y JSON estándar `{ success, data }`.
- `lib/api/http.ts` (actualizar): reexportar utilidades desde `client.ts` o integrarlas.
- `lib/api/schemas.ts` (extender): registro y utilidades comunes de Zod por recurso.
- `lib/api/endpoints/inventory.ts` (nuevo): funciones puras para `GET /api/v1/inventory`, `POST /api/v1/inventory`, `GET/PUT/DELETE /api/v1/inventory/:id`.

Acciones:
- Implementar `client.ts` con helpers genéricos `get<T>`, `post<TReq, TRes>`, etc., que validen respuesta con Zod cuando aplique.
- Declarar esquemas Zod de respuesta usando los generados canónicos (p.ej. `ProductResultSchema`) o compuestos específicos si la API agrega shape.
- Sustituir el uso de `http://localhost` por `NEXT_PUBLIC_API_URL` en todas las rutas.

Criterios de aceptación:
- Un único punto de entrada para HTTP; sin URLs literales en hooks/páginas.
- Respuestas parseadas/validadas con Zod donde corresponda.

Ejemplo (boceto):
```ts
// lib/api/client.ts
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}` , {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}
export const get = <T>(p: string, i?: RequestInit) => request<T>(p, i)
export const post = <B, T>(p: string, body: B, i?: RequestInit) => request<T>(p, { ...i, method: 'POST', body: JSON.stringify(body) })
```

---

### Fase 2 — Endpoints y hooks SWR tipados (inventario)

Objetivo: mover fetching a `lib/api/` y exponer hooks tipados.

Archivos clave:
- `lib/api/endpoints/inventory.ts` (ampliar): `listProducts`, `createProduct`, `getProduct`, `updateProduct`, `deleteProduct`.
- `lib/api/hooks/use-inventory.ts` (nuevo): hook SWR para listar; usa keygen y `endpoints`.
- `lib/api/hooks/use-create-product.ts` (nuevo): mutación con `useSWRMutation` y `mutate` de la key de lista.

Acciones:
- Definir keygen estable: `list: (p?: ListParams) => ['/api/v1/inventory', p ?? {}] as const`.
- Validar `{ success, data }` y mapear `data` con Zod a `ProductResultType[]`.
- Eliminar hardcode del hook actual; mantenerlo como wrapper temporal si se requiere convivencia.

Criterios de aceptación:
- `useInventory` vive en `lib/api/hooks`, retorna `{ data, error, isLoading }` y no filtra/castea a español.
- Mutaciones invalidan la lista coherentemente.

---

### Fase 3 — Tipos canónicos y VM de UI

Objetivo: dejar de usar tipos en español y derivar un ViewModel de UI de los tipos canónicos.

Archivos clave:
- `types/generated/schemas/variants/result/Product.result.ts` (existente): `ProductResultType`.
- `types/modules/inventory.ts` (nuevo): `InventoryViewModel` (campos de presentación/derivados si son necesarios para la tabla UI) y mapeos puros `toViewModel(product)`.
- Deprecación: `types/inventory.ts` (actual legada) y `lib/mocks/inventory-mock-data.ts` (actualizar nombres o mover a carpeta `_legacy`).

Acciones:
- Minimizar mapeo: mantener nombres canónicos en datos; solo traducir etiquetas en UI (no los keys).
- Reescribir mocks con nombres canónicos si siguen siendo necesarios.

Criterios de aceptación:
- No quedan interfaces de dominio en español; únicamente etiquetas traducidas en componentes.

---

### Fase 4 — RSC‑first para la página de Inventario

Objetivo: convertir `page.tsx` en RSC y mover interactividad a un contenedor cliente pequeño.

Archivos clave:
- `app/(app)/inventario/page.tsx` (rehecho RSC): sin `"use client"`.
- `components/inventory/InventoryClient.tsx` (nuevo, cliente): orquesta filtros, tabla y modales.

Acciones:
- `page.tsx` obtiene datos iniciales (opcional) vía `fetch` RSC y pasa `initialData` al cliente para hidratar SWR (o delega todo a hook cliente según caching deseado).
- Añadir `loading.tsx` con skeletons si no existe o ajustarlo.

Criterios de aceptación:
- `page.tsx` es RSC; la lógica de UI vive en componentes cliente pequeños.

Ejemplo (boceto):
```tsx
// app/(app)/inventario/page.tsx (RSC)
import InventoryClient from '@/components/inventory/InventoryClient'
export default async function Page() {
  return <InventoryClient />
}
```

---

### Fase 5 — Descomposición del “componente dios”

Objetivo: dividir responsabilidades en componentes cohesivos, con props claras.

Archivos clave (nuevos):
- `components/inventory/InventoryToolbar.tsx` (filtros, búsqueda, toggles de columna)
- `components/inventory/InventoryTable.tsx` (presentación + callbacks)
- `components/inventory/InventoryDetailSheet.tsx`
- `components/inventory/CreateProductDialog.tsx`
- `components/inventory/ColumnToggleMenu.tsx` (si no existe consolidado)

Acciones:
- Mover estado local al mínimo necesario por componente.
- Usar Zustand SOLO para preferencias globales (p.ej. columnas) o datos cross‑view.
- Mantener separación UI vs. datos: los componentes consumen hooks de `lib/api/hooks` y no construyen URLs ni parsean respuestas.

Criterios de aceptación:
- Cada componente tiene una única responsabilidad y una API de props estable.

---

### Fase 6 — Mutaciones y revalidación coherente

Objetivo: unificar creación/actualización/eliminación con `useSWRMutation` + invalidación.

Archivos clave:
- `lib/api/hooks/use-create-product.ts`
- `lib/api/hooks/use-update-product.ts`
- `lib/api/hooks/use-delete-product.ts`

Acciones:
- Utilizar llaves de lista para invalidar tras `onSuccess`.
- Optimistic UI: actualizar UI al instante y revertir ante error (toasts ya existentes).

Criterios de aceptación:
- Sin llamados directos a `fetch` desde la UI; mutaciones siguen un patrón único.

---

### Fase 7 — Limpieza y retiro del legado

Objetivo: eliminar tipos y hooks no canónicos; retirar mocks obsoletos.

Archivos clave:
- Eliminar/archivar: `types/inventory.ts`, `hooks/useInventory.ts`, `lib/api/inventory.ts` (español), `lib/mocks/inventory-mock-data.ts` (si aplica).

Acciones:
- Actualizar imports en toda la app para usar los nuevos hooks y tipos.
- Ejecutar una pasada de ESLint/TS para detectar usos restantes.

Criterios de aceptación:
- No quedan referencias al legado; compilación limpia.

---

### Fase 8 — Documentación y verificación

Objetivo: alinear docs y asegurar que el módulo cumple los patrones de `docs/`.

Archivos clave:
- `docs/04-frontend-architecture.md` (referencias a ejemplos actualizados)
- README breve en `lib/api/` explicando layout (opcional)

Acciones:
- Documentar keys SWR, contratos, y puntos de invalidación.
- Confirmar que la lista de anti‑patrones queda en cero para el módulo.

Criterios de aceptación:
- Checklist de coherencia en estado OK para el módulo.

---

## Decisiones Arquitectónicas Clave (Justificación)

- Strangler Fig: reduce riesgo de “big bang”; permite migrações seguras con verificación por pasos.
- RSC‑first: mejor rendimiento, menos JS en cliente por defecto; la interactividad se limita a componentes hoja.
- Tipos canónicos: coherencia 1:1 con Prisma; evita mapeos frágiles y mantiene contrato único de verdad.
- Capa API formal: centraliza baseURL, headers, errores y validación; facilita caching e invalidación coherente.
- SWR con keygen estable: simplifica revalidación y evita duplicación de estados de carga/error.
- Validación con Zod en frontera: asegura shape de datos en cliente; evita fallos silenciosos por cambios en backend.

---

## Riesgos y Mitigaciones

- Cambio de nombres de campos (ES → EN):
  - Mitigar con VM (`InventoryViewModel`) y refactors asistidos por TS; planificar PRs pequeños.
- Posibles duplicaciones temporales de componentes:
  - Aislar nuevos componentes en `components/inventory/` y retirar los legacy al final de Fase 7.
- Inconsistencias de caché durante migración:
  - Unificar keys SWR antes de activar las nuevas vistas; usar `mutate` global tras mutaciones.

---

## Hoja de Ruta Operativa (Resumen)

1) Formalizar `lib/api` (Fases 1–2).  
2) Tipos canónicos + VM de UI (Fase 3).  
3) Página RSC + cliente orquestador (Fase 4).  
4) Descomponer componente dios (Fase 5).  
5) Mutaciones coherentes (Fase 6).  
6) Retiro del legado y docs (Fases 7–8).

---

## Checklist de Coherencia (Objetivo tras refactor)

- A. Patrones Estructurales: OK (IoC backend; frontend con capa API formal y separación de capas UI/datos)
- B. Código Limpio: OK (manejo de errores consistente; tipado explícito canónico; validación Zod en frontera)
- C. Consistencia del Módulo: OK (estructura `lib/api/{endpoints,hooks}`; `page.tsx` RSC; nombres predecibles)

---

## Apéndice — Referencias de Código (Evidencia)

- `app/(app)/inventario/page.tsx:1` → "use client" en página (violación RSC‑first).
- `hooks/useInventory.ts:10` → `mapBackendToFrontend` con traducciones de campos.
- `hooks/useInventory.ts:42` → URL hardcodeada `http://localhost:3001/...`.
- `lib/api/inventory.ts:4` → `CreateProductData` en español; uso de `apiClient` inexistente.
- `types/inventory.ts:10` → interfaz de dominio en español (`InventoryItem`).

---

## Cierre
Este plan prioriza claridad, consistencia y mínima sorpresa. Refuerza el contrato único de datos, formaliza la capa API, adopta RSC por defecto y reduce la complejidad del componente principal en piezas cohesivas. La estrategia por fases permite entregar valor continuo con bajo riesgo y facilita la revisión en PRs pequeños.

