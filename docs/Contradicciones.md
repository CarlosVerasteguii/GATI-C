# GATI‑C — Informe de Contradicciones Unificado por Categorías
---

## 1) Gobernanza y Permisos (RBAC)

### 1.1 Rol “Lector”: descripción vs matriz de permisos

**Reportado por**: Gemini Code Assist, Gemini CLI, Cursor, Codex CLI, Codex Extension, Codex Website (v1–v4)

#### \[Gemini Code Assist]

**Título**: *Ambigüedad: Permisos del Rol 'Lector' para Eliminar Productos*

* **Prueba A** (docs/02-prd.md): "Rol: Lector Principalmente consultan la disponibilidad de equipos y registran retiros. El flujo de 'Retiro Rápido' es esencial para ellos."
* **Prueba B** (docs/02-prd.md): "| Eliminar Productos (a papelera) | Sí \[para Administrador] | Sí \[para Editor] | Sí \[para Lector] | Los archivos eliminados se mueven a papelera, con registro de la acción. |"
* **Análisis**: La descripción del rol es consultiva/operativa acotada, pero la matriz otorga **eliminación**; contradicción con la semántica de “Lector”.
* **Pregunta estratégica**: ¿Debe el Lector tener permisos de eliminación o debe corregirse la matriz?

#### \[Gemini CLI]

**Bloque relevante**:

* Señala contradicción entre tabla de permisos y responsabilidades del Lector (gestión de atributos compartida vs exclusiva del Administrador en la narrativa). Formula pregunta sobre fuente de verdad para **gestión de atributos**.

#### \[Codex CLI]

**Título**: *Contradicción interna (PRD): Permisos del rol “Lector” sobre eliminación de productos*

* **Prueba A**: docs/02-prd.md:7 — "Rol: Lector..."
* **Prueba B**: docs/02-prd.md:20 — "Eliminar Productos (a papelera) | Sí | Sí | Sí..."
* **Análisis**: Viola principio de privilegio mínimo y genera riesgo de pérdida de datos. Impacto en autorización y confianza operativa.
* **Pregunta**: ¿El Lector realmente puede eliminar productos o es un error?

#### \[Codex Extension]

**Ítem 1**: *Permisos del Rol “Lector” (Descripción vs. Matriz de Permisos)*

* **Prueba A**: docs/02-prd.md:7 — "Rol: Lector... registran retiros. El flujo ‘Retiro Rápido’ es esencial..."
* **Prueba B**: docs/02-prd.md:22–24 — "| Crear (Carga Rápida/Retiro Rápido) | Sí | Sí | No | ... |" / "| Procesar (Completar Form.) | Sí | Sí | No | ... |" / "| Ver Lista de Tareas Pendientes | Sí | Sí | No | ... |"
* **Análisis**: El Lector depende de Retiro Rápido pero **no** puede crear, procesar ni ver **Tareas Pendientes**. Contradicción directa.
* **Pregunta**: ¿Debe el Lector iniciar/procesar Retiros Rápidos? Si no, corregir descripción; si sí, habilitar permisos.

**Ítem 2**: *“Lector” puede eliminar productos*

* **Prueba B**: docs/02-prd.md:20 — eliminación con papelera "Sí" para Lector.
* **Análisis**: Incompatible con rol de lectura y con práctica de RBAC.
* **Pregunta**: ¿El Lector debe ser estrictamente read-only?

#### \[Codex Website — Versiones]

**Versión 1 / 2 / 4**

* Reiteran la contradicción Lector vs Retiro Rápido/Tareas Pendientes y la capacidad de Eliminar.
* **Preguntas**: Clarificar alcance real del Lector.

---

### 1.2 Gestión de atributos (categorías, marcas, ubicaciones) — rol responsable

**Reportado por**: Gemini CLI

* **Planteamiento**: PRD sugiere tarea compartida entre Administrador y Editor; descripción del rol de Administrador la presenta como más exclusiva.
* **Impacto**: Implementación de RBAC y visibilidad de UI.
* **Pregunta**: ¿Fuente de verdad para permisos de gestión de atributos?

---

## 2) Auditoría, Trazabilidad y Aprobaciones

### 2.1 “Mejor esfuerzo” en logging vs cadena de responsabilidad y aprobaciones

**Reportado por**: Gemini Code Assist, Gemini CLI, Cursor, Codex CLI, Codex Website (v1–v4)

#### \[Gemini Code Assist]

**Título**: *Contradicción: Política de Trazabilidad y Atomicidad de la Auditoría*

