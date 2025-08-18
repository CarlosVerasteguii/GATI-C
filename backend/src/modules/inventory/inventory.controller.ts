import { Request, Response, NextFunction } from 'express';
import { singleton, inject } from 'tsyringe';
import { InventoryService } from './inventory.service.js';
import { createProductSchema } from './inventory.types.js';

@singleton()
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
                return next(new Error('Usuario no autenticado.'));
            }

            const created = await this.inventoryService.createProduct(parsed, userId);
            res.status(201).json({ success: true, data: created });
        } catch (error) {
            next(error);
        }
    }
}


