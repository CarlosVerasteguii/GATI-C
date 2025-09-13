import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  event: SortOrderSchema.optional(),
  details: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const TaskAuditLogMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskAuditLogMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogMaxOrderByAggregateInput>;
export const TaskAuditLogMaxOrderByAggregateInputObjectZodSchema = makeSchema();
