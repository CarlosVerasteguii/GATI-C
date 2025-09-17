# Clarificación del Contexto de Negocio y Requisitos Reales de GATI-C

**Fecha:** 15 de Agosto, 2025
**Autor:** Carlos (Operador del Proyecto)
**Propósito:** Este documento sirve como una adenda a los documentos SRS y PRD originales. Proporciona un contexto de negocio del mundo real para guiar las decisiones de arquitectura y priorización, con el objetivo de evitar la sobreingeniería y enfocarse en el valor real para el usuario.

## Estado Actual del Proyecto

Estado: Desarrollo Activo (Hobby)
Entorno: No productivo.
Usuarios Activos: Cero (0).
Proyección: No se esperan usuarios activos en los próximos meses.
Implicación Estratégica Clave: Todas las decisiones de arquitectura y refactorización deben priorizar la calidad a largo plazo, la simplicidad de mantenimiento y la velocidad de desarrollo por encima de la continuidad del negocio a corto plazo o la compatibilidad hacia atrás. Se aceptan cambios disruptivos (como refactorizaciones "in-place" o "Big Bang" controlados) si conducen a una arquitectura final superior, ya que no hay riesgo de impactar a usuarios en producción.

---

## Bloque 1: El Contexto y la Escala Real

### 1.1. Operación Crítica del Día a Día
La funcionalidad más importante es la **facilidad y velocidad para realizar cambios, asignaciones y préstamos** sin la fricción de llenar formularios extensos. La velocidad de escritura en la base de datos es secundaria a la fluidez de la interfaz. El objetivo principal es la adopción del usuario.

### 1.2. Escala y Concurrencia
- **Usuarios Totales:** ~10 (internos, de confianza).
- **Concurrencia Máxima Realista:** 2-3 usuarios simultáneos. En un escenario excepcional y extremadamente improbable, un máximo de 4-5.
- **Patrón de Uso:** No se esperan picos de carga. El uso es esporádico y no existen auditorías sorpresa o cierres de mes intensivos.

### 1.3. El Costo Real del Error (Tolerancia a Fallos)
La clasificación de los escenarios de fallo, de peor a mejor, es la siguiente:
1.  **(PEOR)** Una interfaz lenta (ej. 5 segundos de carga).
2.  **(ACEPTABLE)** El sistema se cae por 10 minutos.
3.  **(MENOR)** Un registro de auditoría de un préstamo no se guarda.
4.  **(MENOR)** Un nuevo producto se guarda con una categoría incorrecta (se puede corregir manualmente).

**Conclusión:** La **experiencia de usuario y el rendimiento de la UI son más críticos** que la consistencia de datos al 100% o la disponibilidad del 100%. Los fallos ocasionales en operaciones secundarias como la auditoría son considerados molestias, no catástrofes.

### 1.4. Entorno de Red
El sistema operará exclusivamente en una **red local interna**. El acceso remoto se gestionará a través de la VPN existente del departamento, lo que significa que, desde la perspectiva de la aplicación, todas las conexiones son locales.

---

### 1.5. Directivas de Diseño UX/UI
- **Estética:** La interfaz debe ser moderna, fluida y visualmente llamativa. La simplicidad del proyecto aplica a la arquitectura y operación, no a la estética.
- **Plataforma primaria:** Uso 99% en monitor de escritorio. Se optimiza para pantallas grandes. Móvil es "nice-to-have" y no debe comprometer la experiencia de escritorio.
- **Filosofía de construcción:** Innovación controlada con micro-interacciones sobrias y componentes estándar; evitar soluciones ad-hoc difíciles de mantener. Performance y legibilidad por encima de efectos complejos.
- **Stack de estilos (6.6):** Tailwind CSS + shadcn/ui (con Radix) como stack oficial; theming con CSS variables y `next-themes` (modo oscuro/claro por clase). Se descartan "frameworks base" y mezclas híbridas.

## Bloque 2: Re-evaluación de Requisitos Clave

### 2.1. Sobre la "Trazabilidad Absoluta"
La trazabilidad es importante, pero no absoluta. **No es necesario que las operaciones fallen si el log de auditoría no se puede escribir.** Una llamada de "mejor esfuerzo" al servicio de auditoría es suficiente. La atomicidad transaccional para la auditoría es una sobreingeniería.

### 2.2. Sobre el "Monolito Modular Desacoplado"
La prohibición estricta de llamadas directas entre módulos es innecesaria. Una arquitectura más simple, donde los servicios se inyectan y se llaman directamente (nuestra implementación actual con `tsyringe`), es **suficiente y preferible** por su simplicidad y facilidad de mantenimiento.

### 2.3. Sobre las "Tareas Pendientes" (Carga/Retiro Rápido)
Esta funcionalidad es **INDISPENSABLE y CRÍTICA** para el éxito del proyecto. Es la característica principal que reduce la fricción y fomenta la adopción del sistema por parte de los usuarios. Su implementación debe ser una prioridad.
