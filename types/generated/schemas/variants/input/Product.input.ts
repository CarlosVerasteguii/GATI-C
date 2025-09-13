import { z } from 'zod';

// prettier-ignore
export const ProductInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    serialNumber: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    cost: z.number().optional().nullable(),
    purchaseDate: z.date().optional().nullable(),
    condition: z.string().optional().nullable(),
    brandId: z.string().optional().nullable(),
    categoryId: z.string().optional().nullable(),
    locationId: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    documents: z.array(z.unknown()),
    brand: z.unknown().optional().nullable(),
    category: z.unknown().optional().nullable(),
    location: z.unknown().optional().nullable()
}).strict();

export type ProductInputType = z.infer<typeof ProductInputSchema>;
