import { Request, Response, NextFunction } from 'express';
import { singleton, injectable, inject } from 'tsyringe';
import { z, ZodError } from 'zod';
import { AuthService } from './auth.service.js';
import { AUTH_CONSTANTS } from '../../config/constants.js';
import { ValidationError } from '../../utils/customErrors.js';

const registerSchema = z.object({
    name: z.string().min(1, { message: "El nombre es requerido." }),
    email: z.string().email({ message: "El formato del correo es inválido." }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

const loginSchema = z.object({
    email: z.string().email({ message: "El formato del correo es inválido." }),
    password: z.string().min(1, { message: "La contraseña es requerida." }),
});

@injectable()
export class AuthController {
    constructor(@inject(AuthService) private readonly authService: AuthService) { }

    public async handleRegister(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const validatedData = registerSchema.parse(req.body);
            const result = await this.authService.registerUser(validatedData);

            res.cookie(AUTH_CONSTANTS.AUTH_COOKIE_NAME, result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 horas
            });

            return res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente.',
                data: result.user,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                // Si es un error de Zod, lo convertimos en nuestro ValidationError personalizado.
                return next(new ValidationError('Los datos de registro son inválidos.', error.errors));
            }
            // Pasamos cualquier otro error a nuestro manejador global.
            next(error);
        }
    }

    public async handleLogin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await this.authService.loginUser(validatedData);

            res.cookie(AUTH_CONSTANTS.AUTH_COOKIE_NAME, result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 24 horas
            });

            return res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso.',
                data: result.user,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                // Si es un error de Zod, lo convertimos en nuestro ValidationError personalizado.
                return next(new ValidationError('Los datos de inicio de sesión son inválidos.', error.errors));
            }
            // Pasamos cualquier otro error a nuestro manejador global.
            next(error);
        }
    }

    public async handleLogout(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userId = (req.user as any)?.id;
            await this.authService.logoutUser(userId);

            // Limpiar la cookie JWT del cliente
            res.clearCookie(AUTH_CONSTANTS.AUTH_COOKIE_NAME, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            return res.status(200).json({
                success: true,
                message: 'Sesión cerrada exitosamente.'
            });
        } catch (error) {
            next(error);
        }
    }

    public async handleGetProfile(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userId = (req.user as any)?.id;
            const userProfile = await this.authService.getUserProfile(userId);

            return res.status(200).json({
                success: true,
                data: userProfile
            });
        } catch (error) {
            next(error);
        }
    }
}
