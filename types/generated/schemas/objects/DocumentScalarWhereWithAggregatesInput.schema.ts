import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const documentscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => DocumentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => DocumentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => DocumentScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => DocumentScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => DocumentScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  originalFilename: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  storedUuidFilename: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  deletedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const DocumentScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.DocumentScalarWhereWithAggregatesInput> = documentscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.DocumentScalarWhereWithAggregatesInput>;
export const DocumentScalarWhereWithAggregatesInputObjectZodSchema = documentscalarwherewithaggregatesinputSchema;
