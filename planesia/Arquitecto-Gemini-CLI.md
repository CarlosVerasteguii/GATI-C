# Plan de Refactorización del Módulo de Inventario

**ID de Plan:** `refactor-inventory-20250914-gemini`
**Autor:** Arquitecto Gemini CLI
**Fecha:** 14 de Septiembre, 2025
**Resumen Ejecutivo:** Este plan detalla la refactorización del módulo de inventario para alinearlo con la arquitectura definida, eliminar la deuda técnica y establecer una base sólida y mantenible. La estrategia se basa en el patrón *Strangler Fig*, introduciendo gradualmente la nueva arquitectura (RSC, capa de API formal) mientras se mantiene la funcionalidad, para finalmente dar de baja los componentes y contratos de datos obsoletos.

---

## 1. Justificación Arquitectónica

La auditoría confirma los hallazgos iniciales:

1.  **Contrato de Datos Desincronizado:** `types/inventory.ts` define un contrato en español y con una estructura que no coincide con la del backend, forzando un mapeo manual propenso a errores en `hooks/useInventory.ts`.
2.  **Obtención de Datos Heredada:** `hooks/useInventory.ts` utiliza `useSWR` con una URL hardcodeada (`http://localhost:3001`) y realiza una transformación de datos en el cliente. Esto viola el patrón de capa de API definido en `docs/04-frontend-architecture.md` y acopla el frontend a un entorno de desarrollo específico.
3.  **Componente Monolítico (God Component):** `app/(app)/inventario/page.tsx` es un macro-componente de cliente (`"use client"`) que gestiona toda la lógica de estado, filtros, paginación, modales y renderizado, haciéndolo extremadamente difícil de mantener y razonar.
4.  **Violación del Patrón RSC-First:** La página principal de inventario es un componente de cliente, perdiendo los beneficios de rendimiento y simplicidad de los React Server Components (RSC) para la obtención de datos inicial.

La estrategia propuesta es el **Patrón Strangler Fig**. No reescribiremos todo de una vez. En su lugar, construiremos la nueva estructura (la "enredadera") alrededor del código existente (el "árbol"). El nuevo código interceptará y gestionará gradualmente las responsabilidades del código antiguo, permitiendo una migración segura y por fases hasta que el código antiguo pueda ser eliminado sin riesgo.

---

## 2. Plan de Refactorización por Fases

### Fase 0: Cimientos - Contrato Canónico y Capa de API

**Objetivo:** Establecer la fuente de verdad para los datos y un mecanismo de acceso a ellos que cumpla con la arquitectura. Esta fase no es disruptiva.

**Archivos Clave:**
*   `lib/api/inventory.schemas.ts` (NUEVO)
*   `lib/api/inventory.endpoints.ts` (NUEVO)
*   `lib/api/hooks/useInventoryApi.ts` (NUEVO)
*   `types/generated/inventory.ts` (ASUMIDO EXISTENTE, si no, crear)

**Acciones Detalladas:**

1.  **Definir Schemas Canónicos:** En `lib/api/inventory.schemas.ts`, crear schemas de Zod que representen la respuesta **real** del backend (inglés, camelCase, tal como viene de la API). Esto servirá como el contrato validado.
    ```typescript
    // lib/api/inventory.schemas.ts
    import { z } from 'zod';

    export const inventoryItemSchema = z.object({
      id: z.number(),
      name: z.string(),
      serialNumber: z.string().nullable(),
      brand: z.object({ id: z.number(), name: z.string() }).nullable(),
      category: z.object({ id: z.number(), name: z.string() }).nullable(),
      // ... resto de campos del backend
      createdAt: z.string().datetime(),
      purchaseDate: z.string().datetime().nullable(),
    });

    export const getInventoryResponseSchema = z.array(inventoryItemSchema);
    ```
2.  **Crear Endpoints de API:** En `lib/api/inventory.endpoints.ts`, crear funciones para interactuar con la API del inventario. Estas funciones usarán el cliente HTTP base (que debe estar en `lib/api/http.ts`) y validarán las respuestas con los schemas de Zod.
    ```typescript
    // lib/api/inventory.endpoints.ts
    import { http } from '@/lib/api/http';
    import { getInventoryResponseSchema } from './inventory.schemas';

    export const inventoryApi = {
      getInventory: async () => {
        const response = await http.get('/inventory'); // Usa baseURL del cliente http
        return getInventoryResponseSchema.parse(response.data);
      },
      // ... otras funciones como createProduct, updateProduct, etc.
    };
    ```
3.  **Crear Hooks de SWR:** En `lib/api/hooks/useInventoryApi.ts`, crear los hooks que los componentes de cliente usarán para el fetching y las mutaciones, siguiendo el patrón de `docs/04-frontend-architecture.md`.
    ```typescript
    // lib/api/hooks/useInventoryApi.ts
    import useSWR from 'swr';
    import { inventoryApi } from '../inventory.endpoints';

    const inventoryKeys = {
      all: ['inventory'] as const,
      list: (filters: any) => [...inventoryKeys.all, filters] as const,
    };

    export const useInventory = (filters = {}) => {
      return useSWR(inventoryKeys.list(filters), () => inventoryApi.getInventory());
    };
    ```

### Fase 1: Adopción de RSC y Anti-Corruption Layer

**Objetivo:** Transformar la página de inventario en un RSC para la carga inicial de datos y crear una capa de adaptación para que los componentes cliente existentes puedan funcionar temporalmente con el nuevo modelo de datos.

**Archivos Clave:**
*   `app/(app)/inventario/page.tsx` (MODIFICADO)
*   `lib/adapters/inventory.adapter.ts` (NUEVO)

