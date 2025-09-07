import { singleton, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { Prisma, User, UserRole } from '@prisma/client';
import prisma from '../../config/prisma.js';
import { AuditService } from '../audit/audit.service.js';
import { AuthResult, LoginUserData, RegisterUserData } from '../../types/auth.types.js';
import { AppError, AuthError, ConflictError, NotFoundError } from '../../utils/customErrors.js';

@singleton()
export class AuthService {
    private readonly prisma;
    private readonly auditService: AuditService;
    private readonly jwtSecret: Uint8Array;

    constructor(@inject(AuditService) auditService: AuditService) {
        this.prisma = prisma;
        this.auditService = auditService;

        if (!process.env.JWT_SECRET) {
            throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
        }
        this.jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);
    }

    private async generateToken(user: User): Promise<string> {
        const payload = { id: user.id, role: user.role };
        const expirationTime = process.env.JWT_EXPIRES_IN || '24h';

        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setSubject(user.id)
            .setExpirationTime(expirationTime)
            .sign(this.jwtSecret);
    }

    public async registerUser(userData: RegisterUserData): Promise<AuthResult> {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 12);

            // Operación atómica: crear usuario directamente sin verificación previa
            const newUser = await this.prisma.user.create({
                data: {
                    name: userData.name,
                    email: userData.email,
                    passwordHash: hashedPassword,
                    role: UserRole.READER // Rol por defecto explícito
                },
            });

            // Operación de auditoría como "mejor esfuerzo"
            try {
                await this.auditService.logNonTransactional({
                    userId: newUser.id,
                    action: 'USER_REGISTER_SUCCESS',
                    targetType: 'USER',
                    targetId: newUser.id,
                    changes: { name: newUser.name, email: newUser.email, role: newUser.role },
                });
            } catch (auditError) {
                console.error('Error al registrar auditoría de registro de usuario:', auditError);
                // El error en la auditoría no afecta la operación principal
            }

            const token = await this.generateToken(newUser);
            const { passwordHash, ...userWithoutPassword } = newUser;
            return { user: userWithoutPassword, token };

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // Captura la violación de la restricción única (email ya existe)
                if (error.code === 'P2002') {
                    throw new ConflictError('El correo electrónico ya está en uso.');
                }
                // Para otros errores de Prisma, lanzar error genérico
                console.error('Prisma Error en Registro:', { code: error.code, meta: error.meta });
                throw new AppError('Error al procesar la solicitud en la base de datos.', 500);
            }
            // Para cualquier otro error inesperado
            console.error('Error Inesperado en Registro:', error);
            throw new AppError('Ha ocurrido un error interno inesperado.', 500);
        }
    }

    public async loginUser(loginData: LoginUserData): Promise<AuthResult> {
        const user = await this.prisma.user.findUnique({
            where: { email: loginData.email },
        });

        // (El bypass de desarrollo con usuarios mock ha sido removido.
        //  El entorno de desarrollo debe usar datos reales mediante un script de seeding.)

        // MITIGACIÓN DE TIMING ATTACK
        const fakeHash = '$2b$12$Ea.2n.e.e.A9.E8.E.E.E.E.E.E.E.E.E.E.E.E.E.E.E.E.E.';
        const hashToCompare = user ? user.passwordHash : fakeHash;
        const isPasswordValid = await bcrypt.compare(loginData.password, hashToCompare);

        // Verificación unificada
        if (!user || !user.isActive || !isPasswordValid) {
            // La auditoría de intento fallido es de "mejor esfuerzo"
            if (user) {
                this.auditService.logNonTransactional({
                    userId: user.id,
                    action: 'USER_LOGIN_FAILURE',
                    targetType: 'USER',
                    targetId: user.id,
                    changes: { reason: !isPasswordValid ? 'Invalid password' : 'Inactive account' }
                }).catch(console.error);
            }
            throw new AuthError('Credenciales inválidas.');
        }

        // Actualización y auditoría de éxito en transacción
        await this.prisma.$transaction(async (tx) => {
            // Paso 1: Actualizar el usuario
            await tx.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });

            // Paso 2: Registrar la auditoría DENTRO de la misma transacción
            await this.auditService.logTransactional(tx, {
                userId: user.id,
                action: 'USER_LOGIN_SUCCESS',
                targetType: 'USER',
                targetId: user.id,
                changes: { lastLoginAt: new Date() }
            });
        });

        const token = await this.generateToken(user);

        const { passwordHash, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }

    public async logoutUser(userId: string): Promise<{ success: boolean }> {
        // Operación de auditoría como "mejor esfuerzo"
        try {
            await this.auditService.logNonTransactional({
                userId,
                action: 'USER_LOGOUT_SUCCESS',
                targetType: 'USER',
                targetId: userId,
                changes: { logoutAt: new Date() }
            });
        } catch (auditError) {
            console.error('Best-effort audit logging failed for USER_LOGOUT_SUCCESS:', auditError);
            // El error en la auditoría no afecta la operación principal
        }

        return { success: true };
    }

    public async getUserProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new NotFoundError('Usuario no encontrado.');
        }

        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
