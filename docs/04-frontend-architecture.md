# Arquitectura de Layout y Navegación en GATI-C

## Introducción

Este documento define la estructura oficial de layout y navegación para la aplicación GATI-C, siguiendo las mejores prácticas de Next.js App Router y los requisitos establecidos en el SRS y PRD.

## Principios Fundamentales

1. **Desktop-First con Responsividad Razonable**: La aplicación se optimiza para escritorio (uso ~99%), garantiza una buena experiencia en tablets y una experiencia funcional en móviles sin comprometer la densidad y usabilidad en pantallas grandes.

2. **Consistencia Visual**: Todos los componentes y páginas deben mantener una apariencia y comportamiento coherentes siguiendo la Guía Maestra de Estilo Visual.

3. **Modularidad**: La estructura de layout se implementa de manera modular para facilitar el mantenimiento y la escalabilidad.

4. **Rendimiento**: La implementación minimiza re-renderizados innecesarios y optimiza la carga inicial.

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
│   ├── ...
├── login/                 # Fuera del grupo (app) - sin layout autenticado
```

### Componentes de Layout

1. **`components/app-layout.tsx`**
   - Componente principal de layout que implementa:
     - Sidebar para navegación en escritorio
     - Header responsivo con menú hamburguesa para móviles
     - Navegación filtrada según el rol del usuario
     - Gestión de tema (claro/oscuro)
     - Información y logout del usuario

2. **`app/(app)/layout.tsx`**
   - Layout de grupo que envuelve todas las páginas autenticadas
   - Importa y utiliza `AppLayout` como wrapper
   - Gestiona la redirección a login si no hay usuario autenticado

3. **`hooks/use-device.tsx`**
   - Hook personalizado para detectar el tipo de dispositivo
   - Proporciona información sobre el viewport para adaptar la UI según sea necesario
   - Ejemplo de uso: `const { isMobile, isTablet, isDesktop } = useDevice()`

## Reglas de Implementación

### ✅ Hacer

1. **Usar la estructura de grupo de rutas**:
   - Todas las páginas autenticadas deben estar dentro del grupo `(app)`
   - El layout del grupo se aplica automáticamente a todas las páginas

2. **Extender funcionalidad con hooks**:
   - Usar `useDevice()` para adaptar componentes según el dispositivo
   - Implementar lógica específica de dispositivo dentro de los componentes

3. **Documentar cambios de layout**:
   - Actualizar este documento cuando se realicen cambios arquitectónicos
   - Registrar cambios en el CHANGELOG.md

### ❌ No Hacer

1. **No importar `AppLayout` directamente en páginas individuales**:
   - Las páginas ya reciben el layout del grupo `(app)/layout.tsx`
   - Importar y usar `AppLayout` en páginas individuales causa duplicación

2. **No crear componentes de layout alternativos**:
   - Evitar crear versiones alternativas de `AppLayout`
   - Extender la funcionalidad existente en lugar de duplicar

3. **No omitir el layout del grupo para páginas autenticadas**:
   - Todas las páginas autenticadas deben estar dentro del grupo `(app)`
   - No crear rutas autenticadas fuera del grupo

## Proceso de Migración

Para páginas existentes que no siguen esta arquitectura:

1. **Identificar inconsistencias**:
   - Páginas que importan `AppLayout` directamente
   - Componentes duplicados de layout

2. **Refactorizar**:
   - Eliminar importaciones directas de `AppLayout` en páginas
   - Asegurar que las páginas estén en el grupo correcto
   - Eliminar componentes duplicados

3. **Verificar**:
   - Comprobar que la navegación funcione correctamente
   - Validar que la UI sea consistente en todos los dispositivos

## Ejemplo de Implementación

### Estructura correcta para una página de inventario:

```tsx
// app/(app)/inventario/page.tsx
"use client"

import { useState } from "react"
import { useDevice } from "@/hooks/use-device"
// NO importar AppLayout aquí

export default function InventarioPage() {
  const { isMobile } = useDevice()
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Inventario</h1>
      {/* Contenido adaptado según el dispositivo */}
      {isMobile ? (
        <MobileInventoryView />
      ) : (
        <DesktopInventoryView />
      )}
    </div>
  )
}
```

## Referencias

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [SRS - GATI-C v2.2 (Final)](./03-srs.md)
- [PRD de GATI-C](./02-prd.md)
- [Guía Maestra de Estilo Visual](./05-visual-style-guide.md) 

## Patrones de Diálogos y Formularios (Política 6.2 y 6.3)

### Diálogos y Paneles (Dialogs/Sheets)
- Desktop-first: usar grid de 2–3 columnas por defecto en `md` y superiores.
- Fallback: en pantallas pequeñas, el contenido se apila a 1 columna sin sacrificar legibilidad.
- Ancho/Alto recomendados: min-width 720–960px en escritorio; altura con scroll interno para contenido excedente.
- Acciones: barra de acciones inferior “sticky” dentro del modal.

### Formularios
- Preferencia: una sola página con secciones claras; evitar wizards salvo flujos secuenciales genuinos.
- Organización: agrupar campos por secciones, soportar acordeones/expansiones para detalles avanzados.
- Navegación: anclas de sección y header “sticky” para contexto.
- Validación: por sección cuando sea posible; feedback inmediato y accesible.
