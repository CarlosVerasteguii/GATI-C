import { z } from 'zod';
export const BrandFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  products: z.array(z.unknown())
}));