import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { DocumentCountOrderByAggregateInputObjectSchema } from './DocumentCountOrderByAggregateInput.schema';
import { DocumentMaxOrderByAggregateInputObjectSchema } from './DocumentMaxOrderByAggregateInput.schema';
import { DocumentMinOrderByAggregateInputObjectSchema } from './DocumentMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  originalFilename: SortOrderSchema.optional(),
  storedUuidFilename: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  deletedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  _count: z.lazy(() => DocumentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => DocumentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => DocumentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const DocumentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.DocumentOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.DocumentOrderByWithAggregationInput>;
export const DocumentOrderByWithAggregationInputObjectZodSchema = makeSchema();
