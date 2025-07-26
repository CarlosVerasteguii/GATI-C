# Documento de Contexto del Inventario - GATI-C v2.0

## 📋 Resumen Ejecutivo

Este documento define el **contexto general del inventario** de GATI-C, estableciendo el **patrón arquitectónico**, **decisiones técnicas** y **criterios de diseño** que deben seguirse para mantener coherencia y escalabilidad en todo el sistema.

**Propósito**: Ser la **fuente única de verdad** para tomar decisiones sobre el inventario, asegurando alineación con PRD/SRS y consistencia técnica.

---

## 🏗️ 1. ARQUITECTURA Y PATRÓN TÉCNICO

### 1.1 Stack Tecnológico (Definido por SRS)

**Frontend:**
- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript 5+
- **UI**: React 18+ + Tailwind CSS + shadcn/ui
- **Estado**: Zustand (global) + Context API (local)
- **Formularios**: React Hook Form + Zod validation

**Backend (Patrón Definido):**
- **Runtime**: Node.js (LTS)
- **Framework**: Express.js + TypeScript
- **Base de Datos**: MySQL 8.0+ con Prisma ORM
- **Validación**: Zod schemas
- **Autenticación**: JWT (cookie httpOnly)
- **Patrón**: Monolito modular (módulos desacoplados internamente)

### 1.2 Patrón de Comunicación (SRS)

**✅ CORRECTO:**
- **Frontend ↔ Backend**: RESTful API versionada (`/api/v1/`)
- **Entre módulos backend**: Event Bus interno (Mediator pattern)
- **NO permitido**: Imports directos entre módulos (`import { function } from '../other-module'`)

**Respuestas Estándar:**
```typescript
// Éxito
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "...", "message": "..." } }
```

### 1.3 Estructura de Módulos

**Módulos Core (SRS):**
1. **Inventory**: Productos, stock, estados de ciclo de vida
2. **IAM**: Usuarios, roles, permisos, autenticación
3. **Task Management**: Tareas pendientes (Carga/Retiro Rápido)
4. **Document Management**: Subida, almacenamiento, soft-deletes
5. **Auditing**: Logging y tracking de historial

---

## 🎯 2. CONTEXTO DEL INVENTARIO

### 2.1 Propósito y Misión del Inventario

El inventario de GATI-C es el **corazón operativo** del sistema, diseñado para resolver el caos actual en la gestión de activos de TI de CFE. Su propósito fundamental es:

- **Centralizar** toda la información de equipos en un solo lugar
- **Eliminar** la pérdida de equipos por falta de control
- **Acelerar** las operaciones diarias de los técnicos
- **Proporcionar** transparencia total en el ciclo de vida de cada activo
- **Facilitar** la toma de decisiones basada en datos reales

### 2.2 Transformación del Proceso Actual

**Antes (Proceso Manual):**
- Hojas de cálculo dispersas y desactualizadas
- Pérdida frecuente de equipos
- Tiempo excesivo buscando información
- Sin trazabilidad de movimientos
- Decisiones basadas en información incompleta

**Después (Con GATI-C):**
- Sistema centralizado y en tiempo real
- Control total del ciclo de vida de activos
- Operaciones rápidas y eficientes
- Trazabilidad completa de cada movimiento
- Dashboard con métricas claras para decisiones

---

## �� 3. FLUJOS DE TRABAJO CRÍTICOS

### 3.1 Escenario: Llegada de Nuevo Equipamiento

**Situación**: Llegan 50 laptops nuevas con números de serie específicos

**Flujo Actual (Problemático):**
1. Técnico recibe equipos
2. Anota en hoja de cálculo personal
3. No hay control centralizado
4. Información se pierde o desactualiza

**Flujo con GATI-C:**
1. **Carga Rápida**: Técnico crea placeholder con números de serie
2. **Tarea Pendiente**: Sistema registra entrada pendiente
3. **Procesamiento**: Se completa información completa (proveedor, contrato, etc.)
4. **Inventario Actualizado**: 50 laptops disponibles inmediatamente

