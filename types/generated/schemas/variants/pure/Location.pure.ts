import { z } from 'zod';

// prettier-ignore
export const LocationModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    products: z.array(z.unknown())
}).strict();

export type LocationModelType = z.infer<typeof LocationModelSchema>;
