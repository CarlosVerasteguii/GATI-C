import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { container } from 'tsyringe';

const router = Router();

// El contenedor IoC resuelve automáticamente toda la cadena de dependencias
const authController = container.resolve(AuthController);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registra un nuevo usuario en el sistema
 * @access  Public
 */
router.post('/register', authController.handleRegister.bind(authController));

export default router;
