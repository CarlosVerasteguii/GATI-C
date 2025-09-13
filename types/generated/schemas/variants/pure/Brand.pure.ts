import { z } from 'zod';

// prettier-ignore
export const BrandModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    products: z.array(z.unknown())
}).strict();

export type BrandModelType = z.infer<typeof BrandModelSchema>;
