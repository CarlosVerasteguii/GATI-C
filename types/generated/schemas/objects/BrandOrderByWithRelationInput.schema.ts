import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { ProductOrderByRelationAggregateInputObjectSchema } from './ProductOrderByRelationAggregateInput.schema';
import { BrandOrderByRelevanceInputObjectSchema } from './BrandOrderByRelevanceInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputObjectSchema).optional(),
  _relevance: z.lazy(() => BrandOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const BrandOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BrandOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandOrderByWithRelationInput>;
export const BrandOrderByWithRelationInputObjectZodSchema = makeSchema();
