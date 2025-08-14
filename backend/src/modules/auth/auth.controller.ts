import { Request, Response } from 'express';
import { AuthService, RegisterUserData, LoginUserData } from './auth.service.js';
import { ZodError } from 'zod';
import { singleton, inject } from 'tsyringe';

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
    async handleRegister(req: Request, res: Response): Promise<void> {
        try {
            // TODO: Implementar validación de entrada con Zod
            const userData: RegisterUserData = req.body;

            // TODO: Validar datos de entrada
            // TODO: Llamar al servicio de autenticación
            // TODO: Retornar respuesta exitosa con cookie JWT

            res.status(501).json({
                success: false,
                error: {
                    code: 'NOT_IMPLEMENTED',
                    message: 'Endpoint de registro no implementado aún'
                }
            });
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Datos de entrada inválidos',
                        details: error.errors
                    }
                });
            } else {
                console.error('Error en registro:', error);
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: 'Error interno del servidor'
                    }
                });
            }
        }
    }

    /**
     * Maneja la autenticación de usuarios
     * POST /api/v1/auth/login
     */
    async handleLogin(req: Request, res: Response): Promise<void> {
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
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Datos de entrada inválidos',
                        details: error.errors
                    }
                });
            } else {
                console.error('Error en login:', error);
                res.status(500).json({
                    success: false,
                    error: {
                        code: 'INTERNAL_ERROR',
                        message: 'Error interno del servidor'
                    }
                });
            }
        }
    }

    /**
     * Maneja el cierre de sesión
     * POST /api/v1/auth/logout
     */
    async handleLogout(req: Request, res: Response): Promise<void> {
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
            console.error('Error en logout:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Error interno del servidor'
                }
            });
        }
    }

    /**
     * Obtiene el perfil del usuario autenticado
     * GET /api/v1/auth/me
     */
    async handleGetProfile(req: Request, res: Response): Promise<void> {
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
            console.error('Error obteniendo perfil:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Error interno del servidor'
                }
            });
        }
    }
}
