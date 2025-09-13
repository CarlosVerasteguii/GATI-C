# Documentación de Configuración y Solución de Problemas - GATI-C

## 1. Diagnóstico Inicial

### Problemas detectados:

1. **Errores de dependencias y paquetes npm**:
   - Múltiples advertencias de `npm warn ERESOLVE overriding peer dependency`
   - Error: `Cannot read properties of null (reading 'matches')`
   - Estos problemas pueden causar instalaciones incompletas o comportamiento inconsistente

2. **Problemas de inicialización de Next.js**:
   - La compilación a veces solo comienza cuando se accede manualmente a localhost:3000
   - Error de permisos: `[Error: EPERM: operation not permitted, open '.next/trace']`
   - Puerto 3000 ya en uso (usando 3001 en su lugar)

3. **Error de rutas duplicadas** (añadido posteriormente):
   - Error: `You cannot have two parallel pages that resolve to the same path`
   - Dos archivos diferentes intentaban servir la misma ruta `/dashboard`:
     - `app/dashboard/page.tsx`
     - `app/(app)/dashboard/page.tsx`

## 2. Soluciones implementadas

### 2.1 Limpieza del entorno de ejecución
- Detenidos todos los procesos de Node.js en ejecución (`taskkill /f /im node.exe`)
- Limpieza de caché de npm (`npm cache clean --force`)
- Eliminación de directorios problemáticos:
  - `node_modules`: Para evitar dependencias corruptas o incompletas
  - `.next`: Para evitar problemas de compilación y caché
- Eliminación del archivo `pnpm-lock.yaml` para evitar conflictos entre gestores de paquetes

### 2.2 Instalación de dependencias
- Reinstalación limpia de dependencias usando npm con la opción `--legacy-peer-deps` para evitar problemas de compatibilidad
- Creación de archivo `.env.local` con configuraciones básicas, incluyendo puerto 3001 como alternativa
- Ejecución exitosa del servidor de desarrollo (`npm run dev`) - El servidor está escuchando en el puerto 3000

### 2.3 Estructura del proyecto y resolución de rutas
- Análisis de la estructura de carpetas y rutas de Next.js App Router
- Identificación de archivos duplicados que apuntan a la misma ruta
- Eliminación de `app/dashboard/page.tsx` para resolver conflicto de rutas con `app/(app)/dashboard/page.tsx`
- Corrección de errores sintácticos en los componentes

### 2.4 Resultados
- ✅ Se resolvieron los problemas de dependencias
- ✅ Se eliminaron los errores de instalación
- ✅ El servidor Next.js inicia correctamente
- ✅ Se resolvió el conflicto de rutas duplicadas
- ✅ La aplicación está accesible en http://localhost:3000

## 3. Guía de Solución de Problemas Futuros

### 3.1 Problemas de compilación o inicio lento
Si la aplicación tarda en iniciar o solo compila cuando se accede a ella:
1. Detén todos los procesos de Node.js: `taskkill /f /im node.exe`
2. Elimina el directorio de caché: `Remove-Item -Recurse -Force .next`
3. Reinicia el servidor: `npm run dev`

### 3.2 Errores de dependencias
Si aparecen errores relacionados con dependencias:
1. Limpia la caché de npm: `npm cache clean --force`
2. Elimina node_modules: `Remove-Item -Recurse -Force node_modules`
3. Reinstala con la opción legacy: `npm install --legacy-peer-deps`

### 3.3 Puerto en uso
Si el puerto predeterminado está en uso:
1. Configura un puerto alternativo en `.env.local`: `PORT=3002`
2. O ejecuta directamente con un puerto diferente: `npm run dev -- -p 3002`

### 3.4 Errores de permisos
Si aparecen errores EPERM o de permisos:
1. Ejecuta PowerShell como administrador
2. Verifica que el usuario tiene permisos completos en la carpeta del proyecto
3. Ejecuta el comando que falló con privilegios elevados

### 3.5 Errores de rutas duplicadas
Si aparece error "You cannot have two parallel pages that resolve to the same path":
1. Identifica qué archivos están intentando servir la misma ruta
2. Decide cuál mantener según la estructura del proyecto
3. Elimina o renombra uno de los archivos duplicados
4. Ten en cuenta que en Next.js App Router:
   - Las carpetas determinan las rutas URL
   - Los grupos de rutas (carpetas con paréntesis como `(app)`) no afectan a la URL

## 4. Recomendaciones de Desarrollo

### 4.1 Gestión de paquetes
- Utilizar **siempre** el mismo gestor de paquetes (npm o pnpm, pero no mezclar)
- Para este proyecto, preferir npm con la opción `--legacy-peer-deps`

### 4.2 Actualizaciones
- Actualizar las dependencias gradualmente, no todas a la vez
- Probar la aplicación después de cada actualización importante
- Mantener el archivo de documentación actualizado con cualquier problema y solución

### 4.3 Entorno de desarrollo
- Usar Node.js LTS (versión recomendada 18.x o 20.x)
- Verificar que no hay procesos de Node.js abandonados antes de iniciar el servidor

### 4.4 Script de reseteo rápido
Se ha creado un script PowerShell (`reset-project.ps1`) para facilitar la limpieza y reinstalación del proyecto:
- Detiene todos los procesos de Node.js
- Limpia la caché de npm
- Elimina directorios problemáticos (node_modules, .next)
- Elimina archivos de bloqueo de paquetes
- Reinstala todas las dependencias con las configuraciones correctas
- Ofrece iniciar el servidor automáticamente

Para usarlo, ejecutar desde PowerShell:
```
.\reset-project.ps1
``` 