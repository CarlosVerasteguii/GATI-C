import './config/env.js';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Set security headers
app.use(helmet());

// Enable CORS with specific origin and credentials
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

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
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error('Unhandled Error:', err);
        res.status(500).json({
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
