# Docker Setup for GATI-C

Este documento proporciona instrucciones para configurar el entorno de desarrollo local usando Docker para el proyecto GATI-C.

## Configuración de Base de Datos MySQL

El proyecto utiliza Docker Compose para proporcionar un entorno de base de datos MySQL consistente y portátil.

### Requisitos Previos

- [Docker](https://www.docker.com/get-started) instalado en tu máquina local
- [Docker Compose](https://docs.docker.com/compose/install/) instalado (generalmente se incluye con Docker Desktop)

### Configuración Inicial

1. **Crea un archivo `.env` en la raíz del proyecto**

   Este archivo contendrá las credenciales de la base de datos. Crear manualmente con el siguiente contenido:

   ```env
   # Secretos de la Base de Datos para Desarrollo Local
   DB_PASSWORD=una_contraseña_segura_para_gati_user
   DB_ROOT_PASSWORD=una_contraseña_muy_segura_para_root
   ```

   > **IMPORTANTE**: Cambia los valores de contraseña a valores seguros. Este archivo NO debe subirse al repositorio (ya está incluido en `.gitignore`).

2. **Iniciar los contenedores**

   Ejecuta el siguiente comando desde la raíz del proyecto:

   ```bash
   docker-compose up -d
   ```

   Esto iniciará el contenedor de MySQL en segundo plano.

3. **Verificar que todo funciona correctamente**

   Puedes comprobar que el contenedor está funcionando con:

   ```bash
   docker-compose ps
   ```

   Para ver los logs:

   ```bash
   docker-compose logs db
   ```

### Conexión a la Base de Datos

Para conectarse a la base de datos desde tu aplicación, usa las siguientes credenciales:

- **Host**: localhost
- **Puerto**: 3306
- **Usuario**: gati_user
- **Contraseña**: La definida en el archivo `.env`
- **Base de datos**: gati_c

### Detener los Contenedores

Para detener los contenedores:

```bash
docker-compose down
```

Si quieres borrar también el volumen con todos los datos:

```bash
docker-compose down -v
```

> **NOTA**: Esto eliminará todos los datos de la base de datos. Úsalo con precaución.

### Conexión de Prisma ORM

Para usar esta base de datos con Prisma, configura tu `DATABASE_URL` en el archivo `.env` de la siguiente manera:

```
DATABASE_URL="mysql://gati_user:${DB_PASSWORD}@localhost:3306/gati_c"
```

Luego, ejecuta tus migraciones o consultas con Prisma CLI como de costumbre. 