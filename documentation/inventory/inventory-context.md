# Documento de Contexto del Inventario - GATI-C

## 1. Propósito y Misión del Inventario

### 1.1 ¿Para qué existe el inventario?
El inventario de GATI-C es el **corazón operativo** del sistema, diseñado para resolver el caos actual en la gestión de activos de TI de CFE. Su propósito fundamental es:

- **Centralizar** toda la información de equipos en un solo lugar
- **Eliminar** la pérdida de equipos por falta de control
- **Acelerar** las operaciones diarias de los técnicos
- **Proporcionar** transparencia total en el ciclo de vida de cada activo
- **Facilitar** la toma de decisiones basada en datos reales

### 1.2 Transformación del Proceso Actual
**Antes (Proceso Manual)**:
- Hojas de cálculo dispersas y desactualizadas
- Pérdida frecuente de equipos
- Tiempo excesivo buscando información
- Sin trazabilidad de movimientos
- Decisiones basadas en información incompleta

**Después (Con GATI-C)**:
- Sistema centralizado y en tiempo real
- Control total del ciclo de vida de activos
- Operaciones rápidas y eficientes
- Trazabilidad completa de cada movimiento
- Dashboard con métricas claras para decisiones

## 2. Escenarios de Uso Principales

### 2.1 Escenario: Llegada de Nuevo Equipamiento
**Situación**: Llegan 50 laptops nuevas con números de serie específicos

**Flujo Actual (Problemático)**:
1. Técnico recibe equipos
2. Anota en hoja de cálculo personal
3. No hay control centralizado
4. Información se pierde o desactualiza

**Flujo con GATI-C**:
1. **Carga Rápida**: Técnico crea placeholder con números de serie
2. **Tarea Pendiente**: Sistema registra entrada pendiente
3. **Procesamiento**: Se completa información completa (proveedor, contrato, etc.)
4. **Inventario Actualizado**: 50 laptops disponibles inmediatamente

**Beneficios**:
- Control inmediato desde la recepción
- Trazabilidad completa del origen
- Disponibilidad instantánea para asignación

### 2.2 Escenario: Asignación Rápida de Equipos
**Situación**: Usuario necesita un teclado para su estación de trabajo

**Flujo Actual (Problemático)**:
1. Técnico busca en múltiples hojas de cálculo
2. No sabe cuántos teclados hay disponibles
3. Asigna sin registrar adecuadamente
4. No hay seguimiento posterior

**Flujo con GATI-C**:
1. **Búsqueda Inteligente**: Ve "Teclado Logitech K120 - 10 4 6"
   - 10 total, 4 disponibles, 6 asignados/prestados
2. **Asignación Rápida**: Selecciona y asigna en segundos
3. **División Automática**: Sistema crea registro separado para el teclado asignado
4. **Auditoría**: Queda registrado quién, cuándo y para qué

**Beneficios**:
- Visión clara de disponibilidad
- Asignación rápida sin interrumpir trabajo
- Trazabilidad completa

### 2.3 Escenario: Gestión de Lotes de Consumibles
**Situación**: Control de 120 cables de red Cat6

**Flujo Actual (Problemático)**:
1. No hay control de stock
2. Se toman cables sin registrar
3. No se sabe cuándo reabastecer
4. Pérdidas frecuentes

**Flujo con GATI-C**:
1. **Lote Agrupado**: Se ve como "Cable Cat6 1m - 120 unidades"
2. **Retiro Controlado**: Al tomar 5 cables, sistema registra automáticamente
3. **Stock Actualizado**: Muestra 115 restantes
4. **Alertas**: Notifica cuando stock es bajo

**Beneficios**:
- Control preciso de consumibles
- Prevención de desabasto
- Optimización de compras

### 2.4 Escenario: Préstamo Temporal de Equipos
**Situación**: Usuario necesita laptop para presentación externa

**Flujo Actual (Problemático)**:
1. Préstamo verbal sin registro
2. Sin fecha de devolución
3. Equipo se pierde o no se devuelve
4. Sin responsabilidad clara

