# Capa de API del Frontend

Este directorio contiene toda la lógica para la comunicación entre el frontend de GATI-C y el backend. La arquitectura está diseñada para ser robusta, tipada y centralizada.

## Estructura de Directorios

- **/client.ts**: Implementación del cliente HTTP principal. Es un wrapper sobre `fetch` que centraliza la `baseURL` (leída desde `NEXT_PUBLIC_API_URL`), el manejo de credenciales (`credentials: 'include'`) и el manejo básico de errores. **Toda petición a la red debe pasar por este cliente.**

- **/schemas/**: Contiene los esquemas de validación de Zod. Se usan para validar los "wire formats" (los payloads JSON crudos de la API) y transformarlos a nuestros tipos canónicos.

- **/endpoints/**: Contiene funciones puras y asíncronas que representan los endpoints de la API. Cada función encapsula la lógica de llamar a un endpoint específico usando el `apiClient` y validar su respuesta con los `schemas`.

- **/hooks/**: Contiene los hooks de SWR (`useSWR` y `useSWRMutation`). Estos hooks son el punto de entrada para los componentes de la UI. Encapsulan la lógica de fetching, caché, revalidación y mutación, consumiendo las funciones de la capa de `endpoints`.

## Flujo de Datos (Lectura)

`Componente UI` -> `Hook SWR` (`/hooks`) -> `Función de Endpoint` (`/endpoints`) -> `API Client` (`/client`) -> `Backend`

## Flujo de Datos (Validación)

`Backend` -> `API Client` -> `Función de Endpoint` -> `Schema Zod` (`/schemas`) -> `Dato Limpio al Hook`

## Contrato de Parámetros (Inventario)

Los listados de inventario aceptan parámetros de consulta validados por Zod en `schemas/inventory.ts` mediante `ListParamsSchema`.

- Tipo exportado: `export type ListParams = z.infer<typeof ListParamsSchema>`
- Campos admitidos (todos opcionales):
  - `q`: búsqueda de texto
  - `page`, `pageSize`: paginación (enteros positivos; `pageSize` ≤ 100)
  - `sortBy`, `sortOrder`: ordenamiento (`asc` | `desc`)
  - `brandId`, `categoryId`, `locationId`: filtros por relaciones
  - `condition`: filtro por atributo
  - `hasSerialNumber`, `minCost`, `maxCost`, `purchaseDateFrom`, `purchaseDateTo`: filtros avanzados

Uso de referencia:

```ts
import { listProducts } from './endpoints/inventory'
import { useInventoryList } from './hooks/use-inventory'

await listProducts({ q: 'laptop', page: 1, pageSize: 25, sortBy: 'name', sortOrder: 'asc' })

const { data } = useInventoryList({ q: 'router', brandId: 'b1' })
```

Claves SWR:
- `inventoryKeys.list(params)` incluye `params` para evitar colisiones y soportar revalidación fina.