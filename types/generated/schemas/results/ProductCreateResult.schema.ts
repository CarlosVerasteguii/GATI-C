import { z } from 'zod';
export const ProductCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  serialNumber: z.string().optional(),
  description: z.string().optional(),
  cost: z.number().optional(),
  purchaseDate: z.date().optional(),
  condition: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  locationId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  documents: z.array(z.unknown()),
  brand: z.unknown().optional(),
  category: z.unknown().optional(),
  location: z.unknown().optional()
});