import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TaskAuditLogOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TaskAuditLogOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogOrderByRelationAggregateInput>;
export const TaskAuditLogOrderByRelationAggregateInputObjectZodSchema = makeSchema();
