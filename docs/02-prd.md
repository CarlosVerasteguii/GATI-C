Product Requirements Document (PRD) - GATI-C v2.2 (Final)
1. Elevator Pitch
GATI-C es una plataforma web interna para la Comisión Federal de Electricidad (CFE), diseñada para transformar la gestión de activos de TI de un proceso manual y caótico a un sistema centralizado, inteligente y auditable. El sistema garantiza una trazabilidad de mejor esfuerzo en el ciclo de vida de cada activo, desde su ingreso hasta su retiro, permitiendo a los gerentes tener una visión clara del inventario y a los técnicos gestionar préstamos y asignaciones de manera eficiente y ágil. GATI-C no solo reduce la pérdida de equipos y optimiza los recursos, sino que también implementa una experiencia de usuario moderna y fluida, estableciendo un nuevo estándar de profesionalismo y control para el departamento.
2. Who is this app for
Rol Administrador: Es el superusuario del sistema. Realiza todas las acciones críticas: aprueba solicitudes de Editores (esto se ajustará si es necesario), gestiona los atributos del sistema (Categorías, Marcas), supervisa y procesa las "Tareas Pendientes" (Cargas y Retiros rápidos), y tiene control total sobre el inventario.
Rol Editor: Es el usuario principal en el día a día. Su tarea más crucial es asignar y prestar equipos de manera rápida y precisa. Utilizará intensivamente los flujos de "Retiro Rápido" para sacar material del almacén y registrarlo sin demoras. Necesita que el sistema sea extremadamente ágil para no interrumpir su trabajo de campo.
Rol: Lector Principalmente consultan la disponibilidad de equipos y registran retiros. El flujo de "Retiro Rápido" es esencial para ellos.

2.1. Matriz de Permisos por Rol

Para una mayor claridad, la siguiente tabla detalla las acciones permitidas para cada rol, considerando que la trazabilidad de mejor esfuerzo del sistema minimiza la necesidad de aprobaciones directas para las operaciones del día a día:

| Módulo/Acción                | Administrador | Editor  | Lector  | Observaciones                                                                 |
|------------------------------|---------------|---------|---------|-------------------------------------------------------------------------------|
| **Inventario**               |               |         |         |                                                                               |
| Crear Productos (full form)  | Sí            | Sí      | No      | Incluye la carga inicial de un activo completo.                               |
| Crear Placeholders (Carga Rápida) | Sí            | Sí      | No      | Creación de entrada pendiente de un activo.                                  |
| Ver Productos/Detalles       | Sí            | Sí      | Sí      | Incluye acceso a documentos adjuntos.                                         |
| Editar Productos (full form) | Sí            | Sí      | No      | Modificación de cualquier campo de un producto existente. Todas las ediciones quedan registradas. |
| Eliminar Productos (a papelera) | Sí            | Sí      | Sí      | Los archivos eliminados se mueven a papelera, con registro de la acción.      |
| **Tareas Pendientes**        |               |         |         |                                                                               |
| Crear (Carga Rápida/Retiro Rápido) | Sí            | Sí      | No      | Inicio de una solicitud pendiente.                                            |
| Procesar (Completar Form.)   | Sí            | Sí      | No      | Finalizar una tarea pendiente, llenando el formulario completo.               |
| Ver Lista de Tareas Pendientes | Sí            | Sí      | No      | Incluye detalles de quién inició y finalizó la tarea.                       |
| **Préstamos y Asignaciones** |               |         |         |                                                                               |
| Realizar Préstamos           | Sí            | Sí      | No      |                                                                               |
| Realizar Asignaciones        | Sí            | Sí      | No      |                                                                               |
| Cancelar Préstamos/Asignaciones | Sí            | Sí      | No      |                                                                               |
| Ver Historial Préstamos/Asignaciones | Sí            | Sí      | No      |                                                                               |
| **Configuración del Sistema**|               |         |         |                                                                               |
| Gestión de Categorías        | Sí            | Sí      | No      | Añadir, editar, eliminar categorías de productos.                             |
| Gestión de Marcas            | Sí            | Sí      | No      | Añadir, editar, eliminar marcas.                                              |
| Gestión de Ubicaciones       | Sí            | Sí      | No      | Añadir, editar, eliminar ubicaciones.                                         |
| Gestión de Usuarios          | Sí            | No      | No      | Creación, edición y gestión de roles de usuarios (solo Administrador).       |
| **Documentos Adjuntos**      |               |         |         |                                                                               |
| Eliminar Documentos Adjuntos (soft-delete, sin papelera) | Sí            | Sí      | No      | Se ocultan en la UI; no existe restauración desde papelera.                   |

