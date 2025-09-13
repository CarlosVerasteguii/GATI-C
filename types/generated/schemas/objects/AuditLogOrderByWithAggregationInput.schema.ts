import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { AuditLogCountOrderByAggregateInputObjectSchema } from './AuditLogCountOrderByAggregateInput.schema';
import { AuditLogMaxOrderByAggregateInputObjectSchema } from './AuditLogMaxOrderByAggregateInput.schema';
import { AuditLogMinOrderByAggregateInputObjectSchema } from './AuditLogMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  userId: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  changesJson: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => AuditLogCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => AuditLogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => AuditLogMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const AuditLogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.AuditLogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.AuditLogOrderByWithAggregationInput>;
export const AuditLogOrderByWithAggregationInputObjectZodSchema = makeSchema();