**Beneficios:**
- Control inmediato desde la recepción
- Trazabilidad completa del origen
- Disponibilidad instantánea para asignación

**Endpoints Involucrados:**
- `POST /api/v1/tasks/quick-load` (crear tarea pendiente)
- `GET /api/v1/tasks/pending` (listar tareas)
- `POST /api/v1/tasks/:id/process` (procesar tarea)
- `POST /api/v1/inventory/products` (crear productos)

### 3.2 Escenario: Asignación Rápida de Equipos

**Situación**: Usuario necesita un teclado para su estación de trabajo

**Flujo Actual (Problemático):**
1. Técnico busca en múltiples hojas de cálculo
2. No sabe cuántos teclados hay disponibles
3. Asigna sin registrar adecuadamente
4. No hay seguimiento posterior

**Flujo con GATI-C:**
1. **Búsqueda Inteligente**: Ve "Teclado Logitech K120 - 10 4 6"
   - 10 total, 4 disponibles, 6 asignados/prestados
2. **Asignación Rápida**: Selecciona y asigna en segundos
3. **División Automática**: Sistema crea registro separado para el teclado asignado
4. **Auditoría**: Queda registrado quién, cuándo y para qué

**Beneficios:**
- Visión clara de disponibilidad
- Asignación rápida sin interrumpir trabajo
- Trazabilidad completa

**Endpoints Involucrados:**
- `GET /api/v1/inventory/products?search=teclado` (búsqueda)
- `POST /api/v1/inventory/products/:id/assign` (asignar)
- `POST /api/v1/audit/log` (registrar auditoría)

### 3.3 Escenario: Gestión de Lotes de Consumibles

**Situación**: Control de 120 cables de red Cat6

**Flujo Actual (Problemático):**
1. No hay control de stock
2. Se toman cables sin registrar
3. No se sabe cuándo reabastecer
4. Pérdidas frecuentes

**Flujo con GATI-C:**
1. **Lote Agrupado**: Se ve como "Cable Cat6 1m - 120 unidades"
2. **Retiro Controlado**: Al tomar 5 cables, sistema registra automáticamente
3. **Stock Actualizado**: Muestra 115 restantes
4. **Alertas**: Notifica cuando stock es bajo

**Beneficios:**
- Control preciso de consumibles
- Prevención de desabasto
- Optimización de compras

**Endpoints Involucrados:**
- `GET /api/v1/inventory/products/:id` (ver stock)
- `POST /api/v1/inventory/products/:id/withdraw` (retirar)
- `GET /api/v1/thresholds/alerts` (alertas de stock bajo)

### 3.4 Escenario: Préstamo Temporal de Equipos

**Situación**: Usuario necesita laptop para presentación externa

**Flujo Actual (Problemático):**
1. Préstamo verbal sin registro
2. Sin fecha de devolución
3. Equipo se pierde o no se devuelve
4. Sin responsabilidad clara

**Flujo con GATI-C:**
1. **Solicitud de Préstamo**: Usuario solicita laptop específica
2. **Registro Completo**: Fecha de salida, devolución esperada, propósito
3. **Seguimiento**: Sistema alerta sobre préstamos vencidos
4. **Devolución**: Registro automático al devolver

**Beneficios:**
- Control total de préstamos
- Responsabilidad clara
- Prevención de pérdidas

### 3.5 Escenario: Retiro de Equipos Obsoletos

**Situación**: 15 monitores CRT obsoletos deben ser retirados

**Flujo Actual (Problemático):**
1. Retiro sin documentación
2. No hay registro de disposición
3. Sin justificación del retiro
4. Pérdida de trazabilidad

**Flujo con GATI-C:**
1. **Retiro Rápido**: Marca monitores para retiro
2. **Procesamiento**: Completa formulario con motivo y método de disposición
3. **Documentación**: Registra destino final (reciclaje, venta, etc.)
4. **Auditoría**: Historial completo del retiro

**Beneficios:**
- Cumplimiento normativo
- Trazabilidad completa
- Optimización de espacio

---

