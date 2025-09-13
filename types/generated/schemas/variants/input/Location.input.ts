import { z } from 'zod';

// prettier-ignore
export const LocationInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    products: z.array(z.unknown())
}).strict();

export type LocationInputType = z.infer<typeof LocationInputSchema>;
