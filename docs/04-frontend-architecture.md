# Arquitectura de Layout y Navegación en GATI-C

## Introducción

Este documento define la estructura oficial de layout y navegación para la aplicación GATI-C, siguiendo las mejores prácticas de Next.js App Router y los requisitos establecidos en el SRS y PRD.

## Principios Fundamentales

1. Desktop-First con Responsividad Razonable: La aplicación se optimiza para escritorio (uso ~99%), garantiza una buena experiencia en tablets y una experiencia funcional en móviles sin comprometer la densidad y usabilidad en pantallas grandes.
2. Consistencia Visual: Todos los componentes y páginas deben mantener una apariencia y comportamiento coherentes siguiendo la Guía Maestra de Estilo Visual.
3. Modularidad: La estructura de layout se implementa de manera modular para facilitar el mantenimiento y la escalabilidad.
4. Stack de Estilos (6.6): Tailwind CSS + shadcn/ui (Radix) con theming por clase (`next-themes`). Evitar mezclar frameworks o sistemas de estilos alternos.
5. Rendimiento: La implementación minimiza re-renderizados innecesarios y optimiza la carga inicial.

## Estructura de Layout Estandarizada

### Jerarquía de Layouts

La aplicación utiliza la estructura jerárquica de layouts de Next.js App Router:

```
app/
├── layout.tsx             # Layout raíz (HTML, head, body)
├── (app)/                 # Grupo de rutas para páginas autenticadas
│   ├── layout.tsx         # Layout para todas las páginas autenticadas
│   ├── dashboard/
│   ├── inventario/
│   └── ...
└── login/                 # Fuera del grupo (app) - sin layout autenticado
```

### Componentes de Layout

1. components/app-layout.tsx
   - Sidebar para navegación en escritorio
   - Header responsivo (menú hamburguesa en móviles)
   - Navegación filtrada por rol de usuario
   - Gestión de tema (claro/oscuro)
   - Información y logout del usuario

2. app/(app)/layout.tsx
   - Layout de grupo que envuelve todas las páginas autenticadas
   - Importa y utiliza AppLayout como wrapper
   - Gestiona la redirección a login si no hay usuario autenticado

3. hooks/use-device.tsx
   - Hook para detectar tipo de dispositivo
   - Proporciona viewport para adaptar la UI: `const { isMobile, isTablet, isDesktop } = useDevice()`

## Reglas de Implementación

### Hacer

1. Usar la estructura de grupo de rutas:
   - Todas las páginas autenticadas dentro del grupo `(app)`
   - El layout del grupo se aplica automáticamente a todas las páginas

2. Extender funcionalidad con hooks:
   - Usar `useDevice()` para adaptar componentes según el dispositivo
   - Implementar lógica específica de dispositivo dentro de los componentes

### Tema y Modo Oscuro (6.5)
- Usar `next-themes` con estrategia `class` y `ThemeProvider` a nivel de layout.
- Tema por defecto: claro; incluir toggle en el header (componente `ThemeToggle`).
- Evitar estilos in-line condicionales; preferir tokens (`--background`, `--foreground`, etc.).

### No Hacer

1. No importar AppLayout directamente en páginas individuales:
   - Las páginas ya reciben el layout del grupo `(app)/layout.tsx`
   - Importarlo y usarlo en páginas individuales causa duplicación

2. No crear componentes de layout alternativos:
   - Evitar versiones alternativas de AppLayout; extender funcionalidades existentes

3. No omitir el layout del grupo para páginas autenticadas:
   - Todas las páginas autenticadas deben estar dentro del grupo `(app)`

## Proceso de Migración

Para páginas existentes que no siguen esta arquitectura:

1. Identificar inconsistencias (importar AppLayout en páginas, duplicación de layouts)
2. Refactorizar (eliminar imports directos, mover páginas al grupo correcto, borrar duplicados)
3. Verificar navegación y consistencia visual

## Ejemplo de Implementación

### Estructura correcta para una página de inventario

```tsx
// app/(app)/inventario/page.tsx
"use client"

import { useDevice } from "@/hooks/use-device"

export default function InventarioPage() {
  const { isMobile } = useDevice()
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Inventario</h1>
      {isMobile ? <MobileInventoryView /> : <DesktopInventoryView />}
    </div>
  )
}
```

## Referencias

- Next.js App Router Documentation: https://nextjs.org/docs/app
- SRS - GATI-C v2.2 (Final): ./03-srs.md
- PRD de GATI-C: ./02-prd.md
- Guía Maestra de Estilo Visual: ./05-visual-style-guide.md

## Patrones de Diálogos y Formularios (Política 6.2 y 6.3)

