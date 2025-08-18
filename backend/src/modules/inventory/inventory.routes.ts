import { Router } from 'express';
import { container } from 'tsyringe';
import { InventoryController } from './inventory.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

// Resolver IoC para el controlador
const inventoryController = container.resolve(InventoryController);

// GET /api/v1/inventory/ - Lista de productos (ruta protegida)
router.get('/', protect, inventoryController.handleGetAllProducts.bind(inventoryController));

export default router;


