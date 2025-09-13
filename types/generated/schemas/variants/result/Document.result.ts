import { z } from 'zod';

// prettier-ignore
export const DocumentResultSchema = z.object({
    id: z.string(),
    originalFilename: z.string(),
    storedUuidFilename: z.string(),
    productId: z.string(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    product: z.unknown()
}).strict();

export type DocumentResultType = z.infer<typeof DocumentResultSchema>;
