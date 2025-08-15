import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware de autenticación que protege las rutas privadas
 * 
 * Este middleware:
 * 1. Extrae el token JWT de la cookie 'token'
 * 2. Verifica la validez del token usando el JWT_SECRET
 * 3. Adjunta el payload decodificado al objeto request
 * 4. Permite continuar al siguiente middleware/controlador
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const protect = (req: Request, res: Response, next: NextFunction): void => {
    try {
        // 1. Extraer el token de la cookie
        const token = req.cookies?.token;

        // 2. Verificar si el token existe
        if (!token) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Acceso denegado. No se proporcionó token de autenticación.'
                }
            });
            return;
        }

        // 3. Obtener el JWT_SECRET del entorno
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            console.error('FATAL ERROR: JWT_SECRET no está definido en las variables de entorno');
            res.status(500).json({
                success: false,
                error: {
                    message: 'Error interno del servidor. Configuración de autenticación inválida.'
                }
            });
            return;
        }

        // 4. Verificar y decodificar el token
        const decoded = jwt.verify(token, jwtSecret);

        // 5. Adjuntar el payload decodificado al objeto request
        req.user = decoded;

        // 6. Continuar al siguiente middleware o controlador
        next();

    } catch (error) {
        // Manejar errores de verificación del token
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Token de autenticación inválido.'
                }
            });
            return;
        }

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                error: {
                    message: 'Token de autenticación expirado. Por favor, inicie sesión nuevamente.'
                }
            });
            return;
        }

        // Error inesperado
        console.error('Error inesperado en middleware de autenticación:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Error interno del servidor durante la autenticación.'
            }
        });
    }
};
