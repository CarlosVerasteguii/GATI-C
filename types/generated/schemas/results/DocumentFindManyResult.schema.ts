import { z } from 'zod';
export const DocumentFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  originalFilename: z.string(),
  storedUuidFilename: z.string(),
  productId: z.string(),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  product: z.unknown()
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