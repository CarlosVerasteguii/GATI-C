import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema'

const locationscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => LocationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional()
}).strict();
export const LocationScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.LocationScalarWhereWithAggregatesInput> = locationscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.LocationScalarWhereWithAggregatesInput>;
export const LocationScalarWhereWithAggregatesInputObjectZodSchema = locationscalarwherewithaggregatesinputSchema;
