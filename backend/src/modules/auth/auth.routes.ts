import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { container } from 'tsyringe';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

// El contenedor IoC resuelve automáticamente toda la cadena de dependencias
const authController = container.resolve(AuthController);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registra un nuevo usuario en el sistema
 * @access  Public
 */
router.post('/register', authController.handleRegister.bind(authController));

/**
 * @route   POST /api/v1/auth/login
 * @desc    Autentica un usuario existente
 * @access  Public
 */
router.post('/login', authController.handleLogin.bind(authController));

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Cierra la sesión del usuario autenticado
 * @access  Private (Requiere autenticación)
 */
router.post('/logout', protect, authController.handleLogout.bind(authController));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Obtiene el perfil del usuario autenticado
 * @access  Private (Requiere autenticación)
 */
router.get('/me', protect, authController.handleGetProfile.bind(authController));

export default router;
