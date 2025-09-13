import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { ProductListRelationFilterObjectSchema } from './ProductListRelationFilter.schema'

const locationwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => LocationWhereInputObjectSchema), z.lazy(() => LocationWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => LocationWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => LocationWhereInputObjectSchema), z.lazy(() => LocationWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  products: z.lazy(() => ProductListRelationFilterObjectSchema).optional()
}).strict();
export const LocationWhereInputObjectSchema: z.ZodType<Prisma.LocationWhereInput> = locationwhereinputSchema as unknown as z.ZodType<Prisma.LocationWhereInput>;
export const LocationWhereInputObjectZodSchema = locationwhereinputSchema;
