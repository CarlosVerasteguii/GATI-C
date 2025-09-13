import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const taskauditlogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskAuditLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskAuditLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskAuditLogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskAuditLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskAuditLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  event: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  details: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskAuditLogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TaskAuditLogScalarWhereWithAggregatesInput> = taskauditlogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TaskAuditLogScalarWhereWithAggregatesInput>;
export const TaskAuditLogScalarWhereWithAggregatesInputObjectZodSchema = taskauditlogscalarwherewithaggregatesinputSchema;
