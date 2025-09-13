import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { LocationWhereInputObjectSchema } from './LocationWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => LocationWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => LocationWhereInputObjectSchema).optional().nullable()
}).strict();
export const LocationNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.LocationNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.LocationNullableScalarRelationFilter>;
export const LocationNullableScalarRelationFilterObjectZodSchema = makeSchema();
