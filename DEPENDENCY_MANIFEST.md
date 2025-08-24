# Manifiesto de Dependencias - Operación Sincronía

**Propósito:** Este documento es una herramienta de auditoría de un solo uso para garantizar la sincronización durante la refactorización a inglés. Su objetivo es mapear el flujo de datos desde la definición del tipo hasta su consumo en el componente final. **No está destinado a ser mantenido después de que la refactorización se complete.**

**Proceso de Auditoría:**
1. **Identificar el Tipo de Datos Base:** Comenzar con un tipo fundamental de `types/inventory.ts`.
2. **Rastrear Hacia Arriba:** Identificar qué hooks, stores o clientes API consumen o exponen este tipo.
3. **Mapear Componentes Consumidores:** Listar todos los componentes (padres e hijos) que utilizan esos hooks o reciben los datos del tipo como props.
4. **Verificar Sincronía:** Para cada entrada, verificar que todos los elementos están en inglés y que las "formas" de los datos coinciden desde el origen hasta el destino.

---

## 1. Contrato de Datos: `types/inventory.ts`

### 1.1. Tipo: `InventoryItem`

* **Definición Verificada:** [x] Sí / [ ] No
* **Estado de Unificación:** [x] Inglés / [ ] Mixto / [ ] Español
* **Dependencias de Lógica:**
  * **Hooks/Stores:** `useInventory.ts`, `useApp()` (app-context)
  * **Clientes API:** `lib/api/inventory.ts` (funciones CRUD)
* **Componentes Consumidores (Hijos Directos del Tipo):**
  * `app/(app)/inventario/page.tsx` (consume datos a través de `useInventory`)
  * `app/(app)/dashboard/page.tsx` (consume datos a través de `useApp`)
  * `components/assign-modal.tsx` (recibe `InventoryItem` como prop)
  * `components/edit-product-modal.tsx` (recibe `InventoryItem` como prop)
  * `components/inventory/grouped-inventory-table.tsx` (consume datos a través de `useInventory`)
  * `components/inventory/parent-row.tsx` (consume datos a través de `useInventory`)
  * `components/inventory/child-row.tsx` (consume datos a través de `useInventory`)
* **Notas de Auditoría:**
  * ✅ El tipo `InventoryItem` está completamente en inglés
  * ✅ Los campos están bien tipados y son consistentes
  * ⚠️ **DESINCRONIZACIÓN DETECTADA:** El hook `useInventory` devuelve `any[]` en lugar de `InventoryItem[]`

### 1.2. Tipo: `GroupedProduct`

* **Definición Verificada:** [x] Sí / [ ] No
* **Estado de Unificación:** [x] Inglés / [ ] Mixto / [ ] Español
* **Dependencias de Lógica:**
  * **Hooks/Stores:** `useInventory.ts` (indirectamente)
  * **Clientes API:** No hay API específica para este tipo
* **Componentes Consumidores:**
  * `components/inventory/grouped-inventory-table.tsx` (consume datos a través de `useInventory`)
  * `components/inventory/parent-row.tsx` (consume datos a través de `useInventory`)
* **Notas de Auditoría:**
  * ✅ El tipo `GroupedProduct` está completamente en inglés
  * ⚠️ **DESINCRONIZACIÓN DETECTADA:** El tipo se define pero no hay transformación de `InventoryItem[]` a `GroupedProduct[]` en el hook

### 1.3. Tipo: `User`

* **Definición Verificada:** [x] Sí / [ ] No
* **Estado de Unificación:** [x] Inglés / [ ] Mixto / [ ] Español
* **Dependencias de Lógica:**
  * **Hooks/Stores:** `useAuthStore.ts`
  * **Clientes API:** `lib/api/auth.ts`
* **Componentes Consumidores:**
  * `app/ClientLayout.tsx` (para proteger rutas)
  * `app/(app)/inventario/page.tsx` (para autorización)
  * `app/(app)/dashboard/page.tsx` (para autorización)
  * `app/(app)/perfil/page.tsx` (para mostrar perfil)
  * `components/assign-modal.tsx` (para autorización)
  * `components/action-menu.tsx` (para autorización)
