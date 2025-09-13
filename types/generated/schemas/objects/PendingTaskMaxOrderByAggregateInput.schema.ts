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
export const PendingTaskMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PendingTaskMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskMaxOrderByAggregateInput>;
export const PendingTaskMaxOrderByAggregateInputObjectZodSchema = makeSchema();
