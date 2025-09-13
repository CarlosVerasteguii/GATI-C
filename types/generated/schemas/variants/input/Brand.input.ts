import { z } from 'zod';

// prettier-ignore
export const BrandInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    products: z.array(z.unknown())
}).strict();

export type BrandInputType = z.infer<typeof BrandInputSchema>;
