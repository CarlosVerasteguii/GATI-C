import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema } from './StringFilter.schema';
import { JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { UserScalarRelationFilterObjectSchema } from './UserScalarRelationFilter.schema';
import { UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { TaskAuditLogListRelationFilterObjectSchema } from './TaskAuditLogListRelationFilter.schema'

const pendingtaskwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => PendingTaskWhereInputObjectSchema), z.lazy(() => PendingTaskWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PendingTaskWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PendingTaskWhereInputObjectSchema), z.lazy(() => PendingTaskWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  creatorId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  detailsJson: z.lazy(() => JsonFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  creator: z.union([z.lazy(() => UserScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  taskAudit: z.lazy(() => TaskAuditLogListRelationFilterObjectSchema).optional()
}).strict();
export const PendingTaskWhereInputObjectSchema: z.ZodType<Prisma.PendingTaskWhereInput> = pendingtaskwhereinputSchema as unknown as z.ZodType<Prisma.PendingTaskWhereInput>;
export const PendingTaskWhereInputObjectZodSchema = pendingtaskwhereinputSchema;
