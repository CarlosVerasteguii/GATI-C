import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const PendingTaskOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.PendingTaskOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskOrderByRelationAggregateInput>;
export const PendingTaskOrderByRelationAggregateInputObjectZodSchema = makeSchema();