* **Prueba A**: docs/03-srs.md — "Trazabilidad de Mejor Esfuerzo..."
* **Prueba B**: docs/02-prd.md — flujo de **aprobación** con registro garantizado del autorizador.
* **Análisis**: Si falla auditoría, la aprobación podría quedar sin rastro; choca con "cadena de responsabilidad clara".
* **Pregunta**: ¿Aprobaciones deben ser atómicas y garantizadas, excepción a "mejor esfuerzo"?

#### \[Gemini CLI]

* **Tema**: Business Context privilegia UI fluida sobre logs; SRS parece imponer trazabilidad estricta en otra sección. Duda: ¿encapsular AuditLog en la misma transacción o asíncrono fire‑and‑forget?

#### \[Cursor]

**Ítem 1**: *Política de Trazabilidad — Absoluta vs. Mejor Esfuerzo*

* **Pruebas**: docs/01-business-context.md (mejor esfuerzo, anti-atomicidad) vs docs/03-srs.md (mejor esfuerzo) y PRD (nota que auditoría es secundaria).
* **Análisis**: Ambigüedad en mecanismos para no bloquear y no perder trazabilidad crítica.
* **Pregunta**: ¿Cola asíncrona o ignorar errores de logging?

#### \[Codex CLI]

**Ítem 12 (Desalineación menor)**: *“mejor esfuerzo” vs detalle exhaustivo*

* **Prueba A**: PRD: "log detallado" exhaustivo.
* **Prueba B**: SRS: "mejor esfuerzo".
* **Análisis**: Si falla el subsistema, se pierde el detalle esperado.
* **Pregunta**: ¿Nivel de degradación aceptable en auditoría?

#### \[Codex Website v1]

* **Contradicción 1**: Alcance de la trazabilidad — Business Context (mejor esfuerzo) vs PRD (historial por artículo exhaustivo).

---

## 3) Ciclo de Vida de Datos, Borrado y Restauración

### 3.1 Soft-delete vs Papelera (productos y adjuntos)

**Reportado por**: Gemini Code Assist, Codex CLI, Codex Extension, Codex Website (v1/v2/v4)

#### \[Gemini Code Assist]

**Título**: *Eliminación de Documentos Adjuntos (Soft-Delete vs. Papelera)*

* **Prueba A** (PRD): soft-delete de adjuntos, **sin** papelera.
* **Prueba B** (PRD, matriz): "Eliminar Productos (a papelera) ... archivos eliminados se mueven a papelera".
* **Análisis**: Inconsistencia entre política de adjuntos (sin papelera) y productos (con papelera). Ambigüedad de terminología "archivos".
* **Pregunta**: Política unificada: ¿adjuntos siguen papelera del producto o soft-delete irreversible?

#### \[Codex CLI]

**Ítem 7**: *Papelera de Productos no especificada en SRS*

* **Prueba A**: PRD: "Eliminar Productos (a papelera)".
* **Prueba B**: SRS: soft deletes para **Document**, borrado restringido, forzar borrado. No define semántica para **Product**.
* **Pregunta**: ¿Product usa soft-delete con restauración? Política de retención.

#### \[Codex Extension]

**Ítem 3**: *“Eliminar Productos” con observación sobre “archivos”*

* **Prueba A**: Fila de eliminar productos.
* **Prueba B**: Sección de adjuntos (soft-delete sin papelera).
* **Análisis**: Incongruencia terminológica y funcional.

#### \[Codex Website]

* **V1/V2/V4**: Reiteran el choque papelera vs soft-delete de adjuntos.

---

### 3.2 Nombres de archivo de adjuntos: original vs UUID

**Reportado por**: Codex CLI

* **Prueba A**: PRD — "Se mantendrá el **nombre original** del archivo".
* **Prueba B**: SRS — modelo `Document(..., original_filename, stored_uuid_filename, ...)` (renombrado en disco a UUID).
* **Análisis**: Políticas incompatibles en almacenamiento/descargas/deduplicación/seguridad.
* **Pregunta**: ¿Conservar nombre en disco o renombrar y guardar original como metadato?

---

### 3.3 “Forzar Borrado” y FKs a NULL

**Reportado por**: Cursor, Codex Extension, Codex Website v3

* **Prueba**: SRS describe flujo de error de borrado con opción "Forzar Borrado" y set de FKs a NULL.
* **Análisis**: Añade complejidad y puede contradecir el principio de simplicidad del Business Context.
* **Pregunta**: ¿Es indispensable el flujo de 2 pasos o simplificar?

---

## 4) Requisitos No Funcionales: Rendimiento, Disponibilidad, Escala y Seguridad (HTTPS)

### 4.1 Alta disponibilidad / tiempos estrictos vs tolerancia a caídas

