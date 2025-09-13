import { z } from 'zod';
export const DocumentCreateResultSchema = z.object({
  id: z.string(),
  originalFilename: z.string(),
  storedUuidFilename: z.string(),
  productId: z.string(),
  deletedAt: z.date().optional(),
  createdAt: z.date(),
  product: z.unknown()
});