import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const taskauditlogscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskAuditLogScalarWhereInputObjectSchema), z.lazy(() => TaskAuditLogScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskAuditLogScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskAuditLogScalarWhereInputObjectSchema), z.lazy(() => TaskAuditLogScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  userId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  event: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  details: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskAuditLogScalarWhereInputObjectSchema: z.ZodType<Prisma.TaskAuditLogScalarWhereInput> = taskauditlogscalarwhereinputSchema as unknown as z.ZodType<Prisma.TaskAuditLogScalarWhereInput>;
export const TaskAuditLogScalarWhereInputObjectZodSchema = taskauditlogscalarwhereinputSchema;
