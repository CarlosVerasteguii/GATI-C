import { z } from 'zod';
export const ProductFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});