import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { AUTH_CONSTANTS } from '../config/constants.js';
import { AuthError } from '../utils/customErrors.js';
import prisma from '../config/prisma.js';

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

        // Extraer el id de usuario del token (preferimos `sub` establecido al firmar el JWT)
        const userId = (payload.sub as string) ?? (payload as any)?.id;
        if (!userId) {
            throw new AuthError('Token de autenticación inválido.');
        }

        // Consultar el usuario más reciente desde la base de datos
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.isActive) {
            throw new AuthError('Token de autenticación inválido.');
        }

        const { password_hash, ...safeUser } = user;
        // Adjuntar el objeto de usuario completo (sin hash) a la request
        req.user = safeUser;
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
