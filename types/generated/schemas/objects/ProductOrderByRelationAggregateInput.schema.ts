import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ProductOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ProductOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductOrderByRelationAggregateInput>;
export const ProductOrderByRelationAggregateInputObjectZodSchema = makeSchema();
