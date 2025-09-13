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
export const AuditLogMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AuditLogMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AuditLogMinOrderByAggregateInput>;
export const AuditLogMinOrderByAggregateInputObjectZodSchema = makeSchema();
