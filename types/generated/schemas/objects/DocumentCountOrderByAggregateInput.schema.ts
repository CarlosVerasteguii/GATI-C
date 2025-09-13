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
export const DocumentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.DocumentCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentCountOrderByAggregateInput>;
export const DocumentCountOrderByAggregateInputObjectZodSchema = makeSchema();
