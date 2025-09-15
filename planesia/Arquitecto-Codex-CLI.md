# Plan Maestro de Refactorización — Módulo de Inventario (Frontend)

Autor: Arquitecto Codex CLI  
Proyecto: GATI‑C  
Fecha: 2025‑09‑14

---

## 1) Veredicto y Resumen

**VEREDICTO:** REQUIERE REFACTORIZACIÓN

**RESUMEN DE LA ARQUITECTURA:** El módulo de Inventario presenta un “componente dios” marcado como cliente, un contrato de datos en español y snake_case desalineado con los tipos canónicos de Prisma (inglés, camelCase), y una capa de datos ad‑hoc (URLs hardcodeadas, mapeos manuales) que ignora la capa de API formal definida en `docs/04-frontend-architecture.md`. La mantenibilidad, la testabilidad y la coherencia se ven comprometidas.

---

## 2) Diagnóstico con Evidencia

A continuación, los hallazgos principales según los principios: Mínima Sorpresa, Responsabilidad Única y Evidencia Concreta.

### 2.1 Anti‑patrones de Fetching y Contrato de Datos

- PATRÓN VIOLADO: Validación en la Frontera, Consistencia de Contrato, Capas de Aplicación (API formal)
- EVIDENCIA: `hooks/useInventory.ts:41–44`
```ts
const { data, error, isLoading, mutate } = useSWR<ApiResponse<any[]>>(
    'http://localhost:3001/api/v1/inventory',
    fetcher
);
```
Impacto: URL hardcodeada, uso de `any[]`, y ausencia de capa `lib/api/endpoints` + `lib/api/hooks`. No hay validación por Zod ni tipado canónico.

- PATRÓN VIOLADO: Alineación con tipos canónicos de Prisma
- EVIDENCIA: `hooks/useInventory.ts:10–19,27–36`
```ts
function mapBackendToFrontend(backendProduct: any) {
  return {
    nombre: backendProduct.name,
    numeroSerie: backendProduct.serial_number ?? null,
    categoria: backendProduct.category?.name ?? '',
    fechaAdquisicion: backendProduct.purchase_date ? ... : undefined,
    ...
  }
}
```
Impacto: Mapeo manual y mezcla de `snake_case` (p.ej. `serial_number`, `purchase_date`) con propiedades en español. Se contradice la directiva “La Verdad es Única y Automatizada” (tipos generados de Prisma: `serialNumber`, `purchaseDate`).

- PATRÓN VIOLADO: Contrato de creación no canónico
- EVIDENCIA: `lib/api/inventory.ts:4–18`
```ts
export interface CreateProductData {
  nombre: string;
  marca: string;
  modelo: string;
  numeroSerie?: string | null;
  categoria: string;
  ...
}
```
Impacto: El contrato de mutación usa nombres en español, rompiendo la consistencia con Prisma y el backend.

### 2.2 “Componente dios” y mezcla de responsabilidades

- PATRÓN VIOLADO: Responsabilidad Única, RSC‑first
- EVIDENCIA: `app/(app)/inventario/page.tsx:1`
```ts
"use client"
```
Impacto: La página completa es cliente, contraviniendo el patrón RSC por defecto. Mezcla fetching, transformación, filtros, paginación, preferencia de columnas, UI, y modales en un único archivo de >1500 líneas.

- PATRÓN VIOLADO: Separación de capas (UI vs. Transformación de datos)
- EVIDENCIA: `app/(app)/inventario/page.tsx` (múltiples bloques)
  - Agrupación/derivación dentro de la página (p.ej. `groupedData`, `groupedAndFilteredData`).
  - Gestión de estado complejo (filtros, paginación, ordenaciones) acoplada a JSX.
Impacto: Dificulta pruebas, evolutividad y reutilización. Debería estar en utilidades/transformers y componentes cliente más pequeños.

### 2.3 Tipos legados en español

- PATRÓN VIOLADO: Alineación con contrato canónico
- EVIDENCIA: `types/inventory.ts:10–38,56–76`
```ts
export interface InventoryItem {
  id: number;
  nombre: string;
  marca: string;
  modelo: string;
  numeroSerie: string | null;
  categoria: string;
  ...
}

export interface GroupedProduct { /* ... campos en español ... */ }
```
Impacto: Los tipos UI y de dominio están en español y mezclados, generando fricción con el backend y Prisma (`types/generated`).

---

## 3) Objetivo Estratégico de la Refactorización

- Alineación total con el contrato canónico (inglés, camelCase) generado desde Prisma.
- RSC‑first: páginas como Server Components, con interactividad encapsulada en componentes cliente hoja.
- Capa de API formal en `lib/api/` (http wrapper, endpoints, hooks SWR, Zod en frontera).
- Descomposición del “componente dios” en vistas y componentes con responsabilidades claras.
- Erradicación de URLs hardcodeadas, mapeos manuales y `any`.

---

## 4) Plan por Fases (Strangler Fig incremental)

Estrategia: Implementar “Strangler Fig” para coexistir con el código viejo durante la transición, minimizando riesgo y tiempo fuera de servicio. Cada fase deja el sistema utilizable y testeable.

