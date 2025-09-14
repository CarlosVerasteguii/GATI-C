Guía Maestra de Estilo Visual y Esencia de Marca para
Aplicaciones CFE (Actualizada) - PARTE 1
Versión: 1.1
Fecha: [Fecha Actual]
0. Introducción y Propósito
Este documento establece las directrices visuales, la paleta de colores, la tipografía, el uso de
componentes y otros aspectos clave que conforman la "esencia" de las aplicaciones
desarrolladas para la Comisión Federal de Electricidad (CFE).
El objetivo principal es:
1. Asegurar la consistencia visual y de experiencia de usuario a través de todas las
aplicaciones CFE, apalancando las capacidades del Framework Base.
2. Reflejar y reforzar la identidad de marca de CFE en cada interfaz.
3. Proporcionar una base sólida para el desarrollo de nuevas aplicaciones o la
modificación de existentes, garantizando que se alineen con la estética y funcionalidad
deseadas.
4. Servir como referencia para desarrolladores e IA en la creación de interfaces
intuitivas, profesionales y eficientes.
Esta guía sintetiza las mejores prácticas y elementos visuales identificados en proyectos
previos y ahora se enriquece con las especificidades del Framework Base.
1. Filosofía de Diseño y Principios Fundamentales
La esencia visual de las aplicaciones CFE se centra en los siguientes principios:
• Profesionalismo y Confianza CFE:
o Transmitir la seriedad y fiabilidad de CFE.
o Integrar de forma prominente los colores e imagen corporativa de CFE. El
Framework Base ya utiliza el color verde CFE (#008E5A) en elementos como
el loader de página.
• Claridad y Legibilidad:
o Priorizar una interfaz limpia que permita a los usuarios comprender la
información y realizar tareas de manera eficiente.
o Asegurar que toda la información sea fácil de leer y entender mediante un alto
contraste y una jerarquía tipográfica clara.
• Eficiencia y Funcionalidad:
o Facilitar una rápida entrada de datos, navegación y ejecución de tareas.
o Cada elemento visual debe tener un propósito y contribuir a una experiencia de
usuario productiva, minimizando la carga cognitiva. El Framework Base
proporciona componentes estructurados para este fin (formularios, tablas,
etc.).
• Modernidad:
o Diseño contemporáneo con micro-interacciones sutiles y consistentes. Evitar efectos complejos que penalicen el rendimiento o la mantenibilidad.
• Consistencia:
o Mantener una apariencia y comportamiento uniformes en todos los módulos,
vistas y componentes de la aplicación, utilizando las clases y estructuras
definidas por el Framework Base.
o Aplicar estilos de manera consistente para elementos similares.
• Usabilidad Intuitiva:
o Diseñar interfaces que guíen al usuario de manera natural a través de los
procesos.
o La disposición de controles e información debe ser lógica y predecible.
• Accesibilidad:
o Construir interfaces teniendo en cuenta la accesibilidad (WCAG AA como
mínimo donde aplique), asegurando que puedan ser utilizadas por el mayor
número de personas posible.
2. Paleta de Colores
El sistema de colores es fundamental. El Framework Base ya define colores clave. Para mayor
personalización, se pueden complementar con variables CSS (idealmente HSL) e integrarse
con Tailwind CSS si se usa adicionalmente.
2.1. Colores Corporativos CFE (Primarios de Marca)
Estos colores son la base de la identidad CFE. El Framework Base ya utiliza el verde principal.
Variable/Uso Hex HSL
(Aprox.)
Descripción y Uso en Framework
Base
cfe-green #008E5A
hsl(158
100% 27%)
Verde principal de CFE. Usado
en: loader de página (data-loadercolor), botones primarios ("COLOR
VERDE" en documentación).
cfe-greendark
#006B47
hsl(157
100% 21%)
Variante oscura. Para botones (estado
normal si el primario es hover), bordes
gruesos, indicadores. (Puede requerir
CSS adicional)
cfe-greenvery-dark
#004D33
hsl(157
100% 15%)
Variante muy oscura. Botones
(presionado), bordes muy oscuros.
(Puede requerir CSS adicional)
cfe-text-ongreen
#FFFFFF
hsl(0 0%
100%)
Blanco puro para texto sobre fondos
verdes CFE.
cfe-black #111111
hsl(0 0%
7%)
Negro definido en el Framework Base
("COLOR NEGRO"). Útil para texto de
alto contraste, botones secundarios
(button-black).
2.2. Variables CSS del Tema Base (Recomendado para complementar el
Framework)
(Esta sección se mantiene de la guía anterior, ya que el Framework Base puede no cubrir
todos estos aspectos o se podría querer una capa de personalización adicional con Tailwind
CSS. Los valores HSL son cruciales para la tematización claro/oscuro si el framework no la
provee nativamente con variables).
Modo Claro (:root)
Variable HSL Value Aplicación Típica
--background 0 0% 100% Fondo principal de la aplicación/interfaz web.
(Blanco)
--foreground 0 0% 3.9%
Texto principal (si no se usa cfe-black),
elementos de primer plano, iconos.
--card 0 0% 100% Fondo de elementos tipo tarjeta/contenedor.
(Blanco)
--cardforeground
0 0% 3.9% Texto dentro de elementos tipo tarjeta.
--popover 0 0% 100% Fondo de popovers, menús desplegables.
(Blanco)
--popoverforeground
0 0% 3.9% Texto en popovers, menús desplegables.
--primary
(cfegreen) El verde CFE #008E5A debe ser el primario.
--primaryforeground
0 0% 100%
Texto sobre elementos con fondo --primary.
(Blanco)
--secondary 0 0% 7%
Color secundario (cfe-black #111111 o un
gris oscuro) para acciones.
--secondaryforeground
0 0% 98%
Texto sobre elementos con fondo --
secondary. (Casi Blanco)
--muted 0 0% 96.1% Elementos sutiles/apagados, fondos de
campos. (Gris Muy Claro)
--mutedforeground
0 0% 45.1% Texto de ayuda, placeholders, texto sobre
elementos apagados. (Gris Medio)
--accent 0 0% 96.1% Color de acento para destacar elementos
sutiles, hover. (Gris Muy Claro)
--accentforeground
0 0% 9%
Texto sobre elementos con fondo --accent.
(Gris Oscuro)
--destructive
0 84.2%
60.2%
Color para acciones destructivas (eliminar),
errores. (Rojo de alertas)
--destructiveforeground
0 0% 98%
Texto sobre elementos con fondo --
destructive. (Casi Blanco)
--border 0 0% 89.8% Color para bordes de inputs, tarjetas,
separadores. (Gris Claro)
--input 0 0% 89.8% Color de fondo para campos de entrada (a
menudo igual a --border). (Gris Claro)
--ring
(cfegreen)
Color para anillos de enfoque (focus rings),
idealmente CFE Green.
--radius (variable)
Radio de borde base
(ej. 4px o 0.25rem si button-rounded es
sutil).
Modo Oscuro (.dark) (Si se implementa adicionalmente)
Variable HSL
Value
Descripción
--background
0 0%
7%
Fondo principal (Negro/Gris muy
oscuro, similar a cfe-black)
--foreground
0 0%
98% Texto principal (Casi Blanco)
... (adaptar el resto de variables del
modo oscuro de la guía anterior) ...
2.3. Colores Semánticos del Framework Base (Alertas, Botones Genéricos)
El Framework Base provee colores semánticos para alertas (success, error/danger, warning,
info) y una paleta de colores para botones genéricos (ROJO, AMARILLO, CAFÉ, AQUA, etc.).
• Alertas: Utilizar los colores definidos por el framework para los componentes de alerta
(alert-success, alert-danger, etc.) ya que son visualmente distintivos y
comunican el estado apropiado.
• Botones Genéricos: Si bien el framework ofrece una amplia gama de colores para
botones, para aplicaciones CFE, se priorizará el uso de cfe-green para acciones
primarias y cfe-black (o un gris neutro) para acciones secundarias o buttondefault. Los otros colores (ROJO, AMARILLO, etc.) deben usarse con extrema
moderación y solo si un estado específico de la UI lo requiere y no entra en conflicto
con la identidad de CFE (ej. un botón "Eliminar" podría ser rojo).
2.4. Uso Estratégico de Colores (Adaptado al Framework)
• Primario (cfe-green, clase button verde): Para botones de acción principal (ej.
"Enviar", "Generar Reporte", "Procesar Archivo"). El Framework Base ya lo contempla.
• Secundario (cfe-black, clase button-black o button default): Para acciones
como "Cancelar", "Limpiar Formulario".
• Alertas: Los colores provistos por el framework para alertsuccess (verde), alert-danger (rojo), alert-warning (amarillo), alertinfo (azul) son estándar y deben usarse.
• Texto: Usar cfe-black (#111111) o --foreground para el texto principal,
asegurando alto contraste con el fondo.
• Fondos: El fondo principal es blanco por defecto. Las tarjetas y contenedores pueden
tener fondos sutilmente diferentes si el framework lo define o si se personaliza.
• Loader: El data-loader-color="#008E5A" ya establece el color CFE.
3. Tipografía
3.1. Fuente Principal
• Recomendación CFE: Noto Sans. (Como en la guía anterior).
• Framework Base: Es probable que el Framework Base defina su propia familia de
fuentes. Se debe:
1. Verificar si es posible y sencillo configurar Noto Sans como la fuente
principal del Framework Base.
2. Si no es factible, evaluar si la fuente del Framework Base es profesional, clara
y adecuada para CFE. Si lo es (ej. una sans-serif común como Open Sans,
Lato, Roboto), puede utilizarse.
3. Si la fuente del Framework Base no es adecuada, se debe priorizar la
implementación de Noto Sans mediante CSS adicional.
• Fallback: Arial, Helvetica, sans-serif.
3.2. Jerarquía Visual y Tamaños
El Framework Base probablemente define su propia escala tipográfica a través de sus clases
para encabezados (h1-h6), párrafos, y componentes.
• Adaptar la Jerarquía CFE: Mapear los niveles jerárquicos de la guía CFE a las clases
y elementos del Framework Base.
o Títulos de Página/Sección Principal: Usar el elemento o clase más
prominente del framework para títulos (ej. <h1>, o una clase específica de
título).
o Subtítulos / Encabezados de Sección: Clases de encabezado secundarias.
o Texto de Párrafo Principal / Etiquetas de Campo: Clases de párrafo o texto
base.
o Texto Secundario / Ayuda / Placeholders: Clases de texto más pequeñas o
con menor peso.
• Consistencia del Framework: Utilizar las clases de tamaño y peso de fuente
proporcionadas por el Framework Base para mantener la consistencia interna del
tema.
3.3. Pesos de Fuente
Utilizar los pesos de fuente (font-weight) que el Framework Base aplique a sus clases
(normal, bold, etc.) o los que se definan globalmente si se personaliza con Noto Sans.
3.4. Legibilidad
• Line-height: Respetar el interlineado definido por el Framework Base, que suele estar
optimizado. Ajustar con CSS si es necesario para mejorar la legibilidad.
• Contraste: Siempre asegurar un contraste mínimo de 4.5:1 (WCAG AA) para el
texto.
4. Bordes, Radios y Sombras
4.1. Radio de Borde
• Framework Base: La clase button-rounded indica que el framework utiliza bordes
redondeados para botones. Se debe aplicar esta filosofía a otros elementos como
tarjetas, inputs y modales si el framework lo soporta o si se personaliza.
• Variable CSS (--radius): Si se realizan personalizaciones adicionales, definir una
variable --radius (ej. 4px, 0.25rem, 0.5rem dependiendo de la prominencia del
redondeo) y aplicarla consistentemente.
4.2. Bordes
• Color: El Framework Base definirá colores de borde para sus componentes (inputs,
tablas, tarjetas). Estos suelen ser grises sutiles.
• Grosor: Generalmente 1px.
• Uso: Para delimitar campos de entrada, tablas (table table-striped), tarjetas, y
otros contenedores según el diseño del Framework.
4.3. Sombras
• El Framework Base puede aplicar sombras sutiles a elementos como modales,
dropdowns o tarjetas para dar profundidad. Utilizar las sombras provistas por el
framework. Si no las tiene, se pueden añadir con moderación usando CSS.
5. Iconografía
5.1. Principios de Uso
• Intuitivos: Los iconos deben representar claramente su acción.
• Funcionales: Ayudar a identificar rápidamente la función de botones o elementos.
• Color: Los iconos deben heredar el color del texto (currentColor) o tener clases
para cambiar su color según el contexto, alineándose con la paleta CFE.
Tambien en algunas ocasiones utilizamos
Cómo se crean y cuándo se usan las Alertas Visualmente:Las alertas son cruciales para
comunicar estados importantes al usuario (errores, advertencias, confirmaciones,
información). En tu configuración actual, el aspecto visual de las alertas se derivaría
principalmente de:
1. Colores Semánticos:
• Alerta Destructiva/Error: Ya tienes definido un color destructive (rojo)
y su destructive-foreground (texto sobre el rojo). Esto se usaría
para alertas de error críticas.
• Visual: Fondo rojo (bg-destructive), texto blanco o muy claro
(text-destructive-foreground), y posiblemente un borde rojo
(border-destructive).
• Cuándo: Fallos en una operación, validaciones incorrectas, problemas
de conexión, etc.
• Alerta de Éxito: Aunque no está explícitamente definido un color "success"
en las variables como --success, podrías usar el cfe-green para este
propósito, ya que es el color principal de tu marca y a menudo se asocia con
resultados positivos.
• Visual: Fondo cfe-green (bg-cfe-green), texto blanco (textprimary-foreground o un color específico si cfe-green es muy
oscuro para texto blanco), y un borde cfe-green (border-cfegreen).
• Cuándo: Operación completada con éxito, datos guardados
correctamente, confirmación de una acción.
• Alerta de Advertencia: Podrías usar el highlight-yellow (#FFFFE0)
como fondo para una advertencia sutil, o considerar un amarillo/naranja más
estándar si necesitas más énfasis. Si usas highlight-yellow como fondo,
el texto sería oscuro (ej. text-foreground o dark-grey-text).
• Visual (ej. con highlight-yellow): Fondo amarillo pálido (bghighlight-yellow), texto oscuro (text-black-text o text-darkgrey-text), y un borde amarillo más oscuro (podrías definir
un warning-border o usar border-yellow-400 si tienes esos colores
en Tailwind).
• Cuándo: Posibles problemas, acciones que requieren precaución,
información que el usuario debe revisar antes de continuar.
• Alerta Informativa: El cfe-green-very-light (#E6F4EF) es una
excelente opción para el fondo de alertas informativas no críticas, ya que
es suave y está alineado con la marca. El texto podría ser cfegreen o dark-grey-text.
• Visual: Fondo verde muy claro (bg-cfe-green-very-light), texto
verde oscuro (text-cfe-green) o gris oscuro (text-dark-greytext), y un borde cfe-green-light (border-cfe-green-light).
• Cuándo: Consejos, información adicional, cambios menores,
notificaciones generales.
2. Estructura del Componente de Alerta (estilo shadcn/ui):
Si estás usando (o planeas usar) componentes de shadcn/ui, el
componente Alert generalmente tiene:
• Un fondo que toma el color semántico principal (ej. bg-destructive).
• Un color de texto (AlertTitle, AlertDescription) que contrasta con el
fondo (ej. text-destructive-foreground).
• Un borde que a menudo coincide con el color principal o una variante del
mismo (border-destructive).
• Iconografía: Es muy común incluir un icono a la izquierda del texto de la
alerta para reforzar visualmente el tipo de mensaje (ej., un círculo con 'X'
para error, un check para éxito, un triángulo de advertencia para warning,
una 'i' para info). El color del icono normalmente coincidiría con el color del
texto o el color principal de la alerta.
• Radios de Esquina y Padding: Seguirían tus definiciones globales (--
radius para rounded-lg, rounded-md, etc.) y las utilidades de padding de
Tailwind (ej. p-4).
3. Cuándo y Cómo se Muestran:
• Contexto: Las alertas deben aparecer en un lugar visible y relevante para la
acción que las desencadenó. Pueden ser a nivel de página (en la parte
superior) o a nivel de componente (cerca del formulario o elemento que
causó la alerta).
• Claridad del Mensaje: El texto de la alerta
(AlertTitle y AlertDescription) debe ser conciso y claro, explicando el
qué y, si es posible, el cómo solucionarlo o el siguiente paso.
En resumen, tus alertas:
•Aprovecharían la paleta de colores CFE y los colores semánticos definidos.
•Tendrían un aspecto coherente con el resto de tu UI, usando los mismos radios de
borde, tipografía y espaciado.
•Se beneficiarían de iconos para una rápida identificación.
•Se usarían estratégicamente para comunicar estados importantes de forma
efectiva, sin abrumar al usuario.
La clave es la consistencia y la claridad, asegurando que los colores y el diseño de las
alertas guíen al usuario y no lo confundan. El uso de las variables CSS, como ya lo tienes
configurado, facilita mucho la implementación de estos estilos de manera consistente.

6. Motion & Micro-interactions (Política 6.1)
• Principios: sutiles, rápidos, consistentes. Evitar animaciones largas o distractoras.
• Tokens de Animación:
  - Duraciones: 120ms (rápida), 200ms (base), 300ms (suave).
  - Easing: `ease-out` para entradas, `ease-in` para salidas, `ease-in-out` para hover/focus.
• Aplicación: botones (hover/active), transiciones de paneles/modales, aparición de tooltips y toasts.
• No hacer: animaciones personalizadas ad-hoc sin reutilización; parallax pesado o sombras animadas permanentes.

7. Densidad y Estructura de Formularios (Política 6.3)
• Preferencia de una sola página con secciones claras (agrupaciones, acordeones, avanzados colapsables).
• Aceptar scroll razonable para ofrecer panorama completo.
• Header/acciones “sticky”; validación por sección y mensajes claros.
• Campos de alto uso primero (regla 80/20); campos opcionales en secciones colapsables.

8. Diálogos y Paneles (Política 6.2)
• Desktop-first multi-columna: 2–3 columnas en ≥ md; 1 columna en < md.
• Ancho objetivo: 720–960px; altura con scroll interno. Evitar que el modal expanda la página.
• Contenido estructurado por secciones con títulos; acciones alineadas a la derecha.

9. Breakpoints & Desktop-First
• Prioridad de escritorio: optimizar densidad y productividad en pantallas grandes.
• Tablets: asegurar uso cómodo (espaciado y tamaños táctiles adecuados).
• Móviles: experiencia funcional sin comprometer escritorio; se evita rediseñar complejidades para móvil si penaliza el core de escritorio.
