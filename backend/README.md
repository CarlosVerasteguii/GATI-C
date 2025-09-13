# GATI-C Backend

Backend para el sistema de gestión de activos de TI de la CFE, construido con Node.js, Express y TypeScript.

## 🚀 Características

- **Arquitectura Modular**: Estructura organizada por módulos de dominio
- **Autenticación JWT**: Sistema seguro de autenticación con cookies httpOnly
- **Validación Zod**: Validación robusta de entrada con esquemas TypeScript
- **API RESTful**: Endpoints bien definidos siguiendo estándares REST
- **Documentación OpenAPI**: Especificación completa de la API
- **TypeScript**: Código tipado y robusto
- **Middleware de Seguridad**: Helmet, CORS configurado, rate limiting

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- MySQL 8.0+ (para futuras implementaciones)

## 🛠️ Instalación

1. **Clonar el repositorio** (si no está ya en el directorio del proyecto):
   ```bash
   cd backend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp env.example .env
   # Editar .env con tus valores
   ```

4. **Generar clave JWT segura**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Copiar la salida y pegarla en JWT_SECRET en .env
   ```

## 🚀 Desarrollo

### Iniciar servidor de desarrollo:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

### Endpoints disponibles:
- `GET /api/v1/health` - Health check
- `GET /` - Información del servicio

## 📚 Documentación de la API

La documentación completa está disponible en:
- **OpenAPI**: `docs/openapi.yml`
- **Swagger UI**: Disponible en desarrollo en `/api/docs` (futuro)

## 🏗️ Estructura del Proyecto

```
backend/
├── docs/           # Documentación OpenAPI
├── prisma/         # Esquemas y migraciones de base de datos
├── src/
│   ├── config/     # Configuraciones del sistema
│   ├── middleware/ # Middleware personalizado
│   ├── modules/    # Módulos de dominio
│   │   └── auth/   # Módulo de autenticación
│   ├── routes/     # Definición de rutas
│   ├── utils/      # Utilidades y helpers
│   └── server.ts   # Punto de entrada principal
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm run start` - Ejecutar servidor compilado

## 🔒 Seguridad

- **JWT**: Tokens seguros con expiración configurable
- **Cookies httpOnly**: Prevención de XSS
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración restrictiva por origen
- **Rate Limiting**: Protección contra ataques de fuerza bruta

## 🧪 Testing

Los tests serán implementados en futuras fases del proyecto.

## 📝 Logs

El sistema registra:
- Errores del servidor
- Intentos de autenticación
- Operaciones críticas del sistema

## 🔄 Próximos Pasos

1. **Implementar módulo de autenticación completo**
2. **Configurar base de datos con Prisma**
3. **Implementar endpoints de inventario**
4. **Sistema de auditoría y logging**
5. **Tests automatizados**

## 🤝 Contribución

Este proyecto sigue las convenciones establecidas en el TRD de GATI-C. Para contribuir:

1. Revisar la documentación del proyecto
2. Seguir el estándar de código establecido
3. Actualizar la documentación según sea necesario

## 📄 Licencia

Proyecto interno de la CFE - Todos los derechos reservados.

---

**Versión**: 0.1.0  
**Última actualización**: Agosto 2025  
**Equipo**: GATI-C Development Team
