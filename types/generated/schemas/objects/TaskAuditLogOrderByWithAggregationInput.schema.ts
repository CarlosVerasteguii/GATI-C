import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TaskAuditLogCountOrderByAggregateInputObjectSchema } from './TaskAuditLogCountOrderByAggregateInput.schema';
import { TaskAuditLogMaxOrderByAggregateInputObjectSchema } from './TaskAuditLogMaxOrderByAggregateInput.schema';
import { TaskAuditLogMinOrderByAggregateInputObjectSchema } from './TaskAuditLogMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  event: SortOrderSchema.optional(),
  details: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => TaskAuditLogCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TaskAuditLogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TaskAuditLogMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TaskAuditLogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TaskAuditLogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogOrderByWithAggregationInput>;
export const TaskAuditLogOrderByWithAggregationInputObjectZodSchema = makeSchema();
