import { User, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../config/prisma.js';

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

export class AuthService {
    private prisma;
    private jwtSecret: string;
    private jwtExpiresIn: string;

    constructor() {
        this.prisma = prisma;
        this.jwtSecret = process.env.JWT_SECRET || '';

        // Implementación de seguridad "Fail-Fast"
        if (!this.jwtSecret) {
            console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
            process.exit(1); // Detiene la aplicación si el secreto no está configurado
        }

        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
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
        // 5. Retornar usuario y token

        throw new Error('Método registerUser no implementado aún');
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
        // 5. Retornar usuario y token

        throw new Error('Método loginUser no implementado aún');
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
        // 2. Retornar true si se procesó correctamente

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
