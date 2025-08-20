import { Router } from 'express';
import { container } from 'tsyringe';
import { InventoryController } from './inventory.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '@prisma/client';

const router = Router();

// Resolver IoC para el controlador
const inventoryController = container.resolve(InventoryController);

// GET /api/v1/inventory/ - Lista de productos (ruta protegida)
router.get('/', protect, inventoryController.handleGetAllProducts.bind(inventoryController));

// POST /api/v1/inventory/ - Crear producto (ruta protegida + RBAC)
router.post(
    '/',
    protect,
    authorize([UserRole.ADMINISTRADOR, UserRole.EDITOR]),
    inventoryController.handleCreateProduct.bind(inventoryController)
);

// GET /api/v1/inventory/:id - Obtener producto por ID (ruta protegida)
router.get('/:id', protect, inventoryController.handleGetProductById.bind(inventoryController));

// PUT /api/v1/inventory/:id - Actualizar producto (ruta protegida + RBAC)
router.put(
    '/:id',
    protect,
    authorize([UserRole.ADMINISTRADOR, UserRole.EDITOR]),
    inventoryController.handleUpdateProduct.bind(inventoryController)
);

// DELETE /api/v1/inventory/:id - Eliminar producto (ruta protegida + RBAC)
router.delete(
    '/:id',
    protect,
    authorize([UserRole.ADMINISTRADOR, UserRole.EDITOR]),
    inventoryController.handleDeleteProduct.bind(inventoryController)
);

export default router;
