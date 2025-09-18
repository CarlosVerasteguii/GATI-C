# Auditoría del Plan: "Alcanzar la Verdadera Paridad" — Fase 2

Fecha: 2025-09-17  
Autor: Arquitecto de Software Principal (Auditor)

## a) Veredicto General

VEREDICTO: REQUIERE AJUSTES

Resumen: La expansión propuesta (Tareas 2.15–2.19) se alinea con la dirección estratégica del proyecto y aborda las brechas clave de paridad detectadas. Sin embargo, el alcance es amplio y heterogéneo. Para ser tácticamente completo y ejecutable con bajo riesgo, el plan debe refinarse desglosando al menos la Tarea 2.18 (Acciones Masivas) y acotando criterios de salida verificables por tarea. Esto mantiene la **Simplicidad Pragmática** y protege la **UX Fluida** (docs/01-business-context.md) sin caer en sobre‑ingeniería.

## b) Análisis de la Expansión del Alcance

Pregunta: ¿Las Tareas 2.15–2.19 cubren toda la funcionalidad faltante?  
Referencias: Informe de auditoría previo (Fase 2) y PRD (docs/02-prd.md: roles y capacidades por módulo).

- Faltantes detectados previamente:
  - Filtros avanzados (fecha, proveedor, contratoId, costo, hasSerialNumber, locationId).  
  - Edición de productos (formulario completo).  
  - Eliminación (soft‑delete) conforme a la Política de Borrado Unificada (PRD §3 y §4).  
  - Acciones masivas (asignar, prestar, retirar) y selección por grupos/ítems.  
  - Importación CSV (flujo de carga).  

- Cobertura por el nuevo plan:
  - 2.15 Filtros Avanzados → cubre filtros.  
  - 2.16 Diálogo Editar → cubre edición (formulario completo inicial).  
  - 2.17 Flujo Eliminar → cubre soft‑delete y reglas.  
  - 2.18 Acciones Masivas → cubre selección y operaciones batch.  
  - 2.19 Importación CSV → cubre ingestión masiva.  

Veredicto: SÍ, la expansión cubre los gaps funcionales identificados.  
Matiz: 2.18 es, por sí sola, una mini‑fase por complejidad y dependencia de permisos (PRD §2.1) y estados (PRD §3).

## c) Análisis de Riesgos del Nuevo Alcance

Mayor riesgo: **Complejidad combinada en Acciones Masivas (2.18)**.  
Justificación:
- Involucra selección heterogénea (grupos “stack” vs serializados), propagación de estados y validaciones por rol (PRD §2.1) y estados (PRD §3).
- Requiere coherencia con la Política de Borrado/Estados (PRD §3, §4) y con flujos de Préstamos/Asignaciones (módulos relacionados).
- Alto potencial de regresiones UX si no se testea exhaustivamente.

Recomendación táctica: Desglosar 2.18 en sub‑tareas con criterios de salida claros:
1) Selección y contador por grupo/ítem (UX estable).  
2) Acción Masiva: Asignar (solo paths felices + validaciones mínimas).  
3) Acción Masiva: Prestar.  
4) Acción Masiva: Retirar (marca PENDIENTE_DE_RETIRO).  
5) Invalidación/revalidación (SWR keys + tags) consistente.  
6) Tests de componentes + e2e mínimos por acción.

Otros riesgos moderados:
- 2.16 Edición: Alcance del formulario completo según PRD §4 (campos de compra, documentos adjuntos futuros). Mitigar definiendo un MVP de edición (campos esenciales) y postergando adjuntos a Fase 3/otro épico.
- 2.19 CSV: Normalización y validación. Mitigar con esquema Zod y feedback de errores claro (PRD §4.3 “Feedback al Usuario”).

## d) Verificación de la Tarea de Documentación de SSR

Pregunta: ¿`docs/04-frontend-architecture.md` es el lugar correcto?  
Veredicto: SÍ.  
Justificación: El documento ya contiene la sección de App Router, RSC/SSR y Capa de API. La política de “Propagación Directa de Cookies” encaja en “RSC/SSR” y “Capa de API y Fetching” (docs/04-frontend-architecture.md §§133–151, 138–147). Añadir ejemplo y notas operativas (cookies Secure/SameSite, tags) mantiene la **Simplicidad Pragmática** y trazabilidad arquitectónica.

## e) Conclusión y Recomendación Final del Auditor

Recomendación: REFINAR Y APROBAR CON CAMBIOS.

- Aprobar la expansión 2.15–2.19 en principio (alineada con PRD y Business Context: UX rápida y funcionalidad clave).  
- Refinar la Tarea 2.18 en sub‑tareas ejecutables con criterios de salida verificables y pruebas mínimas por acción.  
- Definir criterios de salida por tarea:
  - 2.15: Todos los filtros operan sobre URL params, sin estado duplicado; pruebas de integración de keygen SWR con `params` y render; rendimiento aceptable sin waterfalls en cliente (docs/04… §153–158).
  - 2.16: Edición MVP con validación Zod; rollback visual consistente y revalidación por tag/keys; respetar permisos (PRD §2.1).
  - 2.17: Soft‑delete coherente con Política de Borrado Unificada (PRD §3); exclusión por defecto en vistas; invalidación.
  - 2.18.x: Cada acción masiva con UX estable, validaciones mínimas por rol/estado, revalidación y tests.
  - 2.19: Parser CSV con esquema Zod, feedback de errores, y prueba mínima de ingestión.
- Documentar SSR (cookies directas) en `docs/04-frontend-architecture.md` con snippet y consideraciones operativas.

Resultado esperado: Fase 2 completa con paridad funcional realista, manteniendo el principio de **Pragmatic Simplicity** y protegiendo la **UX First**. Esto deja el terreno listo para la Fase 3 (promoción/limpieza) sin deuda crítica.


