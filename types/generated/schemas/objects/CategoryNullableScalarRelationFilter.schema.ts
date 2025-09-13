import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { CategoryWhereInputObjectSchema } from './CategoryWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => CategoryWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => CategoryWhereInputObjectSchema).optional().nullable()
}).strict();
export const CategoryNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.CategoryNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.CategoryNullableScalarRelationFilter>;
export const CategoryNullableScalarRelationFilterObjectZodSchema = makeSchema();
