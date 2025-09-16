import { z } from 'zod';
import { ProductResultSchema } from '@types-generated/schemas/variants/result/Product.result';
import type { ProductResultType } from '@types-generated/schemas/variants/result/Product.result';

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


