import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  serialNumber: z.literal(true).optional(),
  description: z.literal(true).optional(),
  cost: z.literal(true).optional(),
  purchaseDate: z.literal(true).optional(),
  condition: z.literal(true).optional(),
  brandId: z.literal(true).optional(),
  categoryId: z.literal(true).optional(),
  locationId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ProductMinAggregateInputObjectSchema: z.ZodType<Prisma.ProductMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductMinAggregateInputType>;
export const ProductMinAggregateInputObjectZodSchema = makeSchema();
