import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants.js';
import { AuthError } from '../utils/customErrors.js';

/**
 * Middleware de autenticación que protege las rutas privadas
 * 
 * Este middleware:
 * 1. Extrae el token JWT de la cookie configurada
 * 2. Verifica la validez del token usando el JWT_SECRET
 * 3. Adjunta el payload decodificado al objeto request
 * 4. Permite continuar al siguiente middleware/controlador
 * 
 * Principio de Responsabilidad Única: Solo se encarga de la verificación
 * de autenticación, delegando el manejo de errores al manejador global.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const protect = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // 1. Extraer el token de la cookie usando constantes centralizadas
        const token = req.cookies?.[AUTH_CONSTANTS.AUTH_COOKIE_NAME];

        // 2. Verificar si el token existe
        if (!token) {
            throw new AuthError('Acceso denegado. No se proporcionó token.');
        }

        // 3. Verificar y decodificar el token
        // La validación del JWT_SECRET ya ocurrió al arrancar la app.
        // Si llegamos aquí, podemos asumir que process.env.JWT_SECRET existe.
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        // 4. Adjuntar el payload decodificado al objeto request
        req.user = decoded;

        // 5. Continuar al siguiente middleware o controlador
        next();
    } catch (error) {
        // Si el error es de jsonwebtoken (token expirado, firma inválida), 
        // lo convertimos en nuestro error estándar de autenticación.
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            return next(new AuthError('Token inválido o expirado.'));
        }

        // Pasamos cualquier otro error al manejador global.
        return next(error);
    }
};
