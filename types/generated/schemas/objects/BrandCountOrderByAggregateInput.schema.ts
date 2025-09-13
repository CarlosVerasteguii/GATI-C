import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const BrandCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BrandCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandCountOrderByAggregateInput>;
export const BrandCountOrderByAggregateInputObjectZodSchema = makeSchema();
