import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const pendingtaskscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PendingTaskScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PendingTaskScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PendingTaskScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PendingTaskScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PendingTaskScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  creatorId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  detailsJson: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const PendingTaskScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PendingTaskScalarWhereWithAggregatesInput> = pendingtaskscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PendingTaskScalarWhereWithAggregatesInput>;
export const PendingTaskScalarWhereWithAggregatesInputObjectZodSchema = pendingtaskscalarwherewithaggregatesinputSchema;
