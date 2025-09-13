import { z } from 'zod';
export const CategoryCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  products: z.array(z.unknown())
});