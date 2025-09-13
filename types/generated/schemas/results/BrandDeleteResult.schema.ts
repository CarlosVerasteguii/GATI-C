import { z } from 'zod';
export const BrandDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  products: z.array(z.unknown())
}));