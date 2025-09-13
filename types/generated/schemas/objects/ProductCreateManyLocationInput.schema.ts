import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  serialNumber: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cost: z.number().optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
  condition: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ProductCreateManyLocationInputObjectSchema: z.ZodType<Prisma.ProductCreateManyLocationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateManyLocationInput>;
export const ProductCreateManyLocationInputObjectZodSchema = makeSchema();
