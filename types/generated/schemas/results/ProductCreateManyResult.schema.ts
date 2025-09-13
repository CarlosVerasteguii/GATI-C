import { z } from 'zod';
export const ProductCreateManyResultSchema = z.object({
  count: z.number()
});