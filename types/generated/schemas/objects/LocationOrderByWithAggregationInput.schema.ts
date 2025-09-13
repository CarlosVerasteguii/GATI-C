import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { LocationCountOrderByAggregateInputObjectSchema } from './LocationCountOrderByAggregateInput.schema';
import { LocationMaxOrderByAggregateInputObjectSchema } from './LocationMaxOrderByAggregateInput.schema';
import { LocationMinOrderByAggregateInputObjectSchema } from './LocationMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  _count: z.lazy(() => LocationCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => LocationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => LocationMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const LocationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.LocationOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationOrderByWithAggregationInput>;
export const LocationOrderByWithAggregationInputObjectZodSchema = makeSchema();
