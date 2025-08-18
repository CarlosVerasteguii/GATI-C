import { Prisma } from '@prisma/client';
import { singleton, inject } from 'tsyringe';
import prisma from '../../config/prisma.js';
import { AuditService } from '../audit/audit.service.js';

@singleton()
export class InventoryService {
    private readonly prisma;
    private readonly auditService: AuditService;

    constructor(@inject(AuditService) auditService: AuditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }

    public async getAllProducts(): Promise<Array<Prisma.ProductGetPayload<{ include: { brand: true; category: true; location: true } }>>> {
        const products = await this.prisma.product.findMany({
            include: {
                brand: true,
                category: true,
                location: true,
            },
        });

        return products;
    }
}


