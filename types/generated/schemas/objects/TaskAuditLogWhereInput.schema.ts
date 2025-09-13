import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { PendingTaskScalarRelationFilterObjectSchema } from './PendingTaskScalarRelationFilter.schema';
import { PendingTaskWhereInputObjectSchema } from './PendingTaskWhereInput.schema'

const taskauditlogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskAuditLogWhereInputObjectSchema), z.lazy(() => TaskAuditLogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskAuditLogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskAuditLogWhereInputObjectSchema), z.lazy(() => TaskAuditLogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  event: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  details: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  task: z.union([z.lazy(() => PendingTaskScalarRelationFilterObjectSchema), z.lazy(() => PendingTaskWhereInputObjectSchema)]).optional()
}).strict();
export const TaskAuditLogWhereInputObjectSchema: z.ZodType<Prisma.TaskAuditLogWhereInput> = taskauditlogwhereinputSchema as unknown as z.ZodType<Prisma.TaskAuditLogWhereInput>;
export const TaskAuditLogWhereInputObjectZodSchema = taskauditlogwhereinputSchema;
