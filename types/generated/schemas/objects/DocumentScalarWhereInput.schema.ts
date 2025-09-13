import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const documentscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => DocumentScalarWhereInputObjectSchema), z.lazy(() => DocumentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => DocumentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => DocumentScalarWhereInputObjectSchema), z.lazy(() => DocumentScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  originalFilename: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  storedUuidFilename: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  deletedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const DocumentScalarWhereInputObjectSchema: z.ZodType<Prisma.DocumentScalarWhereInput> = documentscalarwhereinputSchema as unknown as z.ZodType<Prisma.DocumentScalarWhereInput>;
export const DocumentScalarWhereInputObjectZodSchema = documentscalarwhereinputSchema;
