# Guía de Contribución para GATI-C

Esta guía describe el proceso de desarrollo y las convenciones que deben seguirse al contribuir al proyecto GATI-C.

## Flujo de Trabajo con Git

Seguimos una variante del flujo de trabajo [GitFlow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) adaptada a nuestras necesidades:

### Ramas Principales

- **main**: Rama principal que contiene código listo para producción.
- **develop**: Rama de desarrollo donde se integran las características completadas.

### Ramas de Soporte

- **feature/nombre-caracteristica**: Para desarrollar nuevas características.
- **fix/nombre-problema**: Para corregir errores.
- **refactor/nombre-mejora**: Para refactorización de código sin cambiar su comportamiento.
- **docs/nombre-documentacion**: Para actualización de documentación.

### Proceso de Desarrollo

1. **Crear una rama**: Desde `develop`, crea una nueva rama según el tipo de trabajo:
   ```bash
   # Para nuevas características
   git checkout develop
   git pull
   git checkout -b feature/nombre-caracteristica
   
   # Para corrección de errores
   git checkout -b fix/nombre-problema
   
   # Para refactorización
   git checkout -b refactor/nombre-mejora
   
   # Para documentación
   git checkout -b docs/nombre-documentacion
   ```

2. **Realizar cambios**: Trabaja en tu rama local realizando commits frecuentes.

3. **Mensajes de Commit**: Usar [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   <tipo>[ámbito opcional]: <descripción>
   
   [cuerpo opcional]
   
   [nota de pie opcional]
   ```
   
   Donde `<tipo>` puede ser:
   - **feat**: Nueva característica
   - **fix**: Corrección de errores
   - **docs**: Cambios en documentación
   - **style**: Cambios que no afectan el significado del código (espacios, formato, etc.)
   - **refactor**: Refactorización del código
   - **test**: Añadir pruebas o corregir existentes
   - **chore**: Cambios en el proceso de build o herramientas auxiliares

   Ejemplo:
   ```
   feat(inventario): implementar filtro avanzado por estado
   
   - Añade filtros por múltiples estados
   - Implementa persistencia de filtros en localStorage
   - Optimiza rendimiento con React.useMemo
   
   Closes #123
   ```

4. **Pull Request**: Al terminar los cambios:
   - Asegúrate de que tu rama esté actualizada con develop
   ```bash
   git checkout develop
   git pull
   git checkout tu-rama
   git rebase develop
   ```
   - Sube tu rama al repositorio
   ```bash
   git push -u origin tu-rama
   ```
   - Crea un Pull Request (PR) a través de GitHub
   - Asigna revisores

5. **Revisión de Código**:
   - Todos los cambios deben ser revisados por al menos un desarrollador
   - Abordar todos los comentarios de la revisión

6. **Merge**:
   - Una vez aprobado, el PR se fusiona con `develop`
   - Para releases, `develop` se fusionará con `main`

## Estándares de Código

Seguimos los estándares definidos en [.cursorules](/.cursorules) que incluyen:

- **TypeScript**: Usar tipos estrictos
- **React/Next.js**: Convenciones para componentes y hooks
- **Tailwind CSS**: Para estilos
- **Documentación**: JSDoc para todos los componentes

## Pruebas

- Todas las nuevas características deben incluir pruebas unitarias
- Los PR no serán aprobados si las pruebas no pasan

## Actualización del CHANGELOG

Después de cada conjunto significativo de cambios:

1. Actualiza el archivo `CHANGELOG.md` en la sección [Unreleased]
2. Cuando se prepare un release, mueve los cambios a una nueva sección con el número de versión

## Herramientas Recomendadas

- Visual Studio Code con extensiones:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
- Cursor IDE para integración con IA 