# GATI-C Backend

Backend for CFE's IT asset management system, built with Node.js, Express, and TypeScript.

## 🚀 Features

- **Modular Architecture**: Structure organized by domain modules
- **JWT Authentication**: Secure authentication system with httpOnly cookies
- **Zod Validation**: Robust input validation with TypeScript schemas
- **RESTful API**: Well-defined endpoints following REST standards
- **OpenAPI Documentation**: Complete API specification
- **TypeScript**: Typed, robust code
- **Security Middleware**: Helmet, configured CORS, rate limiting

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- MySQL 8.0+ (for future implementations)

## 🛠️ Installation

1. **Clone the repository** (if not already in the project directory):
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your values
   ```

4. **Generate a secure JWT key**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Copy the output and paste it into JWT_SECRET in .env
   ```

## 🚀 Development

### Start development server:
```bash
npm run dev
```

The server will be available at `http://localhost:3001`

### Available endpoints:
- `GET /api/v1/health` - Health check
- `GET /` - Service information

## 📚 API Documentation

Full documentation is available at:
- **OpenAPI**: `docs/openapi.yml`
- **Swagger UI**: Available in development at `/api/docs` (future)

## 🏗️ Project Structure

```
backend/
├── docs/           # OpenAPI documentation
├── prisma/         # Database schemas and migrations
├── src/
│   ├── config/     # System configurations
│   ├── middleware/ # Custom middleware
│   ├── modules/    # Domain modules
│   │   └── auth/   # Authentication module
│   ├── routes/     # Route definitions
│   ├── utils/      # Utilities and helpers
│   └── server.ts   # Main entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Available Scripts

- `npm run dev` - Development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run compiled server

## 🔒 Security

- **JWT**: Secure tokens with configurable expiration
- **httpOnly Cookies**: Prevent XSS
- **Helmet**: HTTP security headers
- **CORS**: Restrictive configuration by origin
- **Rate Limiting**: Protection against brute force attacks

## 🧪 Testing

Tests will be implemented in future phases of the project.

## 📝 Logs

The system records:
- Server errors
- Authentication attempts
- Critical system operations

## 🔄 Next Steps

1. **Implement full authentication module**
2. **Configure database with Prisma**
3. **Implement inventory endpoints**
4. **Audit and logging system**
5. **Automated tests**

## 🤝 Contribution

This project follows the conventions established in GATI-C's TRD. To contribute:

1. Review the project documentation
2. Follow the established code standard
3. Update documentation as necessary

## 📄 License

Internal CFE project - All rights reserved.

---

**Version**: 0.1.0
**Last update**: August 2025
**Team**: GATI-C Development Team
