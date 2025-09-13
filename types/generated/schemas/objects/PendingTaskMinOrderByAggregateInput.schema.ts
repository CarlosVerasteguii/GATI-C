import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  creatorId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const PendingTaskMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PendingTaskMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskMinOrderByAggregateInput>;
export const PendingTaskMinOrderByAggregateInputObjectZodSchema = makeSchema();
