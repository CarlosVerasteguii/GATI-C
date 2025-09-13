import { z } from 'zod';

// prettier-ignore
export const DocumentInputSchema = z.object({
    id: z.string(),
    originalFilename: z.string(),
    storedUuidFilename: z.string(),
    productId: z.string(),
    deletedAt: z.date().optional().nullable(),
    createdAt: z.date(),
    product: z.unknown()
}).strict();

export type DocumentInputType = z.infer<typeof DocumentInputSchema>;