* **Notas de Auditoría:**
  * ✅ El tipo `User` está completamente en inglés
  * ✅ El store `useAuthStore` está bien sincronizado con el tipo

### 1.4. Tipo: `HistoryEvent`

* **Definición Verificada:** [x] Sí / [ ] No
* **Estado de Unificación:** [x] Inglés / [ ] Mixto / [ ] Español
* **Dependencias de Lógica:**
  * **Hooks/Stores:** `useApp()` (app-context)
  * **Clientes API:** No hay API específica para este tipo
* **Componentes Consumidores:**
  * `components/activity-detail-sheet.tsx`
  * `app/(app)/historial/page.tsx`
* **Notas de Auditoría:**
  * ✅ El tipo `HistoryEvent` está completamente en inglés
  * ✅ La sincronización parece estar correcta

---

## 2. Contrato de Estado Global: `lib/stores/` y `contexts/`

### 2.1. Store: `useAuthStore`

* **Estado Verificado:** [x] Sí / [ ] No
* **Estado de Unificación:** [x] Inglés / [ ] Mixto / [ ] Español
* **Tipo de Datos Clave que Gestiona:** `User`, `AuthState`
* **Componentes Consumidores:**
  * `app/ClientLayout.tsx` (para proteger rutas)
  * `app/(app)/inventario/page.tsx` (para autorización)
  * `app/(app)/dashboard/page.tsx` (para autorización)
  * `app/(app)/perfil/page.tsx` (para mostrar perfil)
  * `components/assign-modal.tsx` (para autorización)
  * `components/action-menu.tsx` (para autorización)
* **Notas de Auditoría:**
  * ✅ El store está completamente en inglés
  * ✅ Los tipos están bien sincronizados con `types/inventory.ts`
  * ✅ La inyección de dependencias está correctamente implementada

### 2.2. Context: `useApp()` (app-context)

* **Estado Verificado:** [x] Sí / [ ] No
* **Estado de Unificación:** [x] Inglés / [ ] Mixto / [ ] Español
* **Tipo de Datos Clave que Gestiona:** `InventoryItem[]`, `AssignmentItem[]`, `LoanItem[]`, `PendingTask[]`
* **Componentes Consumidores:**
  * `app/(app)/dashboard/page.tsx` (para métricas y datos)
  * `app/(app)/tareas-pendientes/page.tsx` (para tareas)
  * `components/assign-modal.tsx` (para asignaciones)
  * `components/action-menu.tsx` (para acciones)
* **Notas de Auditoría:**
  * ✅ El contexto está completamente en inglés
  * ✅ Los tipos están bien sincronizados
  * ⚠️ **DESINCRONIZACIÓN DETECTADA:** Algunos tipos como `AssignmentItem` están definidos localmente en lugar de usar tipos centralizados

---

## 3. Contrato de API: `lib/api/`

### 3.1. API: `inventory.ts`

* **Estado Verificado:** [x] Sí / [ ] No
* **Estado de Unificación:** [x] Inglés / [ ] Mixto / [ ] Español
* **Tipos de Datos que Maneja:** `CreateProductData`, `UpdateProductData`
* **Componentes Consumidores:**
  * `app/(app)/inventario/page.tsx` (para operaciones CRUD)
  * `components/edit-product-modal.tsx` (para edición)
* **Notas de Auditoría:**
  * ✅ La API está completamente en inglés
  * ✅ Los tipos están bien sincronizados
  * ⚠️ **DESINCRONIZACIÓN DETECTADA:** Los tipos de la API (`CreateProductData`) no coinciden exactamente con `InventoryItem`

### 3.2. API: `auth.ts`

* **Estado Verificado:** [x] Sí / [ ] No
* **Estado de Unificación:** [x] Inglés / [ ] Mixto / [ ] Español
* **Tipos de Datos que Maneja:** `User` (implícitamente)
* **Componentes Consumidores:**
  * `useAuthStore.ts` (para operaciones de autenticación)