**Acciones Detalladas:**

1.  **Crear un Adaptador (Anti-Corruption Layer):** En `lib/adapters/inventory.adapter.ts`, crear una función que convierta el nuevo tipo de dato canónico (inglés) al tipo de dato heredado (`InventoryItem` en español).
    ```typescript
    // lib/adapters/inventory.adapter.ts
    import { InventoryItem as LegacyInventoryItem } from '@/types/inventory';
    import { z } from 'zod';
    import { inventoryItemSchema } from '@/lib/api/inventory.schemas';

    type CanonicalInventoryItem = z.infer<typeof inventoryItemSchema>;

    export function toLegacyInventoryItem(item: CanonicalInventoryItem): LegacyInventoryItem {
      return {
        id: item.id,
        nombre: item.name,
        numeroSerie: item.serialNumber,
        marca: item.brand?.name ?? '',
        modelo: '', // Campo ausente en el nuevo contrato
        categoria: item.category?.name ?? '',
        // ... mapeo del resto de campos
      };
    }
    ```
2.  **Refactorizar `page.tsx` a RSC:**
    *   Eliminar el `"use client";`.
    *   Convertir el componente en `async function InventarioPage()`.
    *   Llamar a la nueva capa de API (`inventoryApi.getInventory()`) para obtener los datos en el servidor.
    *   **Importante:** Mover todo el contenido del return actual a un nuevo componente cliente.
    *   Pasar los datos obtenidos en el servidor (y adaptados al formato antiguo) como prop a este nuevo componente cliente.

    ```tsx
    // app/(app)/inventario/page.tsx (AHORA UN RSC)
    import { inventoryApi } from '@/lib/api/inventory.endpoints';
    import { toLegacyInventoryItem } from '@/lib/adapters/inventory.adapter';
    import { InventoryClientPage } from './_components/InventoryClientPage'; // Componente nuevo

    export default async function InventarioPage() {
      const canonicalData = await inventoryApi.getInventory();
      const legacyData = canonicalData.map(toLegacyInventoryItem);

      return <InventoryClientPage initialData={legacyData} />;
    }
    ```

### Fase 2: Descomposición del Componente Cliente

**Objetivo:** Desmantelar el "componente dios" cliente en unidades lógicas y manejables.

**Archivos Clave:**
*   `app/(app)/inventario/_components/InventoryClientPage.tsx` (NUEVO)
*   `app/(app)/inventario/_components/InventoryToolbar.tsx` (NUEVO)
*   `app/(app)/inventario/_components/InventoryTableWrapper.tsx` (NUEVO)

**Acciones Detalladas:**

1.  **Crear `InventoryClientPage.tsx`:** Mover toda la lógica y JSX del `page.tsx` original a este nuevo archivo. Debe ser un componente cliente (`"use client"`) que acepte `initialData` como prop.
2.  **Extraer la Barra de Herramientas:** Crear `InventoryToolbar.tsx`. Mover toda la lógica de búsqueda, filtros, y botones de acción (`Añadir Producto`, `Importar`) a este componente. La comunicación con la tabla se puede manejar a través de un estado local elevado en `InventoryClientPage` o un context provider acotado.
3.  **Extraer la Lógica de la Tabla:** Crear `InventoryTableWrapper.tsx`. Este componente contendrá la `GroupedInventoryTable` y la lógica de paginación, selección y ordenamiento. Recibirá los datos filtrados como prop.
4.  **Refactorizar `InventoryClientPage.tsx`:** Su rol se reduce a ser un orquestador que:
    *   Recibe `initialData`.
    *   Gestiona el estado de los filtros.
    *   Filtra los datos y los pasa al `InventoryTableWrapper`.
    *   Renderiza `InventoryToolbar` y `InventoryTableWrapper`.

### Fase 3: Deprecación y Limpieza Final

**Objetivo:** Eliminar todo el código heredado que ha sido reemplazado.

**Archivos Clave:**
*   `hooks/useInventory.ts` (ELIMINAR)
*   `types/inventory.ts` (ELIMINAR o reducir drásticamente)
*   `lib/adapters/inventory.adapter.ts` (ELIMINAR)

**Acciones Detalladas:**

1.  **Refactorizar Componentes Cliente a Tipos Canónicos:** Modificar `InventoryClientPage` y sus hijos para que usen el nuevo hook `useInventory` (de la Fase 0) y consuman los datos con el contrato canónico en inglés.
2.  **Eliminar el Adaptador:** Una vez que ningún componente dependa de la estructura de datos heredada, el archivo `inventory.adapter.ts` puede ser eliminado.
3.  **Eliminar el Hook Heredado:** Reemplazar cualquier uso residual del antiguo `useInventory` de `hooks/useInventory.ts` con el nuevo de `lib/api/hooks/useInventoryApi.ts`. Una vez hecho, eliminar `hooks/useInventory.ts`.
4.  **Eliminar el Contrato Heredado:** Buscar todas las importaciones de `types/inventory.ts`. Reemplazarlas con los tipos inferidos de los schemas de Zod. Una vez que no queden referencias, eliminar `types/inventory.ts`.
5.  **Limpieza Final:** Eliminar la prop `initialData` de `InventoryClientPage` y hacer que obtenga sus datos exclusivamente del nuevo hook `useInventory`. La página RSC (`page.tsx`) ahora solo renderizará el componente cliente sin pasarle datos.

---

## 3. Conclusión

Este plan de tres fases transforma el módulo de inventario de un monolito frágil a un sistema modular, alineado con la arquitectura y fácil de mantener. El uso del patrón Strangler Fig garantiza una transición con bajo riesgo, manteniendo la aplicación funcional en todo momento.