## 👥 4. ROLES Y RESPONSABILIDADES EN EL INVENTARIO

### 4.1 Administrador

**Responsabilidades:**
- Supervisar todo el inventario
- Procesar tareas pendientes complejas
- Gestionar configuración del sistema
- Revisar reportes y métricas
- Aprobar retiros de alto valor

**Escenarios Típicos:**
- Revisar dashboard de inventario diariamente
- Procesar cargas masivas de equipos
- Aprobar retiros de equipos costosos
- Configurar categorías y marcas nuevas

**Endpoints de Acceso:**
- `GET /api/v1/inventory/dashboard` (métricas)
- `POST /api/v1/thresholds/*` (configurar umbrales)
- `GET /api/v1/audit/reports` (reportes de auditoría)
- `POST /api/v1/inventory/products/:id/retire` (aprobar retiros)

### 4.2 Editor

**Responsabilidades:**
- Operaciones diarias de inventario
- Asignaciones y préstamos rápidos
- Carga rápida de nuevos equipos
- Retiro rápido de equipos

**Escenarios Típicos:**
- Asignar equipos a usuarios
- Registrar llegada de nuevos equipos
- Procesar retiros de equipos
- Mantener inventario actualizado

**Endpoints de Acceso:**
- `POST /api/v1/inventory/products/:id/assign` (asignar)
- `POST /api/v1/inventory/products/:id/lend` (prestar)
- `POST /api/v1/tasks/quick-load` (carga rápida)
- `POST /api/v1/tasks/quick-retire` (retiro rápido)

### 4.3 Lector

**Responsabilidades:**
- Consultar disponibilidad de equipos
- Ver detalles de productos
- Registrar retiros básicos

**Escenarios Típicos:**
- Buscar equipos disponibles
- Ver especificaciones técnicas
- Solicitar equipos a través de editores

**Endpoints de Acceso:**
- `GET /api/v1/inventory/products` (consultar)
- `GET /api/v1/inventory/products/:id` (ver detalles)
- `POST /api/v1/inventory/products/:id/request-retire` (solicitar retiro)

---

## 🗄️ 5. MODELO DE DATOS

### 5.1 Entidades Principales

**Product (InventoryItem):**
```typescript
interface InventoryItem {
  id: number;
  nombre: string;
  marca: string;
  modelo: string;
  numeroSerie: string | null;
  categoria: string;
  estado: "Disponible" | "Asignado" | "Prestado" | "En Mantenimiento" | "Pendiente de Retiro" | "Retirado";
  cantidad: number;
  fechaIngreso: string;
  ubicacion?: string;
  proveedor?: string;
  costo?: number;
  fechaAdquisicion?: string;
  isSerialized?: boolean;
  historial?: HistoryEvent[];
  documentosAdjuntos?: Document[];
}
```

**Threshold (Umbrales):**
```typescript
interface InventoryLowStockThresholds {
  globalThreshold: number;
  categoryThresholds: Record<string, number>;
  productThresholds: Record<number, number>;
}
```

**Task (Tarea Pendiente):**
```typescript
interface PendingTask {
  id: number;
  type: "carga_rapida" | "retiro_rapido";
  status: "Pendiente" | "En Proceso" | "Completada" | "Cancelada";
  creatorId: number;
  details: any;
  createdAt: string;
  updatedAt: string;
}
```

### 5.2 Relaciones Clave

- **Product → Brand**: Many-to-One
- **Product → Category**: Many-to-One
- **Product → Location**: Many-to-One
- **Product → Document**: One-to-Many
- **Product → HistoryEvent**: One-to-Many
- **User → Task**: One-to-Many (creator)
- **User → Assignment**: One-to-Many

---

## 🏗️ 6. DECISIONES ARQUITECTÓNICAS

### 6.1 Gestión de Estado

**Frontend:**
- **Zustand**: Para estado global (inventario, usuarios, configuración)
- **Context API**: Para estado local de componentes
- **localStorage**: Para persistencia temporal (hasta backend real)

