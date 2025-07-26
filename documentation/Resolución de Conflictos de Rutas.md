# Resolución de Conflictos de Rutas en GATI-C

## Problema

En Next.js App Router, no se pueden tener dos páginas que resuelvan a la misma ruta. Este error se manifiesta como:

```
You cannot have two parallel pages that resolve to the same path. Please check [ruta1] and [ruta2].
```

Este documento detalla el proceso para identificar y resolver estos conflictos, tomando como ejemplo el caso de las rutas duplicadas en la sección de configuración.

## Causas Comunes

1. **Duplicación de páginas**: Archivos `page.tsx` en diferentes ubicaciones que resuelven a la misma URL.
2. **Conflictos entre grupos de rutas**: Páginas dentro y fuera de grupos de rutas (como `(app)`) que generan la misma ruta.
3. **Migración parcial**: Durante la migración de una estructura de carpetas a otra, pueden quedar archivos en ambas ubicaciones.

## Proceso de Resolución

### 1. Identificación del Conflicto

El error de compilación de Next.js indica claramente las rutas en conflicto:

```
You cannot have two parallel pages that resolve to the same path. Please check /(app)/configuracion/page and /configuracion/page.
```

En este caso, los archivos en conflicto eran:
- `app/(app)/configuracion/page.tsx`
- `app/configuracion/page.tsx`

### 2. Análisis de Contenido

Antes de eliminar cualquier archivo, es importante comparar el contenido de ambos para no perder funcionalidad:

1. **Comparar tamaño y fecha de modificación**: Esto da una primera idea de cuál archivo podría ser más completo o reciente.
2. **Revisar el código**: Analizar las importaciones, componentes y funcionalidades de cada archivo.
3. **Identificar características únicas**: Determinar si alguno de los archivos tiene funcionalidades que el otro no tiene.

### 3. Respaldo de Archivos

Siempre crear copias de seguridad antes de eliminar archivos:

```powershell
# Crear directorio de respaldo
mkdir -p backup/_nombre_seccion_backup

# Copiar archivos
Copy-Item -Path "ruta/al/archivo1.tsx" -Destination "backup/_nombre_seccion_backup/archivo1_backup.tsx"
Copy-Item -Path "ruta/al/archivo2.tsx" -Destination "backup/_nombre_seccion_backup/archivo2_backup.tsx"
```

### 4. Fusión de Contenido

Hay varias estrategias para fusionar el contenido:

1. **Usar el archivo más completo**: Si un archivo contiene todas las funcionalidades del otro y más, usarlo como base.
2. **Fusión manual**: Combinar manualmente las funcionalidades únicas de ambos archivos.
3. **Crear nueva implementación**: En casos complejos, puede ser mejor reescribir la funcionalidad desde cero.

### 5. Eliminación de Duplicados

Una vez que el contenido está fusionado en la ubicación correcta, eliminar los archivos duplicados:

```powershell
# Eliminar archivo duplicado
Remove-Item -Path "ruta/al/archivo_duplicado.tsx"

# Si la carpeta queda vacía, eliminarla también
Remove-Item -Path "ruta/carpeta_vacia" -Force
```

### 6. Verificación

Después de resolver el conflicto:

1. **Compilar la aplicación**: Verificar que no haya errores de compilación.
2. **Probar la funcionalidad**: Asegurarse de que todas las características sigan funcionando.
3. **Verificar la navegación**: Comprobar que las rutas funcionen correctamente.

### 7. Documentación

Documentar los cambios realizados:

1. **Actualizar CHANGELOG.md**: Registrar la eliminación de rutas duplicadas y la fusión de contenido.
2. **Comentar el código**: Si se fusionaron funcionalidades complejas, añadir comentarios explicativos.

## Caso de Estudio: Configuración

### Problema Detectado

Al iniciar el servidor de desarrollo, se mostró el error:

```
You cannot have two parallel pages that resolve to the same path. Please check /(app)/configuracion/page and /configuracion/page.
```

### Análisis

- `app/configuracion/page.tsx`: 955 líneas, implementación más completa
- `app/(app)/configuracion/page.tsx`: 768 líneas, implementación más reciente pero menos completa
- `app/(app)/configuracion/loading.tsx`: Componente de carga que debía mantenerse

### Solución Aplicada

1. **Respaldo**: Se crearon copias de seguridad de ambos archivos.
2. **Fusión**: Se utilizó el archivo más completo como base.
3. **Ubicación**: Se colocó el archivo fusionado en la ubicación correcta (`app/(app)/configuracion/page.tsx`).
4. **Limpieza**: Se eliminó el directorio `app/configuracion` para evitar conflictos futuros.

### Resultado

- Servidor de desarrollo inicia sin errores
- Se mantiene toda la funcionalidad
- Estructura de carpetas sigue las mejores prácticas de Next.js App Router

## Mejores Prácticas para Evitar Conflictos

1. **Seguir la estructura de grupos de rutas**: Usar grupos de rutas (`(app)`, etc.) de manera consistente.
2. **Eliminar archivos antiguos**: Al mover archivos, asegurarse de eliminar las versiones anteriores.
3. **Documentar la estructura**: Mantener documentación actualizada sobre la estructura de carpetas y rutas.
4. **Revisar cambios antes de commit**: Verificar que no haya duplicados antes de confirmar cambios.

## Referencias

- [Next.js App Router Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
- [Arquitectura de Layout y Navegación en GATI-C](./Arquitectura%20de%20Layout%20y%20Navegación.md)
- [Guía de Migración de Layout](./Guía%20de%20Migración%20de%20Layout.md) 