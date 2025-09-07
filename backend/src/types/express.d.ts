import { User } from '@prisma/client';

// Para evitar conflictos de importación/exportación, usamos esta sintaxis
export { };

declare global {
    namespace Express {
        interface Request {
            // El usuario adjunto será el objeto completo de Prisma, sin el hash.
            user?: Omit<User, 'passwordHash'>;
        }
    }
}
