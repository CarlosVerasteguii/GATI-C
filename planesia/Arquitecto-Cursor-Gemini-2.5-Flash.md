# Propuesta de Refactorización: Módulo de Inventario (Frontend)

## **Arquitecto Cursor Gemini 2.5 Flash**

### **Contexto y Diagnóstico Inicial**

El módulo de Inventario en el frontend ha sido identificado como un "desastre arquitectónico" debido a varias desviaciones de nuestros principios. Un análisis inicial revela:

1.  **Contrato de Datos Desalineado:** `types/inventory.ts` utiliza nombres en español y una mezcla de `camelCase`/`PascalCase` (`nombre`, `numeroSerie`, `fechaIngreso`), lo cual no se alinea con el contrato canónico del backend (inglés, `camelCase` o `snake_case` según Prisma). `InventoryItem` es un tipo monolítico.
2.  **Componente Dios (`app/(app)/inventario/page.tsx`):** Este componente es un `Client Component` que maneja una excesiva cantidad de estados locales (`useState`), lógica de filtrado, ordenamiento, paginación y agrupamiento, violando el Principio de Responsabilidad Única y el enfoque **RSC-first** de Next.js App Router.
3.  **Capa de Datos Problemática (`hooks/useInventory.ts`):** Contiene URLs `hardcodeadas` (`http://localhost:3001/api/v1/inventory`) y un mapeo manual (`mapBackendToFrontend`) que es una señal clara de la desincronización de tipos con el backend, en lugar de usar la capa de API formal (`lib/api/`).
4.  **Acoplamiento Fuerte:** El componente principal está fuertemente acoplado a la lógica de negocio y a otros contextos (`useApp` para preferencias de usuario y tareas, `useAuthStore` para rol) que deberían ser gestionados de forma más desacoplada.

### **Estrategia de Refactorización: Patrón Strangler Fig**

Para abordar esta refactorización de manera segura y incremental, propongo aplicar el **Patrón Strangler Fig**. Este patrón nos permitirá construir nuevas funcionalidades y componentes que cumplan con la arquitectura deseada, mientras se eliminan gradualmente las partes obsoletas del módulo actual. Esto minimiza el riesgo de una reescritura completa y permite que el sistema permanezca operativo durante la transición.

La coexistencia se manejará encapsulando el código antiguo en un "capullo" temporal o simplemente reemplazándolo por fases, asegurando que las nuevas implementaciones tomen precedencia y se conecten a la interfaz de usuario existente.

---

### **Plan de Refactorización por Fases**

#### **Fase 1: Alineación del Contrato de Datos y Capa de API**

*   **Objetivo:** Establecer un contrato de datos canónico (`PascalCase` para tipos, `camelCase` para propiedades, en inglés) y una capa de API sólida que interactúe directamente con el backend sin transformaciones manuales.
*   **Archivos Clave a Crear/Modificar:**
    *   `types/inventory.ts` (Modificar)
    *   `lib/api/schemas/inventory.ts` (Crear)
    *   `lib/api/endpoints/inventory.ts` (Crear/Modificar)
    *   `lib/api/hooks/useInventory.ts` (Modificar)
    *   `app/(app)/inventario/page.tsx` (Modificar, para usar el nuevo hook)
*   **Acciones Detalladas:**
    1.  **Generación de Tipos Canónicos:** Investigar la posibilidad de generar automáticamente tipos TypeScript directamente desde el `schema.prisma` del backend o desde la especificación OpenAPI (`backend/docs/openapi.yml`). Si no es posible, definir manualmente las interfaces en `types/inventory.ts` para reflejar fielmente la estructura del backend (ej. `InventoryItem` -> `Product`, `brand` en lugar de `marca`).
    2.  **Creación de Schemas Zod:** En `lib/api/schemas/inventory.ts`, definir `Zod schemas` para la validación de entrada y salida (respuesta de la API) de las operaciones del inventario. Esto garantizará la coherencia de los datos y proporcionará un punto de validación centralizado.
    3.  **Implementación de Endpoints:** En `lib/api/endpoints/inventory.ts`, crear funciones puras (sin estado) para cada operación CRUD del inventario (ej. `getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`), utilizando `http.ts` para la comunicación y los `Zod schemas` para la validación.
    4.  **Refactorización de `useInventory.ts`:**
        *   Eliminar la URL `hardcodeada` y el mapeo `mapBackendToFrontend`.
        *   Utilizar las funciones de `lib/api/endpoints/inventory.ts` y los tipos canónicos.
        *   Asegurar que el hook `useSWR` se configure para usar las claves de caché (`SWR keys`) de manera coherente.
    5.  **Actualización de `page.tsx`:** Modificar `app/(app)/inventario/page.tsx` para consumir el nuevo `useInventory.ts` refactorizado. En esta fase, el componente "dios" seguirá existiendo, pero su fuente de datos será limpia y conforme a la arquitectura.

#### **Fase 2: Descomposición de Componentes y Estrategia RSC-First**

*   **Objetivo:** Descomponer el "componente dios" (`page.tsx`) en componentes más pequeños y gestionables, adoptando el enfoque **RSC-first** y moviendo la lógica de datos/filtros al `Server Component` o a `Client Components` específicos y pequeños.
*   **Archivos Clave a Crear/Modificar:**
    *   `app/(app)/inventario/page.tsx` (Modificar, transformándolo en un `Server Component` principal)
    *   `components/inventory/InventoryListServer.tsx` (Crear, `Server Component` para obtener y renderizar la lista inicial)
    *   `components/inventory/InventoryFiltersClient.tsx` (Crear, `Client Component` para filtros interactivos)
    *   `components/inventory/InventoryTableClient.tsx` (Crear, `Client Component` para la tabla interactiva)
    *   `components/inventory/InventoryDetailsSheet.tsx` (Modificar/Crear, para el detalle de un producto)
    *   `components/inventory/ProductFormClient.tsx` (Crear/Modificar, para añadir/editar productos)
