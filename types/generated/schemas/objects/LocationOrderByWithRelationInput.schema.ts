import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema';
import { LocationOrderByRelevanceInputObjectSchema } from './LocationOrderByRelevanceInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => LocationOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const LocationOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.LocationOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationOrderByWithRelationInput>;
export const LocationOrderByWithRelationInputObjectZodSchema = makeSchema();
