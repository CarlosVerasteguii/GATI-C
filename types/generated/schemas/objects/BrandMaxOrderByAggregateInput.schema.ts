import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const BrandMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BrandMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandMaxOrderByAggregateInput>;
export const BrandMaxOrderByAggregateInputObjectZodSchema = makeSchema();