*   **Acciones Detalladas:**
    1.  **`page.tsx` como RSC Principal:** Transformar `app/(app)/inventario/page.tsx` en un `Server Component`. Este componente será responsable de:
        *   Obtener los datos iniciales del inventario (posiblemente paginados y filtrados) usando el `fetch` nativo de Next.js y las `tags` de caché (`revalidate`).
        *   Pasar los datos al `InventoryListServer.tsx`.
        *   Renderizar los componentes cliente interactivos (`InventoryFiltersClient.tsx`, `InventoryTableClient.tsx`) con sus props iniciales.
    2.  **`InventoryListServer.tsx`:** Crear este `Server Component` que recibe los datos del inventario (ya filtrados/paginados por `page.tsx`) y renderiza la estructura principal de la lista, pasando los datos relevantes a `InventoryTableClient.tsx`.
    3.  **`InventoryFiltersClient.tsx`:** Extraer toda la lógica de estado y UI de los filtros de `page.tsx` a este `Client Component`. Este componente interactuará con el servidor (mediante `Server Actions` para filtros sencillos o mutaciones, o `router.push` para cambiar `search params` que revaliden los datos del RSC).
    4.  **`InventoryTableClient.tsx`:** Extraer la tabla de inventario, incluyendo la lógica de selección de filas, ordenamiento, paginación (si se mantiene en cliente para interactividad instantánea) y acciones de menú, a este `Client Component`. Recibirá los datos ya procesados (agrupados si es necesario) como `props`.
    5.  **Refactorización de Modales y Detalles:** Reestructurar los modales de `EditProductModal`, `DetailSheet` y otros relacionados con el producto para que sean `Client Components` bien encapsulados, recibiendo los datos necesarios como props y utilizando la nueva capa de API para sus operaciones.

#### **Fase 3: Optimización y Limpieza Final**

*   **Objetivo:** Optimizar los flujos de datos, mejorar la experiencia de usuario y eliminar cualquier deuda técnica restante.
*   **Archivos Clave a Modificar:**
    *   Todos los archivos refactorizados de las fases anteriores.
    *   Archivos de configuración de Next.js (si es necesario para caché/revalidación).
*   **Acciones Detalladas:**
    1.  **Invalidación de Caché (`revalidatePath`, `revalidateTag`):** Asegurar que las mutaciones (crear, editar, eliminar productos) invalidan correctamente la caché de los `Server Components` relevantes utilizando `revalidatePath` o `revalidateTag` en `Server Actions` o las funciones de API del backend.
    2.  **Eliminación de Código Obsoleto:** Eliminar las partes del código antiguo de `page.tsx`, `useInventory.ts` y `types/inventory.ts` que hayan sido completamente reemplazadas.
    3.  **Manejo Centralizado de Errores y Notificaciones:** Validar que todos los componentes utilicen el sistema de `Toast` de manera consistente y que los errores de la API se manejen amigablemente en la UI.
    4.  **Internacionalización (Opcional en esta fase):** Evaluar la adopción de una solución de internacionalización para textos `hardcodeados` en español, aunque se priorice la funcionalidad sobre la localización en el corto plazo.
    5.  **Documentación Actualizada:** Actualizar los comentarios en el código y, si es necesario, la documentación en `docs/` para reflejar la nueva arquitectura del módulo de Inventario.

### **Justificación de Decisiones Arquitectónicas**

1.  **Patrón Strangler Fig:** Elegido por su naturaleza pragmática. Permite una migración controlada de un módulo complejo y problemático, reduciendo el riesgo de fallos mayores y permitiendo la entrega de valor incremental. Dada la importancia del módulo de Inventario, una reescritura total sería demasiado arriesgada y disruptiva.
2.  **Alineación de Tipos Backend-Frontend:** Es fundamental para eliminar el "desastre arquitectónico". Al utilizar tipos generados o al menos idénticos al backend (siguiendo `camelCase` y el idioma inglés), eliminamos la necesidad de mapeos manuales propensos a errores, mejoramos la consistencia y facilitamos el trabajo entre capas.
3.  **Enfoque RSC-First:** Aprovechamos las capacidades de Next.js App Router para mejorar el rendimiento inicial de la página de Inventario. Los datos estáticos o menos interactivos se renderizan en el servidor, reduciendo el JavaScript enviado al cliente y mejorando la percepción de velocidad (UX First). Los componentes interactivos (filtros, tabla) se mantienen como `Client Components` donde la interactividad es clave.
4.  **Descomposición del Componente "Dios":** Adherirse al Principio de Responsabilidad Única. Cada nuevo componente o hook tendrá un propósito claro, lo que facilitará el mantenimiento, las pruebas y la escalabilidad del módulo. Por ejemplo, la lógica de filtrado se desacoplará de la presentación de la tabla.
5.  **Capa de API Formal (`lib/api/`):** Centralizar la lógica de comunicación con el backend garantiza la consistencia, facilita la gestión de errores, la inyección de credenciales (`http.ts`), el `middleware` y la invalidación de caché (`SWR keys`). Elimina las URLs `hardcodeadas` y fomenta la reutilización.

Este plan busca transformar el módulo de Inventario en un ejemplo de nuestra arquitectura frontend, alineado con el rendimiento, la mantenibilidad y la robustez que requiere el proyecto GATI-C.
