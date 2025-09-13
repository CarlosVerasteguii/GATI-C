import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const pendingtaskscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PendingTaskScalarWhereInputObjectSchema), z.lazy(() => PendingTaskScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PendingTaskScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PendingTaskScalarWhereInputObjectSchema), z.lazy(() => PendingTaskScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  creatorId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  detailsJson: z.lazy(() => JsonFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PendingTaskScalarWhereInputObjectSchema: z.ZodType<Prisma.PendingTaskScalarWhereInput> = pendingtaskscalarwhereinputSchema as unknown as z.ZodType<Prisma.PendingTaskScalarWhereInput>;
export const PendingTaskScalarWhereInputObjectZodSchema = pendingtaskscalarwhereinputSchema;
