import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandWhereInputObjectSchema } from './BrandWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => BrandWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => BrandWhereInputObjectSchema).optional().nullable()
}).strict();
export const BrandNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.BrandNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.BrandNullableScalarRelationFilter>;
export const BrandNullableScalarRelationFilterObjectZodSchema = makeSchema();
