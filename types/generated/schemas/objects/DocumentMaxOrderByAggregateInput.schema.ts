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
export const DocumentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.DocumentMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentMaxOrderByAggregateInput>;
export const DocumentMaxOrderByAggregateInputObjectZodSchema = makeSchema();
