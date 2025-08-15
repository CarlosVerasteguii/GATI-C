import { singleton, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import { SignJWT } from 'jose';
import { Prisma, User } from '@prisma/client';
import prisma from '../../config/prisma.js';
import { AuditService } from '../audit/audit.service.js';
import { AuthResult, LoginUserData, RegisterUserData } from '../../types/auth.types.js';
import { AppError, AuthError, ConflictError } from '../../utils/customErrors.js';

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

            const { newUser } = await this.prisma.$transaction(async (tx) => {
                const existingUser = await tx.user.findUnique({ where: { email: userData.email } });
                if (existingUser) { throw new ConflictError('El correo electrónico ya está en uso.'); }

                const createdUser = await tx.user.create({
                    data: { name: userData.name, email: userData.email, password_hash: hashedPassword },
                });

                await this.auditService.logTransactional(tx, {
                    userId: createdUser.id, action: 'USER_REGISTER_SUCCESS', targetType: 'USER',
                    targetId: createdUser.id, changes: { name: createdUser.name, email: createdUser.email, role: createdUser.role },
                });

                return { newUser: createdUser };
            });

            const token = await this.generateToken(newUser);
            const { password_hash, ...userWithoutPassword } = newUser;
            return { user: userWithoutPassword, token };

        } catch (error) {
            if (error instanceof AppError) { throw error; }
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.error('Prisma Error en Registro:', { code: error.code, meta: error.meta });
                throw new AppError('Error al procesar la solicitud en la base de datos.', 500);
            }
            console.error('Error Inesperado en Registro:', error);
            throw new AppError('Ha ocurrido un error interno inesperado.', 500);
        }
    }

    public async loginUser(loginData: LoginUserData): Promise<AuthResult> {
        const user = await this.prisma.user.findUnique({ where: { email: loginData.email } });

        const fakeHash = '$2b$12$invalidsaltinvalidhashxxxxxxxxxxxxxxxxx';
        const hashToCompare = user ? user.password_hash : fakeHash;
        const isPasswordValid = await bcrypt.compare(loginData.password, hashToCompare);

        if (!user || !user.isActive || !isPasswordValid) {
            throw new AuthError('Credenciales inválidas.');
        }

        await this.prisma.$transaction(async (tx) => {
            await tx.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
            await this.auditService.logTransactional(tx, {
                userId: user.id, action: 'USER_LOGIN_SUCCESS', targetType: 'USER',
                targetId: user.id, changes: { lastLoginAt: new Date() }
            });
        });

        const token = await this.generateToken(user);
        const { password_hash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
