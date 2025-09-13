# GATI-C: Hoja de Ruta de Refactorización ("La Gran Sincronización")

## 1. Visión y Principios Guía

**Visión:** Transformar el codebase de GATI-C de su estado actual, con deuda técnica y contratos de datos desalineados, a un estado robusto, mantenible y perfectamente sincronizado con la verdad del negocio y del backend.

**Principios Guía (Nuestra Constitución):**
Toda acción de refactorización debe adherirse a los siguientes principios, derivados de nuestro `01-business-context.md`:

- **La Simplicidad es Rey:** Priorizar soluciones pragmáticas y sencillas sobre la "pureza" arquitectónica. Evitar la sobre-ingeniería.
- **La UX Fluida es No-Negociable:** Las decisiones técnicas no deben comprometer la experiencia del usuario. El frontend debe ser resiliente a fallos del backend, degradándose elegantemente en lugar de romperse.
- **La Trazabilidad es de "Mejor Esfuerzo":** El logging y la auditoría son importantes, pero no deben bloquear la funcionalidad principal.
- **La Verdad es Única y Automatizada:** La única fuente de verdad para la *estructura* de los datos es `backend/prisma.schema` y sus tipos generados.

---

## 2. Hoja de Ruta Estratégica

Este plan describe los hitos principales. Las tácticas específicas para cada hito se decidirán de forma incremental a medida que avancemos y aprendamos.

### ✅ **Hito 0: Establecimiento de la Fundación (COMPLETADO)**
- **0.1. Purga Documental:** Consolidación de toda la documentación en un único y coherente "Centro de Mando" en `/docs`.
- **0.2. Establecimiento de la Verdad Atómica:** Implementación de la generación automática de tipos desde Prisma.
- **0.3. Creación de una Red de Seguridad de Pruebas:** Configuración de un entorno de pruebas unitarias (Vitest).

### ➡️ **Hito 1: Saneamiento y Alineación de Módulos Críticos (EN CURSO)**
- **1.1. Módulo de Autenticación (COMPLETADO):** Se reemplazó la capa de validación sobre-diseñada por un saneador pragmático y resiliente, alineando el manejo de datos de `User` con los principios de negocio.
- **1.2. Módulo de Inventario (PRÓXIMO):** Refactorizar el módulo más grande y complejo para alinear su contrato de datos (`Product`, etc.) y lógica con la fuente de verdad.
- **1.3. Sincronización de otros Módulos Menores:** (Por definir - ej. Tareas, Auditoría, etc.).

### **Hito 2: Saneamiento General y Limpieza Final**
- **2.1. Eliminación de Tipos Legados:** Erradicar completamente los tipos manuales y en español (`types/inventory.ts`) una vez que ningún módulo dependa de ellos.
- **2.2. Revisión de Consistencia de UI:** Asegurar que toda la interfaz de usuario utilice los nuevos contratos de datos de manera consistente.

### **Hito 3: Visión a Largo Plazo**
- **3.1. Establecer Pruebas E2E Robustas:** Con un código base estable, construir un conjunto de pruebas E2E que validen los flujos de negocio críticos.
- **3.2. Optimización de Rendimiento:** Analizar y optimizar el rendimiento de los componentes más pesados.

---

## 3. Proceso de Trabajo

Cada tarea dentro de estos hitos seguirá nuestro proceso refinado:
**Estrategia -> Auditoría Específica -> Plan Táctico -> Debate con "Rompedor de Planes" -> Ejecución Quirúrgica -> Verificación.**

