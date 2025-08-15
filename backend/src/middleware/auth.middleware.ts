import { Request, Response, NextFunction } from 'express';
import { jwtVerify, JWTPayload } from 'jose';
import { AUTH_CONSTANTS } from '../config/constants.js';
import { AuthError } from '../utils/customErrors.js';

// Extendemos la interfaz Request una sola vez, aquí, ya que es el único lugar donde se usa.
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.[AUTH_CONSTANTS.AUTH_COOKIE_NAME];
        if (!token) {
            // Nota: Lanzamos el error, no lo pasamos a next directamente desde aquí.
            throw new AuthError('Acceso denegado. No se proporcionó token.');
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ['HS256']
        });

        req.user = payload;
        next();
    } catch (error: any) {
        // El bloque catch ahora maneja todos los errores, incluido el AuthError de "token no proporcionado".
        if (error.code === 'ERR_JWT_EXPIRED') {
            return next(new AuthError('La sesión ha expirado. Por favor, inicie sesión de nuevo.'));
        }

        // Para cualquier otro error de `jose` (firma inválida, malformado) o nuestro propio AuthError
        return next(new AuthError('Token de autenticación inválido.'));
    }
};
