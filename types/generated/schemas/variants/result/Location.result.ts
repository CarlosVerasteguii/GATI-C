import { z } from 'zod';

// prettier-ignore
export const LocationResultSchema = z.object({
    id: z.string(),
    name: z.string(),
    products: z.array(z.unknown())
}).strict();

export type LocationResultType = z.infer<typeof LocationResultSchema>;
