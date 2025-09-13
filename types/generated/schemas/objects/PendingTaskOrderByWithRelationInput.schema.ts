import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { UserOrderByWithRelationInputObjectSchema } from './UserOrderByWithRelationInput.schema';
import { TaskAuditLogOrderByRelationAggregateInputObjectSchema } from './TaskAuditLogOrderByRelationAggregateInput.schema';
import { PendingTaskOrderByRelevanceInputObjectSchema } from './PendingTaskOrderByRelevanceInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  creatorId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  detailsJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  creator: z.lazy(() => UserOrderByWithRelationInputObjectSchema).optional(),
  taskAudit: z.lazy(() => TaskAuditLogOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => PendingTaskOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const PendingTaskOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.PendingTaskOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskOrderByWithRelationInput>;
export const PendingTaskOrderByWithRelationInputObjectZodSchema = makeSchema();
