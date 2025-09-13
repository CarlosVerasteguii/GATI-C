import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  serialNumber: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  cost: SortOrderSchema.optional(),
  purchaseDate: SortOrderSchema.optional(),
  condition: SortOrderSchema.optional(),
  brandId: SortOrderSchema.optional(),
  categoryId: SortOrderSchema.optional(),
  locationId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProductMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductMinOrderByAggregateInput>;
export const ProductMinOrderByAggregateInputObjectZodSchema = makeSchema();
