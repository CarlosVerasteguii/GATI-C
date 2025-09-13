import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { ProductListRelationFilterObjectSchema } from './ProductListRelationFilter.schema'

const brandwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BrandWhereInputObjectSchema), z.lazy(() => BrandWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BrandWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BrandWhereInputObjectSchema), z.lazy(() => BrandWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  products: z.lazy(() => ProductListRelationFilterObjectSchema).optional()
}).strict();
export const BrandWhereInputObjectSchema: z.ZodType<Prisma.BrandWhereInput> = brandwhereinputSchema as unknown as z.ZodType<Prisma.BrandWhereInput>;
export const BrandWhereInputObjectZodSchema = brandwhereinputSchema;
