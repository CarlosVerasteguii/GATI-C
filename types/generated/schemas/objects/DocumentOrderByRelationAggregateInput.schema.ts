import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const DocumentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.DocumentOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentOrderByRelationAggregateInput>;
export const DocumentOrderByRelationAggregateInputObjectZodSchema = makeSchema();
