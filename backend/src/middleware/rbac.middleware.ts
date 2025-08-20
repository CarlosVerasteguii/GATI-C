import { Request, Response, NextFunction } from 'express';
import { AuthorizationError } from '../utils/customErrors.js';
import { UserRole, User } from '@prisma/client';

type SafeUser = Omit<User, 'password_hash'>;

export function authorize(allowedRoles: UserRole[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const currentUser = req.user as SafeUser | undefined;

        if (!currentUser || !currentUser.role) {
            return next(new AuthorizationError('No tienes permiso para realizar esta acción.'));
        }

        if (!allowedRoles.includes(currentUser.role)) {
            return next(new AuthorizationError('No tienes permiso para realizar esta acción.'));
        }

        return next();
    };
}


