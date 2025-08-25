import './config/env.js';
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { AppError } from './utils/customErrors.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Set security headers
app.use(helmet());

// --- Configuración de CORS ---

// Lista blanca de orígenes permitidos en desarrollo.
// En producción, esto debería ser una variable de entorno con la URL del frontend.
const allowed = new Set([
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://127.0.0.1:3000',
]);

app.use(cors({
    origin: (origin, callback) => callback(null, !origin || allowed.has(origin)),
    credentials: true,
}));

// --- Fin de la Configuración de CORS ---

// Parse JSON and URL-encoded bodies before rate limiting, but after CORS
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Rate limiting configuration
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 auth requests per windowMs
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Demasiados intentos de autenticación. Intente nuevamente en 15 minutos.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting ONLY to authentication routes
app.use('/api/v1/auth', authLimiter);

try {
    // --- Application Routes ---
    // IMPORTANTE: Importar las rutas aquí para que la resolución del contenedor
    // ocurra dentro del bloque try-catch y después de cargar el entorno.
    const authRoutes = (await import('./modules/auth/auth.routes.js')).default;
    app.use('/api/v1/auth', authRoutes);

    // Inventory routes
    const inventoryRoutes = (await import('./modules/inventory/inventory.routes.js')).default;
    app.use('/api/v1/inventory', inventoryRoutes);

    // Health check endpoint
    app.get('/api/v1/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'GATI-C Backend',
            version: '0.1.0'
        });
    });

    // Root endpoint
    app.get('/', (req, res) => {
        res.json({
            message: 'GATI-C Backend API',
            version: '0.1.0',
            status: 'running'
        });
    });

    // --- 404 Handler ---
    app.use('*', (req, res) => {
        res.status(404).json({
            success: false,
            error: { code: 'NOT_FOUND', message: 'Endpoint no encontrado' }
        });
    });

    // --- Global Error Handler ---
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error('Unhandled Error:', err);

        if (err instanceof AppError) {
            return res.status(err.statusCode).json({
                success: false,
                error: { code: err.name, message: err.message }
            });
        }

        return res.status(500).json({
            success: false,
            error: { code: 'INTERNAL_SERVER_ERROR', message: 'Ha ocurrido un error inesperado' }
        });
    });

    // --- Start Server ---
    app.listen(PORT, () => {
        console.log(`🚀 GATI-C Backend server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
} catch (error) {
    console.error('❌ Failed to start server due to a critical error:', error);
    process.exit(1);
}

export default app;