3. Functional Requirements
Gestión del Ciclo de Vida del Activo:
Estados: Los activos deben tener los siguientes estados, cada uno con un color semántico definido: Disponible (Verde), Asignado (Púrpura), Prestado (Amarillo), Pendiente de Retiro (Naranja), Retirado (Rojo).
Gestión de Documentos Adjuntos (SISE / Contrato de Compra):
•	Tipos de Archivo: Se permitirá adjuntar documentos en formato PDF y Word (.docx).
•	Cantidad de Archivos: Un producto podrá tener múltiples documentos adjuntos de este tipo.
•	Obligatoriedad: La adjunción de estos documentos será opcional durante el proceso de carga y edición del producto.
•	Almacenamiento: Los archivos se almacenarán en el sistema de archivos del servidor, organizados de manera óptima para evitar problemas de gestión y acceso. Se mantendrá el nombre original del archivo.
•	Visualización: Los documentos adjuntos serán accesibles desde la página de detalle del producto. Al hacer clic en un documento, este se abrirá en una nueva pestaña del navegador para su lectura o descarga.
•	Flujo de Procesamiento: La opción para adjuntar estos documentos estará disponible únicamente en el formulario completo durante el procesamiento de una tarea pendiente (no en la Carga Rápida).
•	Eliminación de Archivos: El borrado de documentos se gestionará mediante un `soft-delete` (marcado como borrado en la base de datos). La interfaz de usuario ocultará estos documentos, simplificando la gestión a un solo paso sin necesidad de una papelera de reciclaje o restauración.
•	Límite de Tamaño: El tamaño máximo permitido por archivo para las subidas será de 100MB.
•	Manejo de Errores en Subidas: El sistema proporcionará mensajes de error claros al usuario en caso de fallos en la subida, incluyendo, pero no limitándose a:
    •	Archivo corrupto: "Error al procesar el archivo. Por favor, intente con otro archivo."
    •	Tipo de archivo incorrecto: "Tipo de archivo no permitido. Solo se aceptan PDF y Word."
    •	Error del servidor: "Ocurrió un error en el servidor al subir el archivo. Por favor, inténtelo de nuevo más tarde."
    •	Límite de tamaño excedido: "El archivo excede el tamaño máximo permitido de 100MB."