* **Notas de Auditoría:**
  * ✅ La API está completamente en inglés
  * ✅ La sincronización parece estar correcta

---

## 4. Contrato de Hooks: `hooks/`

### 4.1. Hook: `useInventory`

* **Estado Verificado:** [x] Sí / [ ] No
* **Estado de Unificación:** [x] Inglés / [ ] Mixto / [ ] Español
* **Tipo de Datos que Retorna:** `ApiResponse<any[]>` (⚠️ PROBLEMA CRÍTICO)
* **Componentes Consumidores:**
  * `app/(app)/inventario/page.tsx`
  * `components/inventory/grouped-inventory-table.tsx`
  * `components/inventory/parent-row.tsx`
  * `components/inventory/child-row.tsx`
* **Notas de Auditoría:**
  * ❌ **DESINCRONIZACIÓN CRÍTICA:** El hook retorna `any[]` en lugar de `InventoryItem[]`
  * ❌ **DESINCRONIZACIÓN CRÍTICA:** No hay transformación de datos para `GroupedProduct`
  * ⚠️ **PROBLEMA DE TIPADO:** El hook no está tipado correctamente

---

## 5. Resumen de Desincronizaciones Críticas

### 5.1. Nivel CRÍTICO (Bloquean la funcionalidad)

1. **Hook `useInventory` - Tipado Incorrecto**
   - **Archivo:** `hooks/useInventory.ts:17`
   - **Problema:** Retorna `any[]` en lugar de `InventoryItem[]`
   - **Impacto:** Pérdida de tipado en toda la aplicación de inventario
   - **Solución:** Cambiar `any[]` por `InventoryItem[]`

2. **Falta de Transformación de Datos**
   - **Archivo:** `hooks/useInventory.ts`
   - **Problema:** No transforma `InventoryItem[]` a `GroupedProduct[]`
   - **Impacto:** Los componentes que esperan `GroupedProduct` no funcionan
   - **Solución:** Implementar lógica de agrupación

### 5.2. Nivel ALTO (Afectan la consistencia)

1. **Tipos de API vs Tipos de Dominio**
   - **Archivo:** `lib/api/inventory.ts` vs `types/inventory.ts`
   - **Problema:** `CreateProductData` no coincide exactamente con `InventoryItem`
   - **Impacto:** Posibles errores en tiempo de ejecución
   - **Solución:** Alinear los tipos de la API con los tipos de dominio

2. **Tipos Locales en Contexto**
   - **Archivo:** `contexts/app-context.tsx`
   - **Problema:** `AssignmentItem` definido localmente
   - **Impacto:** Duplicación de tipos y posible inconsistencia
   - **Solución:** Mover a `types/inventory.ts`

---

## 6. Plan de Acción para Sincronización

### Fase 1: Corregir Tipado Crítico (Prioridad ALTA)
1. Corregir `useInventory.ts` para retornar `InventoryItem[]`
2. Implementar transformación a `GroupedProduct[]`

### Fase 2: Alinear Tipos de API (Prioridad MEDIA)
1. Revisar y alinear `CreateProductData` con `InventoryItem`
2. Crear tipos de transformación si es necesario

### Fase 3: Consolidar Tipos (Prioridad BAJA)
1. Mover tipos locales a `types/inventory.ts`
2. Eliminar duplicaciones

---

## 7. Checklist de Verificación Post-Refactorización

- [ ] `useInventory` retorna `InventoryItem[]` correctamente tipado
- [ ] La transformación a `GroupedProduct[]` funciona correctamente
- [ ] Los tipos de API coinciden con los tipos de dominio
- [ ] No hay tipos duplicados o definidos localmente
- [ ] Todos los componentes reciben datos correctamente tipados
- [ ] No hay errores de TypeScript en tiempo de compilación
- [ ] La funcionalidad de inventario funciona sin errores

---

**Última Actualización:** $(date)
**Auditoría Realizada por:** Operación Sincronía - GATI-C
**Estado General:** ⚠️ REQUIERE SINCRONIZACIÓN CRÍTICA
