import { z } from 'zod';
export const LocationUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  products: z.array(z.unknown())
}));