### Fase 0 — Base de Contrato y Adaptadores
- Objetivo: Estabilizar el contrato canónico y proveer adaptadores temporales.
- Archivos clave (nuevos/modificados):
  - `lib/api/adapters/inventory.ts` (nuevo): adaptadores `toCanonicalProduct`, `fromLegacyCreateProduct`.
  - `lib/api/schemas.ts` (extender): Zod schemas de request/response de Inventory (REST), apoyados en `types/generated` donde aplique.
  - `lib/api/http.ts` (extender): soporte de `baseURL`, `next`, `cache`, y mapeo de errores coherente.
- Acciones:
  - Definir modelos REST canónicos en Zod (p.ej. `ProductRead`, `ProductCreate`, `ProductUpdate`) en inglés/camelCase.
  - Crear adaptadores que traduzcan temporalmente respuestas legacy (snake_case) a canónicas mientras el backend se sincroniza.
  - Unificar `baseURL` desde `process.env.NEXT_PUBLIC_API_URL` y erradicar URLs hardcodeadas.

### Fase 1 — Capa de API formal para Inventory
- Objetivo: Centralizar acceso a datos y validación.
- Archivos clave:
  - `lib/api/endpoints/inventory.ts` (nuevo): `listProducts`, `getProduct`, `createProduct`, `updateProduct`, etc.
  - `lib/api/hooks/use-inventory.ts` (nuevo): SWR para listas con `keygen`, `fetcher` tipado y validado.
  - `lib/api/hooks/use-create-product.ts` (nuevo): mutación + invalidación de keys/tags.
- Acciones:
  - Implementar `keygen` consistente (p.ej. `keygen.inventory.list(params)`), usar `swr`/`swr/mutation`.
  - Validar respuestas con Zod; en caso de mismatch, loggear y “fail fast” en desarrollo.
  - Reemplazar progresivamente `hooks/useInventory.ts` por `lib/api/hooks/use-inventory.ts`.

### Fase 2 — RSC‑first y partición de la vista
- Objetivo: Convertir la página a RSC y extraer interactividad.
- Archivos clave:
  - `app/(app)/inventario/page.tsx` (modificar): convertir a Server Component; `export const revalidate`/`fetch` con `next: { tags: ["inventory"] }`.
  - `app/(app)/inventario/error.tsx` (nuevo): manejo de error por ruta.
  - `components/inventory/inventory-page.client.tsx` (nuevo): componente cliente coordinador (estado de filtros, selección, llamadas a hooks).
  - `components/inventory/filter-bar.client.tsx` (nuevo): barra de búsqueda/filtros.
  - `components/inventory/transformers.ts` (nuevo): derivaciones puras (grouping, sorting) sin JSX.
- Acciones:
  - Eliminar `"use client"` de `page.tsx`; hacer fetch en servidor (prefetch inicial) y pasar `initialData` a SWR.
  - Mover la lógica de filtros, ordenamiento, paginación y grouping a helpers/transformers reutilizables.
  - Mantener `loading.tsx` existente; agregar `error.tsx` local.

### Fase 3 — Mutaciones y formularios
- Objetivo: Normalizar creación/edición y coherencia de invalidación.
- Archivos clave:
  - `lib/api/hooks/use-create-product.ts` (ya en Fase 1) y análogos para update/delete.
  - `components/inventory/edit-product-modal.client.tsx` (extraer de `page.tsx` si aplica).
  - `app/(app)/inventario/actions.ts` (opcional): Server Actions para flujos simples.
- Acciones:
  - Reemplazar `createProductAPI` legacy por hook tipado con invalidación de `keygen.inventory.all()`/`tags`.
  - Validar payloads con Zod (`ProductCreateSchema`).

### Fase 4 — Migración tipada + limpieza
- Objetivo: Extirpar deuda técnica y españolización en dominio.
- Archivos clave:
  - `types/inventory.ts` (eliminar o mover a `types/legacy/` y reemplazar por `types/contracts/` canónicos si se requieren tipos UI).
  - `hooks/useInventory.ts` (eliminar tras adopción completa del nuevo hook).
  - Componentes y utilidades que consumen tipos en español (actualizar imports y propiedades).
- Acciones:
  - Migrar props y estados a nombres en inglés/camelCase (`name`, `brand`, `model`, `serialNumber`, `category`, `status`, `quantity`, `purchaseDate`, etc.).
  - Mantener adaptadores de Strangler hasta completar la migración; luego eliminarlos.

### Fase 5 — Consolidación y hardening
- Objetivo: Estabilizar, documentar y prevenir regresiones.
- Archivos clave:
  - `docs/04-frontend-architecture.md` (no modificar, pero verificar cumplimiento).
  - README corto en `lib/api/endpoints/` describiendo contractos y tags.
  - Pruebas unitarias de transformers (Vitest): `components/inventory/__tests__/transformers.test.ts`.
- Acciones:
  - Auditar que no quede ningún `fetch/axios` directo en UI.
  - Confirmar RSC‑first en páginas, “use client” sólo en componentes hoja.
  - Verificar invalidación por `tags` y coherencia de keys SWR.

