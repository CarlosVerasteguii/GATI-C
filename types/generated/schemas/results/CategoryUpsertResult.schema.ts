import { z } from 'zod';
export const CategoryUpsertResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  products: z.array(z.unknown())
});