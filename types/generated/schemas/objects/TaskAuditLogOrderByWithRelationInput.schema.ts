import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { PendingTaskOrderByWithRelationInputObjectSchema } from './PendingTaskOrderByWithRelationInput.schema';
import { TaskAuditLogOrderByRelevanceInputObjectSchema } from './TaskAuditLogOrderByRelevanceInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  taskId: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  event: SortOrderSchema.optional(),
  details: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  task: z.lazy(() => PendingTaskOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => TaskAuditLogOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const TaskAuditLogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TaskAuditLogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogOrderByWithRelationInput>;
export const TaskAuditLogOrderByWithRelationInputObjectZodSchema = makeSchema();
