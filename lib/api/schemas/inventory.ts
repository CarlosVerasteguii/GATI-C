import { z } from 'zod';
import { ProductResultSchema } from '@types-generated/schemas/variants/result/Product.result';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';

// Query parameters schema for listing products
export const ListParamsSchema = z.object({
    // Text search
    q: z.string().optional(),

    // Pagination
    page: z.number().int().positive().optional(),
    pageSize: z.number().int().positive().max(100).optional(),

    // Sorting
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),

    // Filtering by relationships
    brandId: z.string().optional(),
    categoryId: z.string().optional(),
    locationId: z.string().optional(),

    // Filtering by attributes
    condition: z.string().optional(),

    // Additional filters for advanced use cases
    hasSerialNumber: z.boolean().optional(),
    minCost: z.number().min(0).optional(),
    maxCost: z.number().min(0).optional(),
    purchaseDateFrom: z.string().datetime().optional(),
    purchaseDateTo: z.string().datetime().optional(),
});

// TypeScript type inferred from the Zod schema
export type ListParams = z.infer<typeof ListParamsSchema>;

// Wire-format schema for Product as received from the API (dates as ISO strings)
export const ProductWireSchema = ProductResultSchema.extend({
    purchaseDate: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

// Envelope for list responses: { success: boolean, data: ProductWire[] }
export const ProductListResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(ProductWireSchema),
});

// Envelope for single item responses: { success: boolean, data: ProductWire }
export const ProductResponseSchema = z.object({
    success: z.boolean(),
    data: ProductWireSchema,
});

function toProductResultType(wire: z.infer<typeof ProductWireSchema>): ProductResultType {
    return {
        ...wire,
        purchaseDate: wire.purchaseDate ? new Date(wire.purchaseDate) : null,
        createdAt: new Date(wire.createdAt),
        updatedAt: new Date(wire.updatedAt),
    } as ProductResultType;
}

export function parseAndTransformProducts(payload: unknown): ProductResultType[] {
    const parsed = ProductListResponseSchema.parse(payload);
    return parsed.data.map(toProductResultType);
}

export function parseAndTransformProduct(payload: unknown): ProductResultType {
    const parsed = ProductResponseSchema.parse(payload);
    return toProductResultType(parsed.data);
}


// Create Product (client-side input) schema to centralize validation contracts
export const CreateProductSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    serialNumber: z.string().optional().or(z.literal('')),
    brandId: z.string().min(1, 'Selecciona una marca'),
    categoryId: z.string().min(1, 'Selecciona una categoría'),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;


