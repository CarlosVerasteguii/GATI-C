import { User, UserRole } from '@prisma/client';
import prisma from '../../config/prisma.js';
import { singleton } from 'tsyringe';
import { AuditService } from '../audit/audit.service.js'; // Simulación de importación

export interface RegisterUserData {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
}

export interface LoginUserData {
    email: string;
    password: string;
}

export interface AuthResult {
    user: Omit<User, 'passwordHash'>;
    token: string;
}

@singleton()
export class AuthService {
    private prisma;
    private jwtSecret: string;
    private jwtExpiresIn: string;
    private auditService: AuditService; // Simulación de propiedad

    constructor() {
        this.prisma = prisma;
        this.jwtSecret = process.env.JWT_SECRET || '';

        // Implementación de seguridad "Fail-Fast"
        if (!this.jwtSecret) {
            throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables. Application cannot start.');
        }

        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
        this.auditService = new AuditService(); // Simulación de instanciación
    }

    /**
     * Registra un nuevo usuario en el sistema
     */
    async registerUser(userData: RegisterUserData): Promise<AuthResult> {
        // TODO: Implementar lógica de registro
        // 1. Validar que el email no exista
        // 2. Hashear la contraseña
        // 3. Crear el usuario en la base de datos
        // 4. Generar JWT
        // 5. LLAMADA DIRECTA Y OBLIGATORIA AL SERVICIO DE AUDITORÍA
        // 6. Retornar usuario y token

        // Simulamos que el registro fue exitoso para demostrar la trazabilidad
        const newUser = { id: 'new-user-id', name: userData.name } as User;
        const token = 'fake-token'; // Placeholder

        // LLAMADA DIRECTA Y OBLIGATORIA AL SERVICIO DE AUDITORÍA
        // Esto garantiza la "Trazabilidad Absoluta" requerida por el SRS
        await this.auditService.log({
            userId: newUser.id,
            action: 'USER_REGISTER_SUCCESS',
            targetType: 'USER',
            targetId: newUser.id,
            changes: { name: newUser.name, email: userData.email } // Datos iniciales
        });

        return { user: newUser, token };
    }

    /**
     * Autentica un usuario existente
     */
    async loginUser(loginData: LoginUserData): Promise<AuthResult> {
        // TODO: Implementar lógica de login
        // 1. Buscar usuario por email
        // 2. Verificar contraseña
        // 3. Actualizar lastLoginAt
        // 4. Generar JWT
        // 5. LLAMADA DIRECTA Y OBLIGATORIA AL SERVICIO DE AUDITORÍA
        // 6. Retornar usuario y token

        // Simulamos que el login fue exitoso para demostrar la trazabilidad
        const user = { id: 'user-id', name: 'Test User' } as User;
        const token = 'fake-token'; // Placeholder

        // LLAMADA DIRECTA Y OBLIGATORIA AL SERVICIO DE AUDITORÍA
        // Esto garantiza que cada login sea registrado sin posibilidad de fallo silencioso
        await this.auditService.log({
            userId: user.id,
            action: 'USER_LOGIN_SUCCESS',
            targetType: 'USER',
            targetId: user.id,
            changes: {} // No hay cambios en un login
        });

        return { user, token };
    }

    /**
     * Verifica si un token JWT es válido
     */
    async verifyToken(token: string): Promise<Omit<User, 'passwordHash'> | null> {
        // TODO: Implementar verificación de token
        // 1. Verificar JWT
        // 2. Buscar usuario en base de datos
        // 3. Verificar que esté activo
        // 4. Retornar usuario o null

        throw new Error('Método verifyToken no implementado aún');
    }

    /**
     * Cierra la sesión de un usuario
     */
    async logoutUser(userId: string): Promise<boolean> {
        // TODO: Implementar lógica de logout
        // 1. Opcional: Invalidar token (blacklist)
        // 2. LLAMADA DIRECTA Y OBLIGATORIA AL SERVICIO DE AUDITORÍA
        // 3. Retornar true si se procesó correctamente

        // LLAMADA DIRECTA Y OBLIGATORIA AL SERVICIO DE AUDITORÍA
        await this.auditService.log({
            userId: userId,
            action: 'USER_LOGOUT_SUCCESS',
            targetType: 'USER',
            targetId: userId,
            changes: {}
        });

        throw new Error('Método logoutUser no implementado aún');
    }

    /**
     * Obtiene el perfil de un usuario por ID
     */
    async getUserProfile(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
        // TODO: Implementar obtención de perfil
        // 1. Buscar usuario por ID
        // 2. Verificar que esté activo
        // 3. Retornar usuario sin passwordHash

        throw new Error('Método getUserProfile no implementado aún');
    }

    /**
     * Método para pruebas - No es necesario llamar a disconnect() en producción
     * ya que el singleton maneja la desconexión automáticamente
     */
    async disconnect(): Promise<void> {
        // No hacemos nada aquí ya que el singleton maneja la desconexión
        // La implementación original se ha movido al archivo config/prisma.ts
    }
}