**Reportado por**: Gemini CLI, Codex CLI, Codex Extension, Codex Website (v1–v4), Cursor

* **Pruebas típicas**:

  * Business Context: acepta **10 min** de caída; prefiere fluidez de UI.
  * PRD: **<3s** para operaciones clave, **<1s** críticas; "**alta disponibilidad**" en horario operativo.
* **Análisis**: SLO/SLA no definidos numéricamente; tensiones de coste/infra.
* **Preguntas**: ¿Objetivos aspiracionales o vinculantes? ¿Se tolera la caída de 10 min?

### 4.2 Escala real vs especificaciones

**Reportado por**: Cursor, Gemini CLI

* **Prueba**: \~10 usuarios, 2–3 concurrentes (Business Context) vs metas de rendimiento y crecimiento de inventario a 3,000 (PRD).
* **Análisis**: Posible sobre-ingeniería.

### 4.3 HTTPS obligatorio en red local

**Reportado por**: Codex CLI, Codex Extension, Codex Website (v1/v2/v4)

* **Prueba A**: SRS — todo por **HTTPS**.
* **Prueba B**: Business Context — operación en **red local interna** (todas las conexiones locales) y **simplicidad**.
* **Análisis**: Certificados/renovación vs seguridad interna; decidir política.
* **Pregunta**: ¿HTTPS innegociable o excepción en LAN con controles compensatorios?

---

## 5) Notificaciones y Observabilidad

**Reportado por**: Gemini CLI, Codex CLI, Codex Extension, Cursor, Codex Website (algunas versiones)

* **Pruebas**:

  * PRD: “Recibo una **notificación**… mecanismo de **notificación automática** a administradores en fallos graves”.
  * Notas: “notificaciones” = **indicadores visuales** (badges/contadores), **no** push/polling; SRS **desprioriza** real‑time.
* **Análisis**: Ambigüedad entre **in‑app badges**, **auto‑refresh**, **email/SMTP** o **alertas de infraestructura**.
* **Pregunta**: Canal y comportamiento exacto (manual refresh, polling ligero, email, etc.).

---

## 6) UX/UI y Guía de Estilo

### 6.1 Simplicidad/pragmatismo vs “innovadora y llamativa” (micro‑interacciones)

**Reportado por**: Gemini Code Assist, Gemini CLI, Codex CLI, Codex Website (varias), Cursor

* **Pruebas**: Business Context prioriza simplicidad/fluidez; PRD pide interfaz “**moderna, fluida, innovadora y visualmente llamativa**” con micro‑interacciones.
* **Análisis**: Riesgo de sobre‑ingeniería/performance.
* **Preguntas**: ¿Límites explícitos para animaciones y efectos?

### 6.2 Modales multi‑columna “sin scroll” vs responsividad completa

**Reportado por**: Codex CLI, Codex Extension, Codex Website (v2/v3/v4), Cursor

* **Pruebas**: PRD exige **multi‑col** y evitar scroll vertical en **TODOS** los modales; SRS/Arquitectura requieren **responsive** usable en móvil/tablet.
* **Análisis**: En móvil esa regla rompe UX.
* **Pregunta**: Acotar por breakpoints (solo desktop) y permitir scroll en mobile.

### 6.3 Formularios: evitar extensos vs “Formulario Completo”

**Reportado por**: Codex Website v3

* **Pruebas**: BC pide evitar fricción de formularios extensos; PRD define Formulario Completo con muchos campos.
* **Análisis**: Potencial reintroducción de fricción.

### 6.4 Paleta de estados y uso de colores

**Reportado por**: Codex Website (v1/v2/v3), Codex Extension

* **Pruebas**: PRD define estados con **verde, púrpura, amarillo, naranja, rojo**; guía visual no define varios de esos colores y recomienda uso muy moderado de rojo/amarillo.
* **Análisis**: Ambigüedad para implementación coherente.
* **Pregunta**: ¿Se expandirá la guía con colores de estado?

### 6.5 Modo oscuro: ¿obligatorio u opcional?

**Reportado por**: Codex CLI

* **Pruebas**: Arquitectura contempla **gestión de tema**; guía visual: “Modo Oscuro (si se implementa)”.
* **Análisis**: Alcance de MVP vs mejora futura.

### 6.6 Framework de estilos: Tailwind/shadcn vs “Framework Base” de clases

**Reportado por**: Codex CLI, Codex Extension, Codex Website v3

* **Pruebas**: SRS/Arquitectura: **Tailwind + shadcn/ui**; Guía Visual usa clases tipo `button-rounded`, `table-striped`, `button-black`.
* **Análisis**: Dos sistemas no alineados; requiere mapear a tokens/utilidades Tailwind/variantes shadcn.

