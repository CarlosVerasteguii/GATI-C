# Plan de Refactorización del Módulo de Inventario

**Autor:** Arquitecto Gemini Code Assist
**Fecha:** 14 de septiembre de 2025
**Estado:** Propuesta

---

## 1. Diagnóstico y Auditoría

Tras una revisión exhaustiva del código fuente y la documentación, se confirma que el módulo de inventario presenta una deuda técnica crítica que impide su mantenibilidad y evolución.

- **Desalineación del Contrato de Datos:** El frontend (`types/inventory.ts`) utiliza un contrato en español con mapeo manual (`nombre`, `numeroSerie`), mientras que el backend y la fuente de verdad (`prisma.schema`) utilizan un contrato canónico en inglés (`name`, `serialNumber`). Esto introduce una capa de traducción frágil y propensa a errores.
- **Violación de la Arquitectura de Datos:** El hook `hooks/useInventory.ts` ignora la capa de API formal (`lib/api`), utilizando una URL de localhost hardcodeada y realizando una transformación de datos manual. Esto viola directamente las directrices de `docs/04-frontend-architecture.md`.
- **Componente Monolítico ("God Component"):** El componente `app/(app)/inventario/page.tsx` es un componente de cliente de más de 800 líneas que centraliza toda la lógica: gestión de estado, filtros, ordenamiento, paginación, y la lógica de renderizado de la UI. Esto lo hace extremadamente difícil de entender, depurar y modificar.
- **Incumplimiento del Patrón RSC-first:** Al ser un componente `use client` monolítico, se pierden todas las ventajas de rendimiento y simplicidad que ofrecen los React Server Components para la carga inicial de datos.

## 2. Filosofía de Refactorización

Este plan adopta un enfoque pragmático y de bajo riesgo, basado en los siguientes principios:

- **Patrón Strangler Fig (Higuera Estranguladora):** No se reescribirá el módulo existente en un solo paso. En su lugar, construiremos la nueva arquitectura en paralelo y la integraremos de forma incremental, permitiendo que el sistema siga funcionando durante la transición.
- **Alineación Arquitectónica Radical:** Todas las nuevas piezas de código se adherirán estrictamente a los patrones definidos en `docs/04-frontend-architecture.md`. No habrá excepciones.
- **Compleción por Fases:** El plan se divide en fases atómicas. Cada fase entrega un valor concreto y deja el sistema en un estado estable, permitiendo la revisión y validación antes de continuar.

## 3. Plan de Refactorización por Fases

### Fase 0: Cimientos y Contrato de Datos

**🎯 Objetivo:** Establecer la base no disruptiva para la nueva arquitectura, introduciendo el contrato de datos canónico y la capa de API correcta.

**📦 Archivos Clave:**
- `types/generated/` (Validar/Ajustar)
- `lib/api/inventory.ts` (Crear)
- `lib/api/hooks/useInventoryAPI.ts` (Crear)

**🛠️ Acciones Detalladas:**
1.  **Validar Tipos Canónicos:** Asegurar que el generador `prisma-zod-generator` en `backend/prisma/schema.prisma` está funcionando y los tipos actualizados del backend (ej. `Product`, `Category`, `Brand`) están disponibles en el frontend en la carpeta `types/generated`. Estos serán nuestros únicos tipos de ahora en adelante.
2.  **Crear Capa de API Formal:** Crear `lib/api/inventory.ts`. Este archivo contendrá funciones para interactuar con los endpoints del API de inventario del backend (ej. `getInventory`, `getProductById`, `updateProduct`). Estas funciones usarán el wrapper `fetch` del proyecto y manejarán la comunicación, pero no la gestión de estado.
3.  **Crear Hooks de Datos SWR:** Crear `lib/api/hooks/useInventoryAPI.ts`. Este archivo contendrá los nuevos hooks SWR (ej. `useInventoryList`, `useProductDetail`) que consumirán las funciones de la capa de API (`lib/api/inventory.ts`). Estos hooks reemplazarán al antiguo `hooks/useInventory.ts`.

### Fase 1: Construcción del Nuevo Shell (El "Strangler")

**🎯 Objetivo:** Crear la nueva estructura de la página de inventario como un React Server Component (RSC), completamente aislada de la implementación anterior.

**📦 Archivos Clave:**
- `app/(app)/inventario-v2/page.tsx` (Crear)
- `components/inventory/v2/inventory-client-shell.tsx` (Crear)
- `components/inventory/v2/inventory-table.tsx` (Crear)
- `components/inventory/v2/inventory-toolbar.tsx` (Crear)

