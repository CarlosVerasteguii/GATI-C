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
            const hashedPassword = await bcrypt.hash(userData.password, 12);

            // La transacción ahora envuelve TODA la lógica, incluida la verificación.
            const { newUser, token } = await this.prisma.$transaction(async (tx) => {
                // 1. VERIFICAR USUARIO EXISTENTE DENTRO DE LA TRANSACCIÓN
                // Esto previene condiciones de carrera. La base de datos bloquea la tabla apropiadamente.
                const existingUser = await tx.user.findUnique({
                    where: { email: userData.email },
                });

                if (existingUser) {
                    throw new ConflictError('El correo electrónico ya está en uso.');
                }

                // 2. Crear el usuario
                const createdUser = await tx.user.create({
                    data: {
                        name: userData.name,
                        email: userData.email,
                        password_hash: hashedPassword,
                    },
                });

                // 3. Crear el log de auditoría
                await this.auditService.logTransactional(tx, {
                    userId: createdUser.id,
                    action: 'USER_REGISTER_SUCCESS',
                    targetType: 'USER',
                    targetId: createdUser.id,
                    changes: { name: createdUser.name, email: createdUser.email, role: createdUser.role },
                });

                // 4. Generar el token JWT CON EXPIRACIÓN
                const payload = { id: createdUser.id, role: createdUser.role };
                const secret = process.env.JWT_SECRET!;
                const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

                // Usar una aproximación compatible con tipos estrictos
                let generatedToken: string;
                if (expiresIn === '24h') {
                    generatedToken = jwt.sign(payload, secret, { expiresIn: '24h' });
                } else {
                    generatedToken = jwt.sign(payload, secret, { expiresIn: expiresIn as any });
                }

                return { newUser: createdUser, token: generatedToken };
            });

            const { password_hash, ...userWithoutPassword } = newUser;
            return { user: userWithoutPassword, token };

        } catch (error) {
            // Si el error ya es uno de nuestros errores de aplicación, lo relanzamos.
            if (error instanceof AppError) {
                throw error;
            }

            // Si es un error de Prisma, lo envolvemos en un error de aplicación genérico.
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma Error en Registro:', { code: error.code, meta: error.meta });
                throw new AppError('Error al procesar la solicitud en la base de datos.', 500);
            }

            // Para cualquier otro error inesperado, ocultamos los detalles.
            console.error('Error Inesperado en Registro:', error);
            throw new AppError('Ha ocurrido un error interno inesperado.', 500);
        }
    }
}