**Flujo con GATI-C**:
1. **Solicitud de Préstamo**: Usuario solicita laptop específica
2. **Registro Completo**: Fecha de salida, devolución esperada, propósito
3. **Seguimiento**: Sistema alerta sobre préstamos vencidos
4. **Devolución**: Registro automático al devolver

**Beneficios**:
- Control total de préstamos
- Responsabilidad clara
- Prevención de pérdidas

### 2.5 Escenario: Retiro de Equipos Obsoletos
**Situación**: 15 monitores CRT obsoletos deben ser retirados

**Flujo Actual (Problemático)**:
1. Retiro sin documentación
2. No hay registro de disposición
3. Sin justificación del retiro
4. Pérdida de trazabilidad

**Flujo con GATI-C**:
1. **Retiro Rápido**: Marca monitores para retiro
2. **Procesamiento**: Completa formulario con motivo y método de disposición
3. **Documentación**: Registra destino final (reciclaje, venta, etc.)
4. **Auditoría**: Historial completo del retiro

**Beneficios**:
- Cumplimiento normativo
- Trazabilidad completa
- Optimización de espacio

## 3. Roles y Responsabilidades en el Inventario

### 3.1 Administrador
**Responsabilidades**:
- Supervisar todo el inventario
- Procesar tareas pendientes complejas
- Gestionar configuración del sistema
- Revisar reportes y métricas
- Aprobar retiros de alto valor

**Escenarios Típicos**:
- Revisar dashboard de inventario diariamente
- Procesar cargas masivas de equipos
- Aprobar retiros de equipos costosos
- Configurar categorías y marcas nuevas

### 3.2 Editor
**Responsabilidades**:
- Operaciones diarias de inventario
- Asignaciones y préstamos rápidos
- Carga rápida de nuevos equipos
- Retiro rápido de equipos

**Escenarios Típicos**:
- Asignar equipos a usuarios
- Registrar llegada de nuevos equipos
- Procesar retiros de equipos
- Mantener inventario actualizado

### 3.3 Lector
**Responsabilidades**:
- Consultar disponibilidad de equipos
- Ver detalles de productos
- Registrar retiros básicos

**Escenarios Típicos**:
- Buscar equipos disponibles
- Ver especificaciones técnicas
- Solicitar equipos a través de editores

## 4. Casos de Uso Específicos por Tipo de Activo

### 4.1 Equipos Serializados (Laptops, Servidores)
**Características**:
- Número de serie único
- Alto valor
- Trazabilidad individual crítica

**Casos de Uso**:
- Asignación permanente a usuarios
- Préstamo temporal para proyectos
- Retiro por obsolescencia

**Consideraciones Especiales**:
- Cada unidad debe ser rastreada individualmente
- Documentos adjuntos por equipo
- Historial completo de movimientos

### 4.2 Consumibles No Serializados (Cables, Memoria RAM)
**Características**:
- Sin número de serie
- Bajo valor individual
- Gestión por lotes

**Casos de Uso**:
- Control de stock
- Reabastecimiento automático
- Uso masivo en proyectos
- Retiro por desgaste

**Consideraciones Especiales**:
- Agrupación por lotes
- Control de cantidades
- Alertas de stock bajo

## 5. Flujos de Trabajo Críticos //Escenarios a muy futuro

### 5.1 Ciclo de Vida de un Activo
1. **Adquisición**: Compra y recepción
2. **Registro**: Carga en sistema
3. **Asignación**: Uso por usuarios
4. **Reasignación**: Cambio de usuario o propósito
5. **Retiro**: Disposición final

### 5.2 Flujo de Emergencias
**Situación**: Equipo crítico falla y necesita reemplazo inmediato

**Proceso**:
1. **Identificación**: Localizar equipo de reemplazo disponible
2. **Asignación Rápida**: Asignar sin burocracia
3. **Documentación**: Registrar asignación posteriormente
4. **Seguimiento**: Monitorear hasta resolución

