import { Request, Response, NextFunction } from 'express';
import { AuthService, RegisterUserData, LoginUserData } from './auth.service.js';
import { ZodError, z } from 'zod';
import { singleton, inject } from 'tsyringe';

// Esquema de validación para el registro de usuarios
const registerSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('El email debe tener un formato válido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

@singleton()
export class AuthController {
    /**
     * Constructor con inyección de dependencias
     * @param authService Servicio de autenticación inyectado
     */
    constructor(@inject(AuthService) private readonly authService: AuthService) { }

    /**
     * Maneja el registro de nuevos usuarios
     * POST /api/v1/auth/register
     */
    async handleRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validar datos de entrada con Zod
            const validatedData = registerSchema.parse(req.body);

            // Por ahora, solo retornamos los datos validados para confirmar que la validación funciona
            res.status(200).json({ success: true, message: "Validation successful", data: validatedData });
        } catch (error) {
            // Simplemente pasa el error al siguiente middleware (nuestro manejador de errores global)
            next(error);
        }
    }

    /**
     * Maneja la autenticación de usuarios
     * POST /api/v1/auth/login
     */
    async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // TODO: Implementar validación de entrada con Zod
            const loginData: LoginUserData = req.body;

            // TODO: Validar datos de entrada
            // TODO: Llamar al servicio de autenticación
            // TODO: Establecer cookie JWT HttpOnly
            // TODO: Retornar respuesta exitosa

            res.status(501).json({
                success: false,
                error: {
                    code: 'NOT_IMPLEMENTED',
                    message: 'Endpoint de login no implementado aún'
                }
            });
        } catch (error) {
            // Simplemente pasa el error al siguiente middleware (nuestro manejador de errores global)
            next(error);
        }
    }

    /**
     * Maneja el cierre de sesión
     * POST /api/v1/auth/logout
     */
    async handleLogout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // TODO: Implementar lógica de logout
            // TODO: Limpiar cookie JWT
            // TODO: Opcional: Invalidar token en blacklist
            // TODO: Retornar respuesta exitosa

            res.status(501).json({
                success: false,
                error: {
                    code: 'NOT_IMPLEMENTED',
                    message: 'Endpoint de logout no implementado aún'
                }
            });
        } catch (error) {
            // Simplemente pasa el error al siguiente middleware (nuestro manejador de errores global)
            next(error);
        }
    }

    /**
     * Obtiene el perfil del usuario autenticado
     * GET /api/v1/auth/me
     */
    async handleGetProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // TODO: Implementar obtención de perfil
            // TODO: Extraer userId del JWT en req.user (middleware)
            // TODO: Llamar al servicio para obtener perfil
            // TODO: Retornar perfil del usuario

            res.status(501).json({
                success: false,
                error: {
                    code: 'NOT_IMPLEMENTED',
                    message: 'Endpoint de perfil no implementado aún'
                }
            });
        } catch (error) {
            // Simplemente pasa el error al siguiente middleware (nuestro manejador de errores global)
            next(error);
        }
    }
}
