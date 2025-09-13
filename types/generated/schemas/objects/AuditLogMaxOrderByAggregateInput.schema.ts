import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const AuditLogMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AuditLogMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AuditLogMaxOrderByAggregateInput>;
export const AuditLogMaxOrderByAggregateInputObjectZodSchema = makeSchema();
