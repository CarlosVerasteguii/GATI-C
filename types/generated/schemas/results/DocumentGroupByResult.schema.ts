import { z } from 'zod';
export const DocumentGroupByResultSchema = z.array(z.object({
  id: z.string(),
  originalFilename: z.string(),
  storedUuidFilename: z.string(),
  productId: z.string(),
  deletedAt: z.date(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    originalFilename: z.number(),
    storedUuidFilename: z.number(),
    productId: z.number(),
    deletedAt: z.number(),
    createdAt: z.number(),
    product: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    originalFilename: z.string().nullable(),
    storedUuidFilename: z.string().nullable(),
    productId: z.string().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    originalFilename: z.string().nullable(),
    storedUuidFilename: z.string().nullable(),
    productId: z.string().nullable(),
    deletedAt: z.date().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));