import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional()
}).strict();
export const LocationCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.LocationCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationCountOrderByAggregateInput>;
export const LocationCountOrderByAggregateInputObjectZodSchema = makeSchema();