Módulo de Tareas Pendientes:
Carga Rápida: Permite crear una solicitud de ingreso pendiente. Utiliza un ComboBox que sugiere productos existentes. Si no existe, permite crear un placeholder con un nombre temporal (solo el nombre). La solicitud se guarda en una lista separada sin afectar el stock principal.
Retiro Rápido: Permite marcar para retiro uno o varios artículos (serializados o no) a través de un modal tipo "carrito". La acción cambia el estado de los artículos a Pendiente de Retiro. Los números de serie y otros datos detallados para una baja adecuada se llenarán en la etapa posterior de procesamiento de la tarea pendiente.
Procesamiento: Cualquier Editor o Administrador puede procesar una tarea pendiente. Al hacerlo, se abre el formulario completo correspondiente (Añadir/Retirar) con los datos pre-cargados para su finalización.
    •   **Formulario Completo para Carga/Edición de Activos:** Este formulario se utilizará para registrar y editar los detalles completos de un activo, incluyendo la finalización de una "Carga Rápida". Los campos clave a capturar y mostrar en la vista de detalles del producto son:
        •   **Información Básica del Activo:** Nombre del Producto, Número de Serie / Identificador Único (requerido para serializados), Categoría (ComboBox), Marca (ComboBox), Modelo, Descripción Detallada.
        •   **Detalles de Adquisición:** Proveedor (texto libre/ComboBox), Fecha de Adquisición / Compra, Número de Contrato / Factura, Costo de Adquisición (opcional), Condición al Ingreso (Lista desplegable).
        •   **Ubicación y Estado Actual:** Ubicación Actual (ComboBox). El Estado Actual será informativo (ej. Disponible, Asignado) y no editable directamente.
        •   **Documentos Adjuntos:** Área para adjuntar (PDF, Word) y visualizar documentos SISE / Contrato de Compra (múltiples, opcionales, máx. 100MB por archivo).
        •   **Información Adicional (Opcional):** Notas / Comentarios Internos.
        •   **Campos de Auditoría (Auto-generados):** Fecha de Creación, Usuario Creador, Fecha Última Modificación, Usuario Última Modificación.
    •   **Formulario Completo para Procesamiento de Retiro Rápido (Baja Definitiva):** Este formulario se utilizará para finalizar el proceso de baja de un activo. Los campos clave a capturar son:
        •   **Motivo del Retiro:** (Lista desplegable. Ej: "Obsolescencia", "Daño Irreparable", "Extravío", "Venta", "Donación").
        •   **Fecha de Retiro:** (Selector de fecha).
        •   **Método de Disposición:** (Campo de texto libre. Ej: "Desecho electrónico", "Reciclaje con [Proveedor]", "Vendido a [Entidad]").
        •   **Notas de Retiro:** (Área de texto para detalles adicionales de la baja).
        •   **Destino Final (Opcional):** (Campo de texto libre, para especificar si se mueve a un almacén de desechos, etc.)

Trazabilidad de Mejor Esfuerzo:
Historial por Artículo: Cada activo debe tener un log detallado de cada acción realizada sobre él (creación, edición, asignación, préstamo, cambio de estado, retiro), incluyendo el registro de los valores que cambiaron. Esta auditoría es una operación secundaria y no debe impedir la acción principal del usuario.
Historial de Tareas Pendientes: Cada tarea pendiente debe tener su propio log detallado: quién la creó, cuándo, y quién la finalizó. Se elimina la complejidad de flujos de aprobación para ediciones simples.
4. User Stories
Como Editor, quiero registrar la llegada de 50 laptops nuevas con números de serie de forma rápida, así que uso la función de "Carga Rápida", selecciono "Laptop" y pego los 50 números de serie. Esto crea una tarea pendiente para que más tarde, yo Editor o algun Administrador podamos completar los detalles (proveedor, fecha de compra) sin detener el trabajo del día.
Como Editor, necesito un teclado para un usuario. En la vista de inventario, veo que de 10 teclados, el display QTY me muestra 10 4 6, indicándome al instante que hay 10 en total, pero solo 4 disponibles y 6 no disponibles. Hago hover sobre la cantidad para ver el desglose exacto de los 6 no disponibles antes de proceder.
Como Administrador, quiero saber cuántos equipos tenemos vencidos. Entro al dashboard y veo la tarjeta "Préstamos Vencidos" en rojo con el número exacto. Hago clic en un ítem de la lista y se abre un panel lateral con todos los detalles del préstamo: quién lo tiene, desde cuándo, y quién autorizó el préstamo, dándome toda la información para una auditoría rápida.
Como Administrador, recibo una notificación o veo en mi vista de "Tareas Pendientes" una solicitud de un Editor para editar la descripción de un monitor. Puedo ver exactamente qué quería cambiar, aprobarlo con un solo clic, y el sistema registrará automáticamente que yo autoricé el cambio, manteniendo una cadena de responsabilidad clara.
Nota aclaratoria sobre "notificaciones": Se refiere a indicadores visuales en la UI (p. ej., badges/contadores en vistas), no a un sistema de notificaciones en tiempo real (push/polling), el cual está despriorizado según el SRS.
5. User Interface
Estilo General: Profesional, moderno y extremadamente fluido. La interfaz debe sentirse "viva" a través de micro-interacciones y animaciones sutiles (transiciones suaves en botones, apariciones graduales de modales, efectos de hover). El diseño debe ser innovador y visualmente llamativo, sin sacrificar la claridad profesional que requiere CFE.
Layouts Horizontales: TODOS los modales (Dialogs) y paneles (Sheets) deben usar layouts de múltiples columnas (ej. grid-cols-2) para distribuir los campos de formulario de manera horizontal. El objetivo es eliminar el scroll vertical en la medida de lo posible y aprovechar el espacio de la pantalla para una experiencia más cómoda y eficiente.
Uso Inteligente del Color: El color no es decorativo, es funcional. Se debe usar la paleta semántica definida en todos los StatusBadge, iconos, gráficos del dashboard y notificaciones para comunicar estados e información de forma instantánea.
Tooltip Avanzado para QTY: La columna de cantidad para ítems no serializados usará el formato [TOTAL] [DISPONIBLE] [NO DISPONIBLE] con sus respectivos colores. El tooltip al hacer hover será rico en información, con iconos y desglose detallado de cada estado.
"security_considerations": "Sanitizar entradas. Considerar headers de seguridad básicos (ej. con Helmet.js). La autenticación se gestionará mediante credenciales personalizadas dentro de la aplicación, sin integración con Directorio Activo."

