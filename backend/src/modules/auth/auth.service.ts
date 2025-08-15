import { singleton, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Prisma } from '@prisma/client';
import prisma from '../../config/prisma.js';
import { AuditService } from '../audit/audit.service.js';
import { AuthResult, RegisterUserData } from '../../types/auth.types.js';
import { ConflictError, AppError } from '../../utils/customErrors.js';

@singleton()
export class AuthService {
    private readonly prisma;
    private readonly auditService: AuditService;

    constructor(@inject(AuditService) auditService: AuditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }

    public async registerUser(userData: RegisterUserData): Promise<AuthResult> {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: userData.email },
            });

            if (existingUser) {
                throw new ConflictError('El correo electrónico ya está en uso.');
            }

            const hashedPassword = await bcrypt.hash(userData.password, 12);

            const { newUser, token } = await this.prisma.$transaction(async (tx) => {
                const createdUser = await tx.user.create({
                    data: {
                        name: userData.name,
                        email: userData.email,
                        password_hash: hashedPassword,
                    },
                });

                await this.auditService.logTransactional(tx, {
                    userId: createdUser.id,
                    action: 'USER_REGISTER_SUCCESS',
                    targetType: 'USER',
                    targetId: createdUser.id,
                    changes: { name: createdUser.name, email: createdUser.email, role: createdUser.role },
                });

                const payload = { id: createdUser.id, role: createdUser.role };
                const secret = process.env.JWT_SECRET as string;
                const generatedToken = jwt.sign(payload, secret);

                return { newUser: createdUser, token: generatedToken };
            });

            const { password_hash, ...userWithoutPassword } = newUser;
            return { user: userWithoutPassword, token };

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Por ejemplo, un error de restricción única que no sea el del email (aunque raro en este caso)
                console.error('Prisma Error:', error.code, error.meta);
                throw new AppError('Error al crear el usuario en la base de datos.', 500);
            }
            // Re-lanza el error si ya es de un tipo que queremos manejar (ej. ConflictError) o para que el controlador lo atrape.
            throw error;
        }
    }
}
