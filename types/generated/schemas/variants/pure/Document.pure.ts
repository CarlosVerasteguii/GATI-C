import { z } from 'zod';

// prettier-ignore
export const DocumentModelSchema = z.object({
    id: z.string(),
    originalFilename: z.string(),
    storedUuidFilename: z.string(),
    productId: z.string(),
    deletedAt: z.date().nullable(),
    createdAt: z.date(),
    product: z.unknown()
}).strict();

export type DocumentModelType = z.infer<typeof DocumentModelSchema>;
