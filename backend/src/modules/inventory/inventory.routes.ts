import { Router } from 'express';
import { container } from 'tsyringe';
import { InventoryController } from './inventory.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = Router();

// Resolver IoC para el controlador
const inventoryController = container.resolve(InventoryController);

// GET /api/v1/inventory/ - Lista de productos (ruta protegida)
router.get('/', protect, inventoryController.handleGetAllProducts.bind(inventoryController));

// POST /api/v1/inventory/ - Crear producto (ruta protegida)
router.post('/', protect, inventoryController.handleCreateProduct.bind(inventoryController));

// GET /api/v1/inventory/:id - Obtener producto por ID (ruta protegida)
router.get('/:id', protect, inventoryController.handleGetProductById.bind(inventoryController));

// PUT /api/v1/inventory/:id - Actualizar producto (ruta protegida)
router.put('/:id', protect, inventoryController.handleUpdateProduct.bind(inventoryController));

// DELETE /api/v1/inventory/:id - Eliminar producto (ruta protegida)
router.delete('/:id', protect, inventoryController.handleDeleteProduct.bind(inventoryController));

export default router;


