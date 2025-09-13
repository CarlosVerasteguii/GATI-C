import { z } from 'zod';

// prettier-ignore
export const BrandResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    products: z.array(z.unknown())
}).strict();

export type BrandResultType = z.infer<typeof BrandResultSchema>;