---

## 7) Arquitectura Frontend y Data

### 7.1 SPA “cliente tonto” con Next.js App Router (¿RSC/SSR permitidos?)

**Reportado por**: Codex CLI, Cursor

* **Pruebas**: SRS: SPA CSR “dumb client”; Arquitectura: Next.js App Router (posibilidad de **Server Components/SSR/Server Actions** no prohibidas explícitamente).
* **Análisis**: Riesgo de introducir SSR/RSC y romper supuestos de CSR/Zustand/SWR.
* **Pregunta**: ¿Prohibir SSR/RSC/Server Actions o permitir caso por caso?

### 7.2 Patrón de data‑fetching: SWR/React Query vs fetch/axios directo

**Reportado por**: Gemini Code Assist, Gemini CLI

* **Pruebas**: SRS limita a **SWR o React Query**; otra sección describe **fetch/axios** directo en el ciclo estándar.
* **Análisis**: Doble patrón; se pierde cache/revalidación si se permite directo.
* **Pregunta**: ¿Obligatorio usar hooks de SWR/React Query? ¿Cuál es la preferida?

### 7.3 Estructura de layout y `AppLayout`

**Reportado por**: Cursor

* **Pruebas**: `(app)/layout.tsx` envuelve páginas autenticadas; regla de **no** importar `AppLayout` en páginas individuales para evitar duplicación.
* **Análisis**: Falta ejemplo canónico que elimine confusión.

---

## 8) Priorización y Roadmap

**Reportado por**: Gemini CLI, Cursor, Codex Website v3

* **Pruebas**: BC: “**Tareas Pendientes** es **INDISPENSABLE y CRÍTICA**”; Roadmap: se lista entre **módulos menores** / sin hito explícito.
* **Análisis**: Falta de priorización puede retrasar funcionalidad clave.
* **Pregunta**: ¿Agregar hito dedicado/prioritario para Tareas Pendientes?

---

## 9) Complejidad Operativa vs Escala Real

**Reportado por**: Codex Website v4

* **Tema**: "Acceso Rápido" por **IP confiable** en SRS vs entorno **pequeño** (\~10 usuarios).
* **Análisis**: Puede ser optimización innecesaria.
* **Pregunta**: ¿Se justifica por la escala o se elimina?

---

## 10) Otros choques y matices (de distintas IAs)

* **Disponibilidad/Rendimiento** vs "peor/aceptable" (BC): repetido por múltiples IAs con preguntas sobre SLO numéricos (p. ej. 99.5%/99.9%).
* **Aprobaciones de ediciones** vs fluidez sin fricción (BC) (Codex Website v3): ¿aprobación siempre o edición directa?

---

# Anexos — Extractos completos por IA

> A continuación, se incluyen **bloques íntegros** (o lo más íntegros posible) tal como los reportó cada IA, para consulta literal dentro del mismo lienzo.

---

## A) Gemini Code Assist — Bloques citados

1. **Contradicción: Política de Trazabilidad y Atomicidad de la Auditoría**

* **Prueba A**: docs/03-srs.md — "Trazabilidad de Mejor Esfuerzo..."
* **Prueba B**: docs/02-prd.md — flujo de aprobación con cadena de responsabilidad.
* **Análisis**: Mejor esfuerzo vs necesidad de registro garantizado.
* **Pregunta**: ¿Aprobaciones atómicas?

2. **Eliminación de Documentos Adjuntos (Soft-Delete vs. Papelera)**

* **Pruebas**: PRD (soft-delete sin papelera) vs PRD (matriz, a papelera).

3. **Filosofía de Diseño de la Interfaz** (Pragmatismo vs Innovación Visual)

* **Pruebas**: BC (simplicidad es rey) vs PRD (innovadora/llamativa con micro‑interacciones).

4. **Ambigüedad: Permisos del Rol 'Lector' para Eliminar Productos**

* ver sección RBAC.

5. **Herramienta de Data Fetching en el Frontend**

* **Pruebas**: SRS (SWR/React Query) vs SRS (fetch/axios en flujo estándar).

---

## B) Gemini CLI — Bloques citados

* **Trazabilidad**: BC mejor esfuerzo vs SRS (posible rigidez); pregunta sobre transacción vs asíncrono.
* **Gestión de estado global**: Arquitectura dice seleccionado (p. ej., Zustand); Roadmap lo presenta como decisión futura a evaluar (incluye Jotai).
* **Data fetching**: define librerías, pero el flujo omite la abstracción.
* **Gestión de atributos**: PRD compartida vs descripción que sugiere exclusividad Admin.