**🛠️ Acciones Detalladas:**
1.  **Crear Ruta Temporal:** Crear una nueva ruta `app/(app)/inventario-v2/`. Esto nos da un sandbox para construir la nueva versión sin afectar a los usuarios.
2.  **Página RSC:** `inventario-v2/page.tsx` será un **Server Component** por defecto. Su única responsabilidad será obtener los datos iniciales del inventario llamando directamente a la nueva función `getInventory()` de `lib/api/inventory.ts`.
3.  **Pasar Datos al Cliente:** El RSC (`page.tsx`) pasará los datos iniciales como props a un componente cliente.
4.  **Crear el Shell de Cliente:** Crear `components/inventory/v2/inventory-client-shell.tsx`. Este componente estará marcado con `'use client'` y recibirá los datos iniciales. Será el dueño de toda la interactividad y el estado del lado del cliente (filtros, selección, paginación).
5.  **Componentes Descompuestos:** Crear los componentes "tontos" iniciales, como `inventory-table.tsx` y `inventory-toolbar.tsx`, que simplemente reciben props y renderizan la UI. Estos componentes utilizarán los **tipos canónicos** de `types/generated`.

### Fase 2: Migración de Lógica y Funcionalidad

**🎯 Objetivo:** Reimplementar la funcionalidad de la interfaz de usuario del antiguo componente monolítico en la nueva estructura descompuesta.

**📦 Archivos Clave:**
- `components/inventory/v2/*` (Modificar)
- `components/edit-product-modal.tsx` (Refactorizar o Recrear)
- `lib/api/inventory.ts` (Ampliar)

**🛠️ Acciones Detalladas:**
1.  **Lógica de la Tabla:** Migrar la lógica de renderizado de columnas y filas a `inventory-table.tsx`.
2.  **Lógica de la Barra de Herramientas:** Migrar la búsqueda, los filtros y los botones de acción a `inventory-toolbar.tsx`. El estado de los filtros vivirá en `inventory-client-shell.tsx`.
3.  **Mutaciones de Datos:** Refactorizar los modales (`edit-product-modal.tsx`, etc.) para que:
    - Utilicen los tipos canónicos.
    - Llamen a las nuevas funciones de mutación de la capa de API (`lib/api/inventory.ts`), que a su vez serán consumidas por hooks de mutación SWR en `lib/api/hooks/useInventoryAPI.ts`.
    - Al completarse una mutación, se revalidarán los datos SWR para actualizar la UI automáticamente.
4.  **Eliminar Dependencias Antiguas:** A medida que la funcionalidad se migra, se eliminarán progresivamente las dependencias al antiguo `hooks/useInventory.ts` y a los tipos en `types/inventory.ts`.

### Fase 3: El Cambio y la Limpieza Final

**🎯 Objetivo:** Desactivar la implementación antigua y promover la nueva como la versión oficial. Eliminar toda la deuda técnica asociada.

**📦 Archivos Clave:**
- `app/(app)/inventario/page.tsx` (Reemplazar)
- `app/(app)/inventario-v2/` (Eliminar)
- `hooks/useInventory.ts` (Eliminar)
- `types/inventory.ts` (Eliminar)

**🛠️ Acciones Detalladas:**
1.  **El Cambio (The Switch):**
    - Renombrar `app/(app)/inventario/page.tsx` a `page.tsx.deprecated`.
    - Mover el contenido de `app/(app)/inventario-v2/` a `app/(app)/inventario/`.
    - Renombrar la carpeta `components/inventory/v2` a `components/inventory/refactored` (o simplemente `inventory`).
2.  **Validación Final:** Realizar una prueba de regresión completa en la nueva ruta `/inventario` para asegurar que toda la funcionalidad se ha preservado.
3.  **Eliminación de Código Muerto:** Una vez validado, eliminar de forma segura los siguientes archivos y carpetas:
    - `app/(app)/inventario/page.tsx.deprecated`
    - La carpeta `app/(app)/inventario-v2/` si aún existe.
    - El hook `hooks/useInventory.ts`.
    - El archivo de tipos obsoleto `types/inventory.ts`.
4.  **Celebración:** El equipo celebra la eliminación de una pieza significativa de deuda técnica.

## 4. Estado Post-Refactorización

Al finalizar este plan, el módulo de inventario:

- Estará **100% alineado** con la arquitectura de la aplicación.
- Utilizará un **contrato de datos único y canónico**, eliminando la necesidad de mapeos manuales.
- Estará compuesto por **componentes pequeños, mantenibles y testeables**.
- Aprovechará **React Server Components** para un rendimiento de carga óptimo.
- Tendrá una **capa de API clara y desacoplada**, facilitando futuras modificaciones.