### 5.3 Flujo de Auditoría
**Situación**: Auditoría externa requiere información de activos

**Proceso**:
1. **Reporte Automático**: Generar reporte completo
2. **Verificación**: Confirmar datos con inventario físico
3. **Documentación**: Adjuntar documentos de respaldo
4. **Seguimiento**: Registrar hallazgos y acciones

## 6. Métricas y KPIs del Inventario

### 6.1 Métricas Operativas
- **Tiempo de Asignación**: Promedio para asignar equipos
- **Disponibilidad**: Porcentaje de equipos disponibles
- **Rotación**: Frecuencia de uso de equipos
- **Pérdidas**: Tasa de equipos perdidos o no devueltos

### 6.2 Métricas Financieras
- **Valor Total**: Valor del inventario
- **Depreciación**: Pérdida de valor por tiempo
- **Costo de Operación**: Gastos de mantenimiento
- **ROI**: Retorno sobre inversión en equipos

### 6.3 Métricas de Calidad
- **Precisión**: Exactitud del inventario vs. realidad
- **Actualización**: Frecuencia de actualizaciones
- **Cumplimiento**: Adherencia a políticas
- **Satisfacción**: Percepción de usuarios

## 7. Beneficios Esperados

### 7.1 Beneficios Inmediatos
- **Reducción de Pérdidas**: Control total previene extravíos
- **Eficiencia Operativa**: Operaciones más rápidas
- **Transparencia**: Visibilidad completa del inventario
- **Responsabilidad**: Trazabilidad de cada movimiento

### 7.2 Beneficios a Mediano Plazo
- **Optimización de Compras**: Datos para decisiones de compra
- **Mejora de Servicios**: Equipos disponibles cuando se necesitan
- **Cumplimiento**: Cumplimiento de políticas y auditorías
- **Ahorro de Costos**: Reducción de pérdidas y duplicaciones

### 7.3 Beneficios a Largo Plazo
- **Inteligencia de Negocio**: Datos para estrategias de TI
- **Escalabilidad**: Sistema que crece con la organización
- **Innovación**: Base para nuevas funcionalidades
- **Competitividad**: Ventaja operativa sobre competidores

## 8. Consideraciones Especiales

### 8.1 Seguridad y Confidencialidad
- **Acceso Controlado**: Solo usuarios autorizados
- **Auditoría Completa**: Registro de todas las acciones
- **Backup Regular**: Protección de datos críticos
- **Cumplimiento**: Adherencia a políticas de seguridad

### 8.2 Integración con Otros Sistemas
- **Sistemas de Compras**: Integración con procesos de adquisición
- **Sistemas de RH**: Asignación a empleados
- **Sistemas Financieros**: Contabilización de activos

### 8.3 Escalabilidad y Crecimiento
- **Crecimiento del Inventario**: De 1,200 a 3,000+ activos
- **Nuevos Tipos de Activos**: Adaptación a nuevas tecnologías
- **Usuarios Adicionales**: Crecimiento del equipo

## 9. Conclusiones

El inventario de GATI-C no es solo un sistema técnico, sino una **herramienta estratégica** que transforma la gestión de activos de TI de CFE. Su implementación exitosa generará:

- **Control Total**: Sobre todos los activos de TI
- **Eficiencia Operativa**: En todas las operaciones diarias
- **Transparencia Completa**: En el ciclo de vida de activos
- **Toma de Decisiones Informada**: Basada en datos reales
- **Cumplimiento Normativo**: En auditorías y reportes

El inventario es el **fundamento** sobre el cual se construye toda la funcionalidad de GATI-C, proporcionando la base de datos y los flujos de trabajo que permiten a CFE gestionar sus activos de TI de manera profesional, eficiente y auditable.

---

**Documento creado**: 2025-07-25
**Última actualización**: 2025-07-25  
**Responsable**: Equipo de Desarrollo GATI-C  
**Versión**: 1.0 