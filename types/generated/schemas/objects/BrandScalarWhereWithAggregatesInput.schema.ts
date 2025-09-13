import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

const brandscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => BrandScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BrandScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BrandScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BrandScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BrandScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const BrandScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.BrandScalarWhereWithAggregatesInput> = brandscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.BrandScalarWhereWithAggregatesInput>;
export const BrandScalarWhereWithAggregatesInputObjectZodSchema = brandscalarwherewithaggregatesinputSchema;
