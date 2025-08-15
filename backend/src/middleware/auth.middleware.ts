import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { AUTH_CONSTANTS } from '../config/constants.js';
import { AuthError } from '../utils/customErrors.js';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies?.[AUTH_CONSTANTS.AUTH_COOKIE_NAME];
        if (!token) {
            throw new AuthError('Acceso denegado. No se proporcionó token.');
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ['HS256']
        });

        req.user = payload;
        next();
    } catch (error) {
        return next(new AuthError('Token inválido o expirado.'));
    }
};
