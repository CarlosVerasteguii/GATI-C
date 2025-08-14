import { Router } from 'express';
import { AuthController } from './auth.controller.js';

const router = Router();
const authController = new AuthController();

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
 * @desc    Cierra la sesión del usuario
 * @access  Private (requiere autenticación)
 */
router.post('/logout', authController.handleLogout.bind(authController));

/**
 * @route   GET /api/v1/auth/me
 * @desc    Obtiene el perfil del usuario autenticado
 * @access  Private (requiere autenticación)
 */
router.get('/me', authController.handleGetProfile.bind(authController));

export default router;
