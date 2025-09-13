import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const LocationMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LocationMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationMinOrderByAggregateInput>;
export const LocationMinOrderByAggregateInputObjectZodSchema = makeSchema();