### Diálogos y Paneles (Dialogs/Sheets)
- Desktop-first: usar grid de 2-3 columnas por defecto en `md` y superiores.
- Fallback: en pantallas pequeñas, el contenido se apila a 1 columna sin sacrificar legibilidad.
- Ancho/Alto recomendados: min-width 720-960px en escritorio; altura con scroll interno para contenido excedente.
- Acciones: barra de acciones inferior "sticky" dentro del modal.

### Formularios
- Preferencia: una sola página con secciones claras; evitar wizards salvo flujos secuenciales genuinos.
- Organización: agrupar campos por secciones, soportar acordeones/expansiones para detalles avanzados.
- Navegación: anclas de sección y header "sticky" para contexto.
- Validación: por sección cuando sea posible; feedback inmediato y accesible.
- Usar clases semánticas para estados (`bg-status-...`, `text-status-...`) definidas en Tailwind; evitar `bg-green-500` directos para estados.
- Modo oscuro con estrategia `class` (`.dark` en `<html>`); no usar detección por media query aislada.

---

## Renderizado en App Router (Contrato v2.3)
- Server Components por defecto en `page.tsx`, `layout.tsx` y componentes de solo lectura.
- "use client" solo para interactividad (hooks, estado, eventos, APIs del navegador), preferentemente en componentes hoja.
- Usar `loading.tsx`, `error.tsx` y `Suspense` para streaming y skeletons en lugar de spinners.

## Capa de API y Fetching
- Ubicación: `@/lib/api/` con:
  - `http.ts`: wrapper de `fetch` (baseURL, headers, retries, mapeo de errores).
  - `schemas.ts`: Zod schemas (request/response) por recurso.
  - `endpoints/`: funciones puras por recurso.
  - `hooks/`: hooks SWR (`useXxx`) que exponen `data`, `error`, `isLoading`.
- Cliente: toda obtención de datos se hace exclusivamente mediante hooks SWR desde `@/lib/api/hooks`. Prohibido `fetch/axios` directos en la UI.
- RSC/SSR: usar `fetch` nativo de Next con `revalidate`, `tags` o `cache: 'no-store'` según el caso.

## Mutaciones
- Cliente: `useSWRMutation`/`mutate` con invalidación de keys/tags coherente.
- Servidor: Server Actions para formularios simples y sin lógica compleja de cliente. Si hay múltiples consumidores o efectos laterales notables, preferir endpoint HTTP + hooks de mutación.

## Anti‑patrones (Prohibidos)
- Marcar `page/layout` como cliente por conveniencia.
- `fetch/axios` directos en componentes cliente.
- Waterfalls de datos en cliente mediante `useEffect` encadenados.
- Duplicar estados de carga/error ya provistos por SWR.

## Checklist de Revisión (PRs)
- RSC por defecto; "use client" solo si hay interactividad.
- Datos en cliente vía hooks de `@/lib/api/hooks`.
- Schemas Zod en `schemas.ts`; sin parsing manual en la UI.
- Keys SWR centralizadas; invalidación coherente (`mutate`/`tags`).
- Páginas definen `revalidate`/`tags` acorde a la naturaleza del dato.

## Patrones de Implementación de Referencia

1) Página RSC con fetch + cache por tags

```tsx
// app/(app)/productos/page.tsx (RSC)
import ProductsTable from "@/components/products-table"

export const revalidate = 60 // revalidación por tiempo (opcional)

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`, {
    next: { tags: ["products"] },
    // cache: 'no-store' para datos muy dinámicos/autenticados
  })
  if (!res.ok) throw new Error("Error al cargar productos")
  const data = await res.json()
  return <ProductsTable data={data} />
}
```

2) Hook SWR en cliente para listar productos

```tsx
// lib/api/hooks/use-products.ts
"use client"
import useSWR from "swr"

export type ListParams = { q?: string; page?: number }

const keygen = {
  list: (p?: ListParams) => ["/api/v1/products", p ?? {}] as const,
}

async function fetcher([url, p]: ReturnType<typeof keygen.list>) {
  const qs = new URLSearchParams()
  if (p.q) qs.set("q", p.q)
  if (p.page) qs.set("page", String(p.page))
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}?${qs.toString()}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Fallo al obtener productos")
  return res.json()
}

export function useProducts(params?: ListParams) {
  return useSWR(keygen.list(params), fetcher, {
    keepPreviousData: true,
  })
}
```

3) Mutación con useSWRMutation + invalidación

```tsx
// lib/api/hooks/use-create-product.ts
"use client"
import useSWRMutation from "swr/mutation"
import { mutate } from "swr"

const keygen = {
  all: () => ["/api/v1/products", {}] as const,
}

async function createFetcher(_: unknown, { arg }: { arg: { name: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error("Fallo al crear producto")
  return res.json()
}

export function useCreateProduct() {
  return useSWRMutation(keygen.all(), createFetcher, {
    onSuccess: async () => {
      await mutate(keygen.all()) // revalida lista
    },
  })
}
```

