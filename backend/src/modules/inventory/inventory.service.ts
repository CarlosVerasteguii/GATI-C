import { Prisma } from '@prisma/client';
import { singleton, inject } from 'tsyringe';
import prisma from '../../config/prisma.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateProductData, UpdateProductData } from './inventory.types.js';
import { AppError, NotFoundError } from '../../utils/customErrors.js';

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

    public async createProduct(
        productData: CreateProductData,
        userId: string
    ): Promise<Prisma.ProductGetPayload<{ include: { brand: true; category: true; location: true } }>> {
        try {
            const data: Prisma.ProductUncheckedCreateInput = {
                name: productData.name,
                ...(productData.serial_number ? { serial_number: productData.serial_number } : {}),
                ...(productData.description ? { description: productData.description } : {}),
                ...(productData.cost !== undefined && productData.cost !== null ? { cost: productData.cost } : {}),
                ...(productData.purchase_date ? { purchase_date: new Date(productData.purchase_date) } : {}),
                ...(productData.condition ? { condition: productData.condition } : {}),
                ...(productData.brandId ? { brandId: productData.brandId } : {}),
                ...(productData.categoryId ? { categoryId: productData.categoryId } : {}),
                ...(productData.locationId ? { locationId: productData.locationId } : {}),
            };

            const created = await this.prisma.product.create({
                data,
                include: { brand: true, category: true, location: true },
            });

            // Auditoría de mejor esfuerzo (no bloqueante)
            this.auditService
                .log({
                    userId,
                    action: 'PRODUCT_CREATED',
                    targetType: 'PRODUCT',
                    targetId: created.id,
                    changes: created,
                })
                .catch((err) => {
                    console.error('Error al registrar auditoría de creación de producto:', err);
                });

            return created;
        } catch (error: any) {
            if (error?.code) {
                // Prisma error u otros con código
                console.error('Prisma Error en Creación de Producto:', { code: error.code, meta: error.meta });
            } else {
                console.error('Error Inesperado en Creación de Producto:', error);
            }
            throw new AppError('No se pudo crear el producto en la base de datos.', 500);
        }
    }

    public async updateProduct(
        productId: string,
        productData: UpdateProductData,
        userId: string
    ): Promise<Prisma.ProductGetPayload<{ include: { brand: true; category: true; location: true } }>> {
        try {
            // Validar existencia (obtener estado completo del producto antes de actualizar)
            const existing = await this.prisma.product.findUniqueOrThrow({
                where: { id: productId },
                include: { brand: true, category: true, location: true },
            });

            // Construir objeto de actualización solo con campos presentes
            const data: Prisma.ProductUncheckedUpdateInput = {
                ...(productData.name !== undefined ? { name: productData.name } : {}),
                ...(productData.serial_number !== undefined ? { serial_number: productData.serial_number ?? null } : {}),
                ...(productData.description !== undefined ? { description: productData.description ?? null } : {}),
                ...(productData.cost !== undefined ? { cost: productData.cost ?? null } : {}),
                ...(productData.purchase_date !== undefined
                    ? { purchase_date: productData.purchase_date ? new Date(productData.purchase_date) : null }
                    : {}),
                ...(productData.condition !== undefined ? { condition: productData.condition ?? null } : {}),
                ...(productData.brandId !== undefined ? { brandId: productData.brandId ?? null } : {}),
                ...(productData.categoryId !== undefined ? { categoryId: productData.categoryId ?? null } : {}),
                ...(productData.locationId !== undefined ? { locationId: productData.locationId ?? null } : {}),
            };

            const updated = await this.prisma.product.update({
                where: { id: existing.id },
                data,
                include: { brand: true, category: true, location: true },
            });

            // Auditoría de mejor esfuerzo (no bloqueante)
            this.auditService
                .log({
                    userId,
                    action: 'PRODUCT_UPDATED',
                    targetType: 'PRODUCT',
                    targetId: updated.id,
                    changes: { before: existing, after: updated },
                })
                .catch((err) => {
                    console.error('Error al registrar auditoría de actualización de producto:', err);
                });

            return updated;
        } catch (error: any) {
            // Mapear errores de Prisma a nuestro error 404 de dominio
            if ((error as any)?.name === 'NotFoundError') {
                throw new NotFoundError('El producto que intenta actualizar no existe.');
            }
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError('El producto que intenta actualizar no existe.');
            }
            // Dejar que otros errores se propaguen al manejador global
            throw error;
        }
    }
}


