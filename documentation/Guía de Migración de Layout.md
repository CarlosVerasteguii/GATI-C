# Guía de Migración de Layout en GATI-C

Esta guía proporciona instrucciones paso a paso para migrar componentes de página existentes a la nueva arquitectura de layout estandarizada en GATI-C.

## Problema

Hemos identificado inconsistencias en la forma en que se aplican los layouts en la aplicación:

1. **Duplicación de layouts**: Algunas páginas importan y utilizan `AppLayout` directamente, cuando ya están recibiendo el layout del grupo de rutas `(app)`.
2. **Componentes duplicados**: Existen múltiples versiones del componente `AppLayout` en diferentes ubicaciones.
3. **Estructura inconsistente**: Algunas páginas están fuera del grupo de rutas `(app)` cuando deberían estar dentro.

## Solución

Estandarizar la estructura de layout siguiendo las mejores prácticas de Next.js App Router:

1. Usar un único componente `AppLayout` en `components/app-layout.tsx`
2. Aplicar el layout a nivel de grupo de rutas en `app/(app)/layout.tsx`
3. Eliminar importaciones directas de `AppLayout` en páginas individuales

## Pasos de Migración

### 1. Identificar páginas que necesitan migración

Ejecuta el siguiente comando para identificar páginas que importan `AppLayout` directamente:

```bash
grep -r "import.*AppLayout.*from" app/
```

### 2. Refactorizar páginas individuales

Para cada página identificada, sigue estos pasos:

#### a) Si la página está en `app/(app)/`:

1. Eliminar la importación de `AppLayout`:
   ```diff
   - import { AppLayout } from "@/components/app-layout"
   ```

2. Eliminar el wrapper de `AppLayout`:
   ```diff
   export default function MiPagina() {
     return (
   -   <AppLayout>
         <div>
           {/* Contenido de la página */}
         </div>
   -   </AppLayout>
     )
   }
   ```

#### b) Si la página está fuera de `app/(app)/` pero debería estar autenticada:

1. Mover el archivo a la estructura de carpetas correcta:
   ```bash
   # Ejemplo: mover app/inventario/page.tsx a app/(app)/inventario/page.tsx
   mkdir -p app/(app)/inventario
   mv app/inventario/page.tsx app/(app)/inventario/
   ```

2. Eliminar la importación y uso de `AppLayout` como en el paso (a)

### 3. Actualizar el hook useDevice

Asegúrate de que el hook `useDevice` esté disponible para todas las páginas:

1. Si no existe, créalo en `hooks/use-device.tsx`
2. Si ya existe, actualízalo con la implementación estandarizada

### 4. Verificar la estructura de rutas

Asegúrate de que todas las páginas autenticadas estén dentro del grupo `(app)`:

```
app/
├── layout.tsx             # Layout raíz
├── (app)/                 # Grupo para páginas autenticadas
│   ├── layout.tsx         # Layout con AppLayout
│   ├── dashboard/
│   ├── inventario/
│   └── ...
├── login/                 # Fuera del grupo - sin AppLayout
└── ...
```

### 5. Pruebas de verificación

Para cada página migrada:

1. Verifica que la navegación funcione correctamente
2. Comprueba que la UI sea consistente en todos los dispositivos
3. Asegúrate de que el layout se aplique correctamente
4. Prueba la responsividad en dispositivos móviles y tablets

## Ejemplo de Migración

### Antes:

```tsx
// app/inventario/page.tsx
"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"

export default function InventarioPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1>Inventario</h1>
        {/* Contenido */}
      </div>
    </AppLayout>
  )
}
```

### Después:

```tsx
// app/(app)/inventario/page.tsx
"use client"

import { useState } from "react"
import { useDevice } from "@/hooks/use-device"

export default function InventarioPage() {
  const { isMobile } = useDevice()
  
  return (
    <div className="space-y-6">
      <h1>Inventario</h1>
      {/* Contenido adaptado según el dispositivo */}
      {isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </div>
  )
}
```

## Referencias

- [Arquitectura de Layout y Navegación en GATI-C](./Arquitectura%20de%20Layout%20y%20Navegación.md)
- [Next.js App Router Documentation](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) 