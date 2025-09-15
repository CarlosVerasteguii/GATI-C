# 🏗️ Plan de Refactorización del Módulo de Inventario - GATI-C
**Arquitecto:** Arquitecto Cursor Auto  
**Fecha:** 15 de Enero, 2025  
**Versión:** 1.0  

## 📋 Resumen Ejecutivo

El módulo de Inventario del frontend de GATI-C presenta un **"desastre arquitectónico"** que requiere una refactorización completa. Los problemas identificados incluyen:

1. **Desalineación del Contrato de Datos**: El frontend usa tipos en español (`InventoryItem`) mientras el backend genera tipos canónicos en inglés (`Product`)
2. **Componente Dios Monolítico**: `app/(app)/inventario/page.tsx` tiene 1,386 líneas con responsabilidades múltiples
3. **Violación de Patrones de API**: URLs hardcodeadas, mapeo manual de datos, y falta de capa de API formal
4. **Deuda Técnica Acumulada**: Lógica de negocio mezclada con presentación, estados locales complejos

## 🎯 Objetivo Estratégico

Transformar el módulo de Inventario en un sistema **alineado con el contrato**, **arquitectónicamente sólido**, **mantenible** y **pragmático**, siguiendo los principios establecidos en la documentación del proyecto.

## 🔍 Diagnóstico Arquitectónico

### Problemas Identificados

#### 1. Desalineación del Contrato de Datos
- **Frontend**: Usa `InventoryItem` con campos en español (`nombre`, `marca`, `categoria`)
- **Backend**: Genera tipos canónicos en inglés (`Product` con `name`, `brand`, `category`)
- **Impacto**: Mapeo manual constante, mantenimiento duplicado, inconsistencias

#### 2. Componente Dios Monolítico
- **Archivo**: `app/(app)/inventario/page.tsx` (1,386 líneas)
- **Responsabilidades**: Estado local, filtrado, paginación, agrupación, acciones masivas, modales
- **Violaciones**: Principio de Responsabilidad Única, mantenibilidad, testabilidad

#### 3. Violación de Patrones de API
- **URLs Hardcodeadas**: `'http://localhost:3001/api/v1/inventory'` en `useInventory.ts`
- **Falta de Capa Formal**: No existe estructura en `lib/api/endpoints/`
- **Mapeo Manual**: `mapBackendToFrontend()` en lugar de tipos canónicos

#### 4. Deuda Técnica
- **Estados Locales Complejos**: 20+ estados locales en un solo componente
- **Lógica de Negocio en UI**: Filtrado, agrupación, paginación en componentes
- **Falta de Separación**: Presentación mezclada con lógica de datos

## 🚀 Plan de Refactorización por Fases

### Fase 1: Alineación del Contrato de Datos (Semana 1)

**Objetivo**: Establecer tipos canónicos y eliminar mapeo manual

#### Archivos a Crear/Modificar:
- `types/inventory.ts` → **REEMPLAZAR** con tipos canónicos
- `lib/api/schemas.ts` → **CREAR** esquemas Zod para validación
- `lib/api/endpoints/inventory.ts` → **CREAR** capa de endpoints formal
- `hooks/useInventory.ts` → **REFACTORIZAR** para usar tipos canónicos

#### Acciones Detalladas:

1. **Migrar a Tipos Canónicos**
   ```typescript
   // REEMPLAZAR types/inventory.ts
   export type Product = {
     id: string;
     name: string;
     serialNumber: string | null;
     description: string | null;
     cost: number | null;
     purchaseDate: Date | null;
     condition: string | null;
     brandId: string | null;
     categoryId: string | null;
     locationId: string | null;
     createdAt: Date;
     updatedAt: Date;
     brand?: Brand | null;
     category?: Category | null;
     location?: Location | null;
     documents?: Document[];
   };
   ```

2. **Crear Capa de API Formal**
   ```typescript
   // CREAR lib/api/endpoints/inventory.ts
   export const inventoryEndpoints = {
     list: (params: ListParams) => `/api/v1/products?${buildQueryString(params)}`,
     get: (id: string) => `/api/v1/products/${id}`,
     create: () => `/api/v1/products`,
     update: (id: string) => `/api/v1/products/${id}`,
     delete: (id: string) => `/api/v1/products/${id}`,
   };
   ```

3. **Implementar Schemas Zod**
   ```typescript
   // CREAR lib/api/schemas.ts
   export const ProductListResponseSchema = z.object({
     success: z.boolean(),
     data: z.array(ProductSchema),
     pagination: z.object({
       page: z.number(),
       limit: z.number(),
       total: z.number(),
       totalPages: z.number(),
     }),
   });
   ```

4. **Refactorizar Hook de Datos**
   ```typescript
   // REFACTORIZAR hooks/useInventory.ts
   export function useInventory(params?: ListParams) {
     return useSWR(
       keygen.list(params),
       ([url, params]) => fetcher(url, params),
       { keepPreviousData: true }
     );
   }
   ```

### Fase 2: Descomposición del Componente Dios (Semana 2)