---

## C) Cursor — Bloques citados

1. **Trazabilidad — Absoluta vs Mejor Esfuerzo** (con líneas indicadas en BC y SRS).
2. **Arquitectura Modular — Desacoplamiento vs Simplicidad**: BC prefiere inyección y llamadas directas (`tsyringe`); SRS habla de módulos "loosely‑coupled".
3. **Requisitos de rendimiento**: escala pequeña vs tiempos y escalabilidad a 3,000.
4. **Priorización “Tareas Pendientes”**: crítica en BC vs Roadmap sin hito específico.
5. **Optimistic UI por defecto** vs clasificación de fallos (BC).
6. **Notificaciones**: despriorizadas en SRS vs expectativas de “recibo notificación”; nota aclaratoria en PRD.
7. **Accesibilidad**: SRS "razonable" vs Guía Visual WCAG AA como mínimo.
8. **Estructura de Layout**: `(app)/layout.tsx` vs regla de no duplicar `AppLayout` (necesita clarificación práctica).

---

## D) Codex CLI — Bloques citados

1. **Adjuntos: nombre original vs UUID en disco** (PRD vs SRS).
2. **RBAC Lector: eliminación de productos** (descripción vs tabla).
3. **Modo oscuro: obligatorio u opcional** (Arquitectura vs Guía Visual).
4. **Accesibilidad: WCAG AA “siempre” vs “razonable”** (Guía vs SRS).
5. **Rendimiento/Disponibilidad**: BC tolera caídas y lentitud; PRD pide alta disponibilidad y métricas estrictas.
6. **SPA “cliente tonto” con Next.js App Router (RSC/SSR?)**.
7. **Papelera Product no definida en SRS**.
8. **Notificación a Administradores** vs notificaciones in‑app despriorizadas.
9. **UI innovadora/llamativa** vs simplicidad.
10. **HTTPS obligatorio en LAN** vs simplicidad.
11. **Layouts horizontales vs mobile** (modales sin scroll vs responsive).
12. **Trazabilidad exhaustiva** vs mejor esfuerzo (degradación aceptable).

---

## E) Codex Extension — Bloques citados

1. **RBAC Lector** (crear/procesar/ver Tareas Pendientes; eliminar productos).
2. **Texto “archivos” en fila de “Eliminar productos”** vs política de adjuntos (soft‑delete sin papelera).
3. **Modales multi‑col vs responsive**.
4. **Disponibilidad alta vs tolerancia a caídas**.
5. **Framework Base de estilos** vs Tailwind/shadcn.
6. **Notificaciones automáticas a administradores** vs despriorización real‑time.
7. **HTTPS en LAN** vs simplicidad.
8. **Rendimiento**: tiempos estrictos vs enfoque de fluidez del BC.

---

## F) Codex Website — 4 versiones

**Versión 1**:

* Trazabilidad (BC mejor esfuerzo) vs historial exhaustivo por artículo (PRD).
* Lector/Tareas Pendientes (no puede crear/procesar/ver) y eliminación de productos.
* Disponibilidad alta vs tolerancia a caídas.
* Colores de estado (PRD) vs guía sin definirlos.
* HTTPS en red local.

**Versión 2**:

* Alta disponibilidad vs tolerancia a caídas.
* Accesibilidad WCAG AA vs razonable.
* Layout fijo multi‑col vs responsive.
* Permisos del Lector (eliminar y restricciones en Tareas Pendientes).
* HTTPS en LAN.
* Uso moderado de colores vs estados multicolor requeridos.

**Versión 3**:

* Tolerancia a caídas vs alta disponibilidad.
* “Tareas Pendientes” crítica vs módulo menor en Roadmap.
* Modales multi‑col vs responsive.
* Aprobaciones vs fluidez sin fricción.
* Colores de estado vs paleta.
* Framework de estilos (Tailwind/shadcn vs clases base).
* Formularios extensos vs evitarlos.
* HTTPS en LAN.
* Accesibilidad WCAG AA vs razonable.
* “Forzar Borrado” vs simplicidad.

**Versión 4**:

* Lector depende de Retiro Rápido pero no puede usarlo.
* Lector consultivo pero con permisos de borrado.
* Multi‑col sin scroll vs responsive full.
* Accesibilidad razonable vs WCAG AA mínimo.
* Disponibilidad alta vs tolerancia a caídas.
* Acceso Rápido por IP confiable (complejidad vs escala pequeña).
* Tolerancia a lentitud (5s) vs objetivos <1–3s.
* HTTPS obligatorio vs red local.

---

# Fin del documento
