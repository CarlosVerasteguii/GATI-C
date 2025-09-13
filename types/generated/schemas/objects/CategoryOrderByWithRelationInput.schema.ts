import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema';
import { CategoryOrderByRelevanceInputObjectSchema } from './CategoryOrderByRelevanceInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => CategoryOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const CategoryOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryOrderByWithRelationInput>;
export const CategoryOrderByWithRelationInputObjectZodSchema = makeSchema();
