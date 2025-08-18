import { Request, Response, NextFunction } from 'express';
import { singleton, inject } from 'tsyringe';
import { InventoryService } from './inventory.service.js';

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
}


