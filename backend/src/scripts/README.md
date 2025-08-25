# Scripts de Backend - GATI-C

## Smoke Test (`smoke-test.ts`)

### Descripción
Script de integración que verifica que el backend puede realizar operaciones CRUD básicas contra la base de datos real de MySQL via Prisma.

### ¿Qué prueba?
- ✅ Inyección de dependencias con tsyringe
- ✅ Registro de usuario con AuthService
- ✅ Persistencia en base de datos
- ✅ Hashing de contraseñas con bcrypt
- ✅ Generación de tokens JWT
- ✅ Verificación de integridad de datos

### Requisitos previos
1. Base de datos MySQL corriendo en Docker
2. Migraciones de Prisma aplicadas
3. Variables de entorno configuradas (`.env`)
4. Dependencias instaladas

### Cómo ejecutar

#### Opción 1: Script npm (recomendado)
```bash
cd backend
npm run smoke-test
```

#### Opción 2: Directamente con ts-node-dev
```bash
cd backend
npx ts-node-dev --transpile-only src/scripts/smoke-test.ts
```

### Variables de entorno requeridas
Asegúrate de tener configurado el archivo `.env` en la raíz del proyecto con:
```env
MYSQL_ROOT_PASSWORD=tu_password_mysql
MYSQL_DATABASE=gati_c_db
JWT_SECRET=tu_clave_secreta_segura
```

### Salida esperada
```bash
🚀 --- Iniciando Smoke Test del Backend ---
📊 Probando integración con base de datos MySQL via Prisma...
✅ AuthService resuelto exitosamente desde el contenedor IoC
👤 Datos de prueba: { email: 'test-1234567890@example.com', name: 'Test User' }
🔐 Intentando registrar nuevo usuario...
✅ Éxito: Usuario registrado exitosamente
👤 Usuario creado: { id: '...', name: 'Test User', email: '...' }
🔑 Token JWT generado: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔍 Verificando persistencia en la base de datos...
✅ Verificación en DB exitosa
🔒 Hash de contraseña correctamente almacenado y hasheado
🎉 ¡Smoke Test PASADO! El backend puede crear y persistir usuarios correctamente.
🔌 Desconectando de la base de datos...
--- Smoke Test Finalizado ---
```

### Posibles errores y soluciones

#### Error: "FATAL ERROR: JWT_SECRET is not defined"
**Solución:** Configura la variable `JWT_SECRET` en tu archivo `.env`

#### Error: "P1001: Can't reach database server"
**Solución:** Verifica que Docker esté corriendo y que la base de datos MySQL esté disponible

#### Error: "El correo electrónico ya está en uso"
**Solución:** El script genera emails únicos con timestamp, pero puedes limpiar la tabla users si es necesario

### Arquitectura del script
- Usa `tsyringe` para inyección de dependencias
- Sigue el patrón singleton para servicios
- Implementa manejo de errores robusto
- Verifica integridad de datos en la base de datos
- Desconecta correctamente de Prisma
