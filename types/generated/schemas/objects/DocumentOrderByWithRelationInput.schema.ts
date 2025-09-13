import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { DocumentOrderByRelevanceInputObjectSchema } from './DocumentOrderByRelevanceInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  originalFilename: SortOrderSchema.optional(),
  storedUuidFilename: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  deletedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  _relevance: z.lazy(() => DocumentOrderByRelevanceInputObjectSchema).optional()
}).strict();
export const DocumentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.DocumentOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentOrderByWithRelationInput>;
export const DocumentOrderByWithRelationInputObjectZodSchema = makeSchema();
