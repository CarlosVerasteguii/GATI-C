import { singleton, inject } from 'tsyringe';
import bcrypt from 'bcrypt';
import { sign, Secret, SignOptions } from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from '../../config/prisma.js';
import { AuditService } from '../audit/audit.service.js';
import { AuthResult, RegisterUserData } from '../../types/auth.types.js';
import { ConflictError } from '../../utils/customErrors.js';

@singleton()
export class AuthService {
    private readonly prisma;
    private readonly auditService: AuditService;

    constructor(@inject(AuditService) auditService: AuditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }

    public async registerUser(userData: RegisterUserData): Promise<AuthResult> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new ConflictError('El correo electrónico ya está en uso.');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const newUser = await this.prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password_hash: hashedPassword,
            },
        });

        await this.auditService.log({
            userId: newUser.id,
            action: 'USER_REGISTER_SUCCESS',
            targetType: 'USER',
            targetId: newUser.id,
            changes: { name: newUser.name, email: newUser.email, role: newUser.role }
        });

        const payload = { id: newUser.id, role: newUser.role };
        const secret: Secret = process.env.JWT_SECRET as string;
        const expiresInEnv = process.env.JWT_EXPIRES_IN ?? '24h';
        const expiresIn: Exclude<SignOptions['expiresIn'], undefined> = expiresInEnv as Exclude<SignOptions['expiresIn'], undefined>;

        const token = sign(payload, secret, { expiresIn });

        const { password_hash, ...userWithoutPassword } = newUser;

        return { user: userWithoutPassword, token };
    }
}
