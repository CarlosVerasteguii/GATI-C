// backend/src/utils/customErrors.ts

/**
 * Clase base para todos los errores operativos controlados en la aplicación.
 * Esta implementación asegura que `instanceof` funcione correctamente en diferentes entornos
 * y que el nombre de la clase de error se preserve.
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Asigna el nombre de la clase del error específico (AuthError, etc.)
        // Esto es crucial para la identificación de errores.
        this.name = this.constructor.name;

        // Mantiene un stack trace adecuado para la depuración
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error para problemas relacionados con la autenticación (ej. token faltante, inválido o expirado).
 * Código de estado: 401 Unauthorized
 */
export class AuthError extends AppError {
    constructor(message = 'Error de autenticación') {
        super(message, 401);
    }
}

/**
 * Error para problemas relacionados con la autorización (ej. rol insuficiente).
 * Código de estado: 403 Forbidden
 */
export class AuthorizationError extends AppError {
    constructor(message = 'No tienes permiso para realizar esta acción') {
        super(message, 403);
    }
}

/**
 * Error para datos de entrada inválidos que no pasan la validación.
 * Código de estado: 400 Bad Request
 */
export class ValidationError extends AppError {
    public readonly details?: any;

    constructor(message = 'Datos de entrada inválidos', details?: any) {
        super(message, 400);
        this.details = details;
    }
}

/**
 * Error para cuando no se encuentra un recurso solicitado.
 * Código de estado: 404 Not Found
 */
export class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
    }
}

/**
 * Error para conflictos de datos (ej. email duplicado, constraint violation).
 * Código de estado: 409 Conflict
 */
export class ConflictError extends AppError {
    constructor(message = 'Conflicto de datos') {
        super(message, 409);
    }
}
