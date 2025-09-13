import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { PendingTaskCountOrderByAggregateInputObjectSchema } from './PendingTaskCountOrderByAggregateInput.schema';
import { PendingTaskMaxOrderByAggregateInputObjectSchema } from './PendingTaskMaxOrderByAggregateInput.schema';
import { PendingTaskMinOrderByAggregateInputObjectSchema } from './PendingTaskMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  creatorId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  detailsJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => PendingTaskCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => PendingTaskMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => PendingTaskMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const PendingTaskOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.PendingTaskOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskOrderByWithAggregationInput>;
export const PendingTaskOrderByWithAggregationInputObjectZodSchema = makeSchema();