**Objetivo**: Dividir el componente monolítico en piezas manejables

#### Archivos a Crear:
- `components/inventory/InventoryPage.tsx` → **CREAR** componente principal simplificado
- `components/inventory/InventoryTable.tsx` → **CREAR** tabla con lógica de presentación
- `components/inventory/InventoryFilters.tsx` → **CREAR** componente de filtros
- `components/inventory/InventoryActions.tsx` → **CREAR** acciones masivas
- `hooks/useInventoryFilters.ts` → **CREAR** hook para filtros
- `hooks/useInventoryPagination.ts` → **CREAR** hook para paginación
- `hooks/useInventorySelection.ts` → **CREAR** hook para selección

#### Acciones Detalladas:

1. **Crear Hook de Filtros**
   ```typescript
   // CREAR hooks/useInventoryFilters.ts
   export function useInventoryFilters() {
     const [filters, setFilters] = useState<InventoryFilters>({});
     const [searchTerm, setSearchTerm] = useState('');
     
     const filteredData = useMemo(() => {
       return applyFilters(inventoryData, filters, searchTerm);
     }, [inventoryData, filters, searchTerm]);
     
     return { filters, setFilters, searchTerm, setSearchTerm, filteredData };
   }
   ```

2. **Crear Hook de Paginación**
   ```typescript
   // CREAR hooks/useInventoryPagination.ts
   export function useInventoryPagination(data: Product[], itemsPerPage: number) {
     const [currentPage, setCurrentPage] = useState(1);
     
     const paginatedData = useMemo(() => {
       const startIndex = (currentPage - 1) * itemsPerPage;
       return data.slice(startIndex, startIndex + itemsPerPage);
     }, [data, currentPage, itemsPerPage]);
     
     return { currentPage, setCurrentPage, paginatedData };
   }
   ```

3. **Simplificar Componente Principal**
   ```typescript
   // CREAR components/inventory/InventoryPage.tsx
   export default function InventoryPage() {
     const { inventory, isLoading, error } = useInventory();
     const { filters, filteredData } = useInventoryFilters(inventory);
     const { paginatedData } = useInventoryPagination(filteredData, 25);
     
     if (isLoading) return <InventorySkeleton />;
     if (error) return <InventoryError error={error} />;
     
     return (
       <div className="space-y-4">
         <InventoryFilters filters={filters} />
         <InventoryTable data={paginatedData} />
         <InventoryActions />
       </div>
     );
   }
   ```

### Fase 3: Implementación de Patrones RSC-First (Semana 3)

**Objetivo**: Aplicar patrones de renderizado RSC-first según documentación

#### Archivos a Crear/Modificar:
- `app/(app)/inventario/page.tsx` → **REFACTORIZAR** como Server Component
- `components/inventory/InventoryClient.tsx` → **CREAR** Client Component para interactividad
- `lib/api/hooks/useInventory.ts` → **CREAR** hooks SWR centralizados

#### Acciones Detalladas:

1. **Convertir a Server Component**
   ```typescript
   // REFACTORIZAR app/(app)/inventario/page.tsx
   export const revalidate = 60; // Revalidación por tiempo
   
   export default async function InventoryPage() {
     const initialData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`, {
       next: { tags: ["products"] },
     });
     
     if (!initialData.ok) throw new Error("Error al cargar inventario");
     const products = await initialData.json();
     
     return <InventoryClient initialData={products} />;
   }
   ```

2. **Crear Client Component**
   ```typescript
   // CREAR components/inventory/InventoryClient.tsx
   "use client";
   
   export function InventoryClient({ initialData }: { initialData: Product[] }) {
     const { data, mutate } = useInventory({ fallbackData: initialData });
     
     return (
       <div className="space-y-4">
         <InventoryFilters />
         <InventoryTable data={data} />
         <InventoryActions onMutate={mutate} />
       </div>
     );
   }
   ```

### Fase 4: Optimización y Limpieza (Semana 4)

**Objetivo**: Eliminar deuda técnica y optimizar rendimiento

#### Archivos a Modificar:
- `components/inventory/InventoryTable.tsx` → **OPTIMIZAR** con React.memo
- `hooks/useInventory.ts` → **OPTIMIZAR** con keys SWR centralizadas
- `lib/api/client.ts` → **MEJORAR** manejo de errores

#### Acciones Detalladas:

1. **Optimizar Tabla con React.memo**
   ```typescript
   // OPTIMIZAR components/inventory/InventoryTable.tsx
   export const InventoryTable = React.memo(({ data, onSort, onSelect }: Props) => {
     // Implementación optimizada
   });
   ```

2. **Centralizar Keys SWR**
   ```typescript
   // MEJORAR lib/api/hooks/useInventory.ts
   const keygen = {
     list: (params?: ListParams) => ["/api/v1/products", params ?? {}] as const,
     detail: (id: string) => ["/api/v1/products", id] as const,
   };
   ```

## 🎯 Justificación de Decisiones Arquitectónicas

### 1. Patrón Strangler Fig
**Decisión**: Implementar refactorización gradual sin romper funcionalidad existente.

**Justificación**: 
- Permite migración incremental sin downtime
- Reduce riesgo de regresiones
- Facilita testing y validación continua
- Mantiene funcionalidad durante transición

**Implementación**:
- Fase 1: Coexistencia de tipos antiguos y nuevos
- Fase 2: Migración componente por componente
- Fase 3: Eliminación gradual de código legacy

### 2. Separación de Responsabilidades
**Decisión**: Dividir componente monolítico en hooks especializados.

**Justificación**:
- Mejora testabilidad individual
- Facilita mantenimiento y debugging
- Permite reutilización de lógica
- Reduce complejidad cognitiva

### 3. Tipos Canónicos Únicos
**Decisión**: Usar exclusivamente tipos generados desde Prisma.

**Justificación**:
- Elimina mapeo manual y inconsistencias
- Garantiza sincronización con backend
- Reduce superficie de bugs
- Facilita mantenimiento a largo plazo

### 4. Patrón RSC-First
**Decisión**: Implementar Server Components por defecto con Client Components solo para interactividad.

**Justificación**:
- Mejora rendimiento inicial (menos JavaScript)
- Optimiza SEO y accesibilidad
- Reduce bundle size del cliente
- Alinea con mejores prácticas de Next.js 14+

## 📊 Métricas de Éxito

### Métricas Técnicas
- **Reducción de Líneas de Código**: De 1,386 a <400 líneas por componente
- **Cobertura de Tests**: >80% en hooks y componentes críticos
- **Tiempo de Build**: Reducción del 20% en tiempo de compilación
- **Bundle Size**: Reducción del 15% en JavaScript del cliente

### Métricas de Calidad
- **Complejidad Ciclomática**: <10 por función
- **Acoplamiento**: Bajo entre módulos
- **Cohesión**: Alta dentro de módulos
- **Mantenibilidad**: Índice de mantenibilidad >70

### Métricas de Rendimiento
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3s
- **Cumulative Layout Shift**: <0.1

## 🚨 Riesgos y Mitigaciones

### Riesgo 1: Regresiones Funcionales
**Mitigación**: 
- Testing exhaustivo en cada fase
- Feature flags para rollback rápido
- Validación manual de casos críticos

### Riesgo 2: Resistencia al Cambio
**Mitigación**:
- Comunicación clara de beneficios
- Capacitación del equipo
- Documentación detallada

### Riesgo 3: Complejidad de Migración
**Mitigación**:
- Enfoque incremental
- Herramientas de migración automatizada
- Soporte técnico dedicado

## 📅 Cronograma de Implementación

| Semana | Fase | Entregables | Criterios de Aceptación |
|--------|------|-------------|------------------------|
| 1 | Alineación de Contrato | Tipos canónicos, API layer | Tests pasando, tipos sincronizados |
| 2 | Descomposición | Componentes modulares, hooks | Componentes <400 LOC, responsabilidad única |
| 3 | RSC-First | Server/Client components | Rendimiento mejorado, SEO optimizado |
| 4 | Optimización | Código limpio, performance | Métricas de éxito alcanzadas |

## 🔧 Herramientas y Tecnologías

### Herramientas de Desarrollo
- **TypeScript**: Tipado estricto y generación de tipos
- **Zod**: Validación de esquemas y parsing
- **SWR**: Data fetching y caching
- **React.memo**: Optimización de renders
- **Next.js**: Server Components y App Router

### Herramientas de Testing
- **Jest**: Testing unitario
- **React Testing Library**: Testing de componentes
- **Playwright**: Testing end-to-end
- **Storybook**: Desarrollo de componentes aislados

### Herramientas de Calidad
- **ESLint**: Linting y reglas de código
- **Prettier**: Formateo consistente
- **Husky**: Git hooks para calidad
- **Lighthouse**: Métricas de rendimiento

## 📚 Referencias y Documentación

### Documentación del Proyecto
- [Business Context](./docs/01-business-context.md)
- [Product Requirements](./docs/02-prd.md)
- [Software Requirements](./docs/03-srs.md)
- [Frontend Architecture](./docs/04-frontend-architecture.md)

### Patrones y Mejores Prácticas
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/reference/react/use-server)
- [SWR Documentation](https://swr.vercel.app/)
- [Zod Documentation](https://zod.dev/)

## 🎯 Conclusión

Este plan de refactorización transformará el módulo de Inventario de un "desastre arquitectónico" a un sistema robusto, mantenible y alineado con los principios del proyecto GATI-C. La implementación por fases minimiza riesgos mientras maximiza beneficios a largo plazo.

La clave del éxito radica en la ejecución disciplinada de cada fase, manteniendo siempre la funcionalidad existente mientras se construye la nueva arquitectura. El resultado será un módulo que no solo funciona mejor, sino que también es más fácil de mantener, extender y optimizar.

---

**Firma del Arquitecto:** Arquitecto Cursor Auto  
**Fecha de Aprobación:** [Pendiente]  
**Próxima Revisión:** [Post-implementación de Fase 1]
