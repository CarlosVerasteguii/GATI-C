import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProductScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductScalarRelationFilter>;
export const ProductScalarRelationFilterObjectZodSchema = makeSchema();
