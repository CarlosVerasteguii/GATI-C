/**
 * Clases de error personalizadas para el sistema GATI-C
 * 
 * Estas clases extienden la funcionalidad de Error nativa de JavaScript
 * para proporcionar manejo de errores más robusto y tipado.
 */

/**
 * Clase base para todos los errores de la aplicación
 */
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Asegurar que la cadena de prototipos sea correcta
        Object.setPrototypeOf(this, AppError.prototype);

        // Capturar el stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

/**
 * Error específico para problemas de autenticación
 */
export class AuthError extends AppError {
    constructor(message = 'Error de autenticación') {
        super(message, 401);
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}

/**
 * Error específico para problemas de autorización
 */
export class AuthorizationError extends AppError {
    constructor(message = 'Acceso denegado') {
        super(message, 403);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}

/**
 * Error específico para problemas de validación
 */
export class ValidationError extends AppError {
    public details?: any;

    constructor(message = 'Error de validación', details?: any) {
        super(message, 400);
        this.details = details;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Error específico para recursos no encontrados
 */
export class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * Error específico para conflictos de datos
 */
export class ConflictError extends AppError {
    constructor(message = 'Conflicto de datos') {
        super(message, 409);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