**Backend:**
- **Stateless**: No guardar estado en memoria del servidor
- **Prisma**: Para ORM y migraciones de base de datos
- **Event Bus**: Para comunicación entre módulos

### 6.2 Validación y Seguridad

**Validación:**
- **Frontend**: Zod schemas para validación de formularios
- **Backend**: Zod schemas para validación de requests
- **Compartir schemas**: Entre frontend y backend para consistencia

**Seguridad:**
- **JWT**: Autenticación con cookie httpOnly
- **RBAC**: Middleware para validación de roles
- **Sanitización**: De todas las entradas de usuario

### 6.3 Performance y Escalabilidad

**Optimizaciones:**
- **Paginación**: Para listas grandes (25-50 items por página)
- **Búsqueda indexada**: Por nombre, número de serie, categoría
- **Caching**: Para datos estáticos (categorías, marcas, ubicaciones)
- **Lazy loading**: Para componentes pesados

**Escalabilidad:**
- **Diseñado para**: 1,200 activos actuales
- **Preparado para**: 3,000+ activos en 5 años
- **Migración futura**: De monolito modular a microservicios

---

## 📊 7. CASOS DE USO ESPECÍFICOS POR TIPO DE ACTIVO

### 7.1 Equipos Serializados (Laptops, Servidores)

**Características:**
- Número de serie único
- Alto valor
- Trazabilidad individual crítica

**Casos de Uso:**
- Asignación permanente a usuarios
- Préstamo temporal para proyectos
- Retiro por obsolescencia

**Consideraciones Especiales:**
- Cada unidad debe ser rastreada individualmente
- Documentos adjuntos por equipo
- Historial completo de movimientos

### 7.2 Consumibles No Serializados (Cables, Memoria RAM)

**Características:**
- Sin número de serie
- Bajo valor individual
- Gestión por lotes

**Casos de Uso:**
- Control de stock
- Reabastecimiento automático
- Uso masivo en proyectos
- Retiro por desgaste

**Consideraciones Especiales:**
- Agrupación por lotes
- Control de cantidades
- Alertas de stock bajo

---

## 📈 8. MÉTRICAS Y KPIs DEL INVENTARIO

### 8.1 Métricas Operativas

- **Tiempo de Asignación**: Promedio para asignar equipos
- **Disponibilidad**: Porcentaje de equipos disponibles
- **Rotación**: Frecuencia de uso de equipos
- **Pérdidas**: Tasa de equipos perdidos o no devueltos

### 8.2 Métricas Financieras

- **Valor Total**: Valor del inventario
- **Depreciación**: Pérdida de valor por tiempo
- **Costo de Operación**: Gastos de mantenimiento
- **ROI**: Retorno sobre inversión en equipos

### 8.3 Métricas de Calidad

- **Precisión**: Exactitud del inventario vs. realidad
- **Actualización**: Frecuencia de actualizaciones
- **Cumplimiento**: Adherencia a políticas
- **Satisfacción**: Percepción de usuarios

---

## 🚀 9. ROADMAP DE IMPLEMENTACIÓN

### 9.1 Fase Actual (Frontend + Mock)

**✅ COMPLETADO:**
- UI/UX completa y accesible
- Gestión de estado con Context API
- Flujos de trabajo implementados
- Documentación técnica detallada

**🔄 EN PROGRESO:**
- Endpoints mock para umbrales
- Integración frontend con API mock
- Validación de flujos end-to-end

### 9.2 Fase Siguiente (Backend Real)

**📋 PLANIFICADO:**
- Implementar endpoints reales siguiendo SRS
- Migrar de localStorage a base de datos
- Implementar autenticación JWT
- Agregar logging de auditoría

**🎯 OBJETIVOS:**
- Persistencia real de datos
- Validación de roles en backend
- Trazabilidad completa
- Performance optimizada

### 9.3 Fase Futura (Enterprise)

**🔮 VISIÓN:**
No definida aun
---

## ⚠️ 10. CONSIDERACIONES ESPECIALES

### 10.1 Seguridad y Confidencialidad

