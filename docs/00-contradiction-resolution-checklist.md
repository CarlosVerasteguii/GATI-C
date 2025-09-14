# GATI-C: Checklist de Resolución de Contradicciones

Este documento sirve como hoja de ruta para resolver las inconsistencias identificadas en el corpus documental de GATI-C. Cada punto representa una decisión arquitectónica o de requisitos que debe ser tomada y reflejada en los documentos canónicos (`01` a `05`).

---

## 1. Gobernanza y Permisos (RBAC)

- [x] **1.1. Permisos del Rol "Lector":** Definir de forma inequívoca si el rol "Lector" tiene permisos de escritura/eliminación. Alinear la matriz de permisos con su descripción filosófica.
- [x] **1.2. Gestión de Atributos:** Definir qué rol(es) son responsables de gestionar entidades auxiliares como categorías, marcas y ubicaciones.

## 2. Auditoría y Trazabilidad

- [x] **2.1. Política de Trazabilidad:** Tomar una decisión final y vinculante sobre si la auditoría es "de mejor esfuerzo" (asíncrona, no bloqueante) o "garantizada" (atómica, transaccional). Esta es la decisión más crítica.

## 3. Ciclo de Vida de los Datos

- [x] **3.1. Política de Borrado:** Unificar la política de eliminación para todas las entidades. ¿Usamos "soft-delete sin papelera" o un "soft-delete con papelera y restauración"?
- [x] **3.2. Nomenclatura de Archivos Adjuntos:** Decidir el estándar para nombrar archivos: ¿se conserva el nombre original o se utiliza un UUID para evitar colisiones?
- [x] **3.3. Política de "Forzar Borrado":** Definir si existe la funcionalidad de "borrado forzado" que ponga las claves foráneas a NULL y cuáles son sus implicaciones.

## 4. Requisitos No Funcionales (NFRs)

- [x] **4.1. Disponibilidad:** Definir un objetivo de disponibilidad realista (ej. "el sistema puede estar inactivo para mantenimiento") en lugar de aspiraciones de "alta disponibilidad".
- [x] **4.2. Escala:** Documentar la escala real esperada (~10 usuarios) para evitar la sobre-ingeniería en futuros requisitos.
- [ ] **4.3. Seguridad en Tránsito:** Decidir si HTTPS es obligatorio para el despliegue en la LAN interna.

## 5. Notificaciones

- [ ] **5.1. Mecanismo de Notificación:** Aclarar si las "notificaciones" se refieren a indicadores de UI (badges), polling, o si se descarta cualquier mecanismo en tiempo real.

## 6. UX/UI y Guía de Estilo

- [ ] **6.1. Filosofía de Diseño:** Resolver la tensión entre "simplicidad pragmática" e "interfaz innovadora y llamativa". Establecer un principio guía claro.
- [ ] **6.2. Diseño de Modales:** Definir el estándar para modales complejos: ¿se permiten múltiples columnas o se prioriza un diseño de una sola columna compatible con móviles?
- [ ] **6.3. Longitud de Formularios:** Establecer una política sobre la longitud de los formularios para alinear "evitar formularios extensos" con la necesidad de un "Formulario Completo".
- [ ] **6.4. Paleta de Colores de Estado:** Canonizar el uso de colores para los estados de los activos.
- [ ] **6.5. Modo Oscuro:** Decidir si el modo oscuro es obligatorio, opcional o despriorizado.
- [ ] **6.6. Stack de Estilos:** Tomar una decisión final: ¿se usa el ecosistema de shadcn/ui y Tailwind, o se define un "Framework Base" con clases personalizadas?

## 7. Arquitectura Frontend y Datos

- [ ] **7.1. Arquitectura de Renderizado:** Aclarar la postura sobre el uso de React Server Components (RSC) y Server-Side Rendering (SSR) dentro del marco de un "cliente tonto".
- [ ] **7.2. Patrón de Data-Fetching:** Estandarizar la herramienta para la obtención de datos (SWR/React Query) y prohibir el uso de `fetch`/`axios` directos en los componentes.

Nota: He omitido deliberadamente las contradicciones menores o que son consecuencia de las principales para mantener el checklist enfocado en las decisiones estratégicas.