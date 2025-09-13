import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const CategoryMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryMaxOrderByAggregateInput>;
export const CategoryMaxOrderByAggregateInputObjectZodSchema = makeSchema();
