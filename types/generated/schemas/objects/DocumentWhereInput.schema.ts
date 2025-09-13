import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const documentwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => DocumentWhereInputObjectSchema), z.lazy(() => DocumentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => DocumentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => DocumentWhereInputObjectSchema), z.lazy(() => DocumentWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  originalFilename: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  storedUuidFilename: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  deletedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional()
}).strict();
export const DocumentWhereInputObjectSchema: z.ZodType<Prisma.DocumentWhereInput> = documentwhereinputSchema as unknown as z.ZodType<Prisma.DocumentWhereInput>;
export const DocumentWhereInputObjectZodSchema = documentwhereinputSchema;
