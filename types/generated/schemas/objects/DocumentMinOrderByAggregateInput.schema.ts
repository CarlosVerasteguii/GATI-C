import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  originalFilename: SortOrderSchema.optional(),
  storedUuidFilename: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  deletedAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const DocumentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.DocumentMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentMinOrderByAggregateInput>;
export const DocumentMinOrderByAggregateInputObjectZodSchema = makeSchema();
