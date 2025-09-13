import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const BrandMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BrandMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandMinOrderByAggregateInput>;
export const BrandMinOrderByAggregateInputObjectZodSchema = makeSchema();
