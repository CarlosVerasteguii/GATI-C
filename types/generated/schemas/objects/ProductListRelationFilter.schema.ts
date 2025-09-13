import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  some: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  none: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductListRelationFilterObjectSchema: z.ZodType<Prisma.ProductListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductListRelationFilter>;
export const ProductListRelationFilterObjectZodSchema = makeSchema();