---

## 5) Cambios Concretos por Archivo (primeras iteraciones)

- Eliminar deuda: `hooks/useInventory.ts` → reemplazar por `lib/api/hooks/use-inventory.ts`.
- Contrato canónico: `lib/api/inventory.ts` → deprecado; mover a `lib/api/endpoints/inventory.ts` con tipos ingles/camelCase.
- Página: `app/(app)/inventario/page.tsx` → convertir a RSC; delegar UI cliente a `components/inventory/inventory-page.client.tsx` y subcomponentes (`filter-bar.client.tsx`, `grouped-inventory-table.tsx` ya cliente).
- Tipos: `types/inventory.ts` → mover a `types/legacy/` y crear `types/contracts/inventory-ui.ts` (sólo tipos derivados de UI si fueran necesarios; el dominio proviene de Prisma/Zod).

---

## 6) Justificación de Decisiones Arquitectónicas

- Strangler Fig: Permite migrar de español/snake_case a inglés/camelCase sin detener el desarrollo. Adaptadores temporales aíslan el legacy y evitan “big‑bang refactors”.
- RSC‑first: Mejora TTFB, reduce JS en cliente y sigue las guías oficiales del App Router; la interactividad se encapsula en componentes hoja cliente.
- Capa de API formal: Centraliza `baseURL`, manejo de credenciales/errores y validación con Zod; prohíbe `fetch` directo en UI y elimina “mapeos a mano”.
- Tipos canónicos: Prisma + Zod como única fuente de verdad del modelo evita divergencias, reduce `any` y aumenta la auto‑documentación.
- Transformación fuera de la vista: Las derivaciones (grouping/sorting/pagination) como funciones puras mejoran testabilidad y reuso.

---

## 7) Impacto en Mantenibilidad y Riesgos

- Mantenibilidad: Alta mejora. Código modular, contratos estables y validación temprana reducen regresiones.
- Riesgos: Desfase temporal entre backend y frontend (resuelto con adaptadores); cambios de nombres de props en UI (mitigado con migración incremental y TS estricto).

---

## 8) Criterios de Aceptación por Fase

- Fase 0: Existe `lib/api/adapters/inventory.ts`; no hay URLs hardcodeadas; contratos Zod creados.
- Fase 1: `use-inventory.ts` provee `data/error/isLoading` con tipos canónicos; sin `any`.
- Fase 2: `page.tsx` es RSC; lógica de filtros/orden/paginación fuera de JSX; `loading.tsx` y `error.tsx` presentes.
- Fase 3: Mutaciones vía hooks, invalidación por keys/tags; formularios validan payload con Zod.
- Fase 4: Eliminados `hooks/useInventory.ts` y `types/inventory.ts` legacy; componentes consumen nombres en inglés.
- Fase 5: Pruebas de transformers; auditoría confirma “no fetch directo en UI”.

---

## 9) Checklist de Coherencia Arquitectónica

- A. Patrones Estructurales: FALLO → se corrige con API formal + RSC.
- B. Patrones de Código Limpio: FALLO → se corrige con Zod, tipos canónicos y eliminación de `any`.
- C. Consistencia del Módulo: FALLO → se corrige con estructura `endpoints/`, `hooks/`, nombres en inglés y división de componentes.

---

## 10) Hoja de Ruta de Implementación (alta‑nivel)

1. Fase 0 (0.5–1 día): Adaptadores + schemas + http.
2. Fase 1 (0.5–1 día): Endpoints + hooks SWR + sustitución de `useInventory`.
3. Fase 2 (1–1.5 días): RSC de página + extracción de componentes + transformers.
4. Fase 3 (0.5–1 día): Mutaciones tipadas + invalidación.
5. Fase 4 (0.5 día): Limpieza de legacy.
6. Fase 5 (0.5 día): Pruebas y verificación final.

---

## 11) Apéndice: Casos concretos a corregir

- `app/(app)/inventario/page.tsx:1` — eliminar `"use client"` de la página; mover interactividad a componentes cliente.
- `hooks/useInventory.ts:41–44` — eliminar URL hardcodeada y `any[]`; reemplazar por `lib/api/hooks/use-inventory.ts`.
- `hooks/useInventory.ts:10–36` — eliminar mapeo manual; usar adaptador temporal a canónico dentro de la capa de API, no en la UI.
- `lib/api/inventory.ts:4–18` — reemplazar `CreateProductData` en español por schema canónico (`ProductCreate` en inglés/camelCase) dentro de `endpoints/inventory.ts`.
- `types/inventory.ts` — deprecar tipos en español; si se requiere, definir tipos UI derivados en `types/contracts/inventory-ui.ts` (mantener el dominio en Prisma/Zod).

---

## 12) Resultado Esperado

- Módulo de Inventario alineado con tipos canónicos (inglés/camelCase), con página RSC‑first, capa de datos formal en `lib/api/`, y una UI modular sin “componentes dios”. Reducción significativa de deuda técnica y fricción futura.

