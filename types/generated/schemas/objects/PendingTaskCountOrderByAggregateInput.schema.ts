import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  creatorId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  detailsJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const PendingTaskCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PendingTaskCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCountOrderByAggregateInput>;
export const PendingTaskCountOrderByAggregateInputObjectZodSchema = makeSchema();
