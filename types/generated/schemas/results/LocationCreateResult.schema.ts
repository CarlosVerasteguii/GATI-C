import { z } from 'zod';
export const LocationCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  products: z.array(z.unknown())
});