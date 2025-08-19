import { Request, Response, NextFunction } from 'express';
import { singleton, injectable, inject } from 'tsyringe';
import { ZodError } from 'zod';
import { InventoryService } from './inventory.service.js';
import { createProductSchema, updateProductSchema } from './inventory.types.js';
import { ValidationError, AuthError } from '../../utils/customErrors.js';

@injectable()
export class InventoryController {
    private readonly inventoryService: InventoryService;

    constructor(@inject(InventoryService) inventoryService: InventoryService) {
        this.inventoryService = inventoryService;
    }

    public async handleGetAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const products = await this.inventoryService.getAllProducts();
            res.status(200).json({ success: true, data: products });
        } catch (error) {
            next(error);
        }
    }

    public async handleCreateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const parsed = createProductSchema.parse(req.body);

            const userId = (req.user?.id as string) || '';
            if (!userId) {
                // Debe estar protegido por middleware, pero verificamos por seguridad
                return next(new AuthError('Usuario no autenticado.'));
            }

            const created = await this.inventoryService.createProduct(parsed, userId);
            res.status(201).json({ success: true, data: created });
        } catch (error) {
            if (error instanceof ZodError) {
                // Si es un error de Zod, lo convertimos en nuestro ValidationError personalizado.
                return next(new ValidationError('Los datos proporcionados son inválidos.', error.errors));
            }
            // Pasamos cualquier otro error a nuestro manejador global.
            next(error);
        }
    }

    public async handleUpdateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id as string;
            const parsed = updateProductSchema.parse(req.body);

            const userId = (req.user?.id as string) || '';
            if (!userId) {
                return next(new AuthError('Usuario no autenticado.'));
            }

            const updated = await this.inventoryService.updateProduct(productId, parsed, userId);
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            if (error instanceof ZodError) {
                return next(new ValidationError('Los datos proporcionados son inválidos.', error.errors));
            }
            next(error);
        }
    }
}
