import { z } from 'zod';

// prettier-ignore
export const ProductModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    serialNumber: z.string().nullable(),
    description: z.string().nullable(),
    cost: z.number().nullable(),
    purchaseDate: z.date().nullable(),
    condition: z.string().nullable(),
    brandId: z.string().nullable(),
    categoryId: z.string().nullable(),
    locationId: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    documents: z.array(z.unknown()),
    brand: z.unknown().nullable(),
    category: z.unknown().nullable(),
    location: z.unknown().nullable()
}).strict();

export type ProductModelType = z.infer<typeof ProductModelSchema>;