- **Acceso Controlado**: Solo usuarios autorizados
- **Auditoría Completa**: Registro de todas las acciones
- **Backup Regular**: Protección de datos críticos
- **Cumplimiento**: Adherencia a políticas de seguridad

### 10.2 Integración con Otros Sistemas

- **Sistemas de Compras**: Integración con procesos de adquisición
- **Sistemas de RH**: Asignación a empleados
- **Sistemas Financieros**: Contabilización de activos

### 10.3 Escalabilidad y Crecimiento

- **Crecimiento del Inventario**: De 1,200 a 3,000+ activos
- **Nuevos Tipos de Activos**: Adaptación a nuevas tecnologías
- **Usuarios Adicionales**: Crecimiento del equipo

---

## 📝 11. DECISIONES TÉCNICAS CLAVE

### 11.1 ¿Por qué este patrón?

**Monolito Modular (SRS):**
- **Ventajas**: Desarrollo rápido, debugging fácil, deployment simple
- **Desventajas**: Acoplamiento, escalabilidad limitada
- **Migración futura**: A microservicios cuando sea necesario

**RESTful API:**
- **Ventajas**: Estándar, fácil de entender, cacheable
- **Alternativas consideradas**: GraphQL (rechazado por complejidad)
- **Decisión**: REST para simplicidad y compatibilidad

**TypeScript:**
- **Ventajas**: Type safety, mejor DX, menos bugs
- **Costo**: Curva de aprendizaje, overhead de tipos
- **Decisión**: TypeScript para robustez enterprise

### 11.2 Criterios de Decisión

**Para cualquier nueva funcionalidad:**
1. **¿Está alineada al PRD/SRS?**
2. **¿Sigue el patrón establecido?**
3. **¿Es escalable y mantenible?**
4. **¿Cumple con estándares de seguridad?**
5. **¿Está bien documentada?**

---

## 🎯 12. BENEFICIOS ESPERADOS

### 12.1 Beneficios Inmediatos

- **Reducción de Pérdidas**: Control total previene extravíos
- **Eficiencia Operativa**: Operaciones más rápidas
- **Transparencia**: Visibilidad completa del inventario
- **Responsabilidad**: Trazabilidad de cada movimiento

### 12.2 Beneficios a Mediano Plazo

- **Optimización de Compras**: Datos para decisiones de compra
- **Mejora de Servicios**: Equipos disponibles cuando se necesitan
- **Cumplimiento**: Cumplimiento de políticas y auditorías
- **Ahorro de Costos**: Reducción de pérdidas y duplicaciones

### 12.3 Beneficios a Largo Plazo

- **Inteligencia de Negocio**: Datos para estrategias de TI
- **Escalabilidad**: Sistema que crece con la organización
- **Innovación**: Base para nuevas funcionalidades
- **Competitividad**: Ventaja operativa sobre competidores

---

## 🏁 13. CONCLUSIONES

El inventario de GATI-C no es solo un sistema técnico, sino una **herramienta estratégica** que transforma la gestión de activos de TI de CFE. Su implementación exitosa generará:

- **Control Total**: Sobre todos los activos de TI
- **Eficiencia Operativa**: En todas las operaciones diarias
- **Transparencia Completa**: En el ciclo de vida de activos
- **Toma de Decisiones Informada**: Basada en datos reales
- **Cumplimiento Normativo**: En auditorías y reportes

### **Patrón Establecido**

**Para cualquier decisión sobre el inventario, consulta este documento para asegurar:**
- Alineación con PRD/SRS
- Consistencia técnica
- Escalabilidad futura
- Mantenibilidad del código

El inventario es el **fundamento** sobre el cual se construye toda la funcionalidad de GATI-C, proporcionando la base de datos y los flujos de trabajo que permiten a CFE gestionar sus activos de TI de manera profesional, eficiente y auditable.

---

**Documento creado**: 2025-07-25  
**Última actualización**: 2025-07-25  
**Responsable**: Equipo de Desarrollo GATI-C  
**Versión**: 2.0  
**Alineado a**: PRD v1.0, SRS v2.0 (Enterprise-Grade) 