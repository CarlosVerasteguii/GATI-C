import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Demasiadas solicitudes. Intente nuevamente en 15 minutos.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

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

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Internal server error'
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 GATI-C Backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
