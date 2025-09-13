import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogWhereInputObjectSchema } from './TaskAuditLogWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TaskAuditLogWhereInputObjectSchema).optional(),
  some: z.lazy(() => TaskAuditLogWhereInputObjectSchema).optional(),
  none: z.lazy(() => TaskAuditLogWhereInputObjectSchema).optional()
}).strict();
export const TaskAuditLogListRelationFilterObjectSchema: z.ZodType<Prisma.TaskAuditLogListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogListRelationFilter>;
export const TaskAuditLogListRelationFilterObjectZodSchema = makeSchema();