4. Requisitos No Funcionales

Estos requisitos definen las cualidades del sistema que son cruciales para su éxito, más allá de sus funcionalidades básicas.

4.1. Rendimiento (Performance)
•   **Tiempo de Respuesta:** La mayoría de las operaciones clave (ej. cargar listados, búsquedas, procesar transacciones pequeñas) deben completarse en menos de 3 segundos. Las operaciones críticas (ej. búsqueda de productos, carga de un registro individual) deben apuntar a completarse en menos de 1 segundo.
•   **Escalabilidad de Inventario:** El sistema debe ser capaz de manejar eficientemente un inventario actual de aproximadamente 1,200 activos. El diseño debe permitir un crecimiento futuro de hasta 3,000 activos en los próximos 5 años sin degradación significativa del rendimiento.

4.2. Disponibilidad y Confiabilidad (Availability & Reliability)
•   **Tiempo de Actividad (Uptime):** El sistema debe garantizar alta disponibilidad durante las horas de operación estándar (aproximadamente 8:00 AM - 4:00 PM, extendiéndose si es necesario para jornadas largas). Se aceptan ventanas de mantenimiento planificadas que pueden ocurrir fuera o, previa comunicación, dentro del horario laboral.
•   **Manejo de Fallos:**
    •   **Registro de Errores:** Todos los errores críticos del sistema (backend, base de datos) deben ser registrados detalladamente para facilitar la depuración y el análisis.
    •   **Notificación a Administradores:** En caso de fallos graves que afecten la funcionalidad, se debe implementar un mecanismo de notificación automática a los administradores del sistema.
    •   **Feedback al Usuario:** Para cualquier error que afecte la experiencia del usuario, el sistema debe mostrar mensajes de error amigables y claros, evitando la exposición de detalles técnicos sensibles (ej. "Ocurrió un error inesperado. Por favor, inténtelo de nuevo o contacte al soporte técnico."). Se evitarán las interrupciones abruptas de la interfaz.

4.3. Mantenibilidad (Maintainability)
•   **Facilidad de Modificación:** El código base debe ser diseñado de manera modular, con una estructura clara y convenciones de codificación consistentes (según las reglas de estilo de código ya definidas), para facilitar la implementación de nuevas características, modificaciones y correcciones de errores en el futuro.
•   **Amigabilidad con IA:** La estructura del código, la documentación interna (ej. JSDoc) y la claridad de la lógica deben optimizarse para que herramientas de inteligencia artificial puedan analizarlo, entenderlo y proponer/aplicar cambios de manera eficiente.
