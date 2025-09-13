import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogSelectObjectSchema } from './TaskAuditLogSelect.schema';
import { TaskAuditLogIncludeObjectSchema } from './TaskAuditLogInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskAuditLogSelectObjectSchema).optional(),
  include: z.lazy(() => TaskAuditLogIncludeObjectSchema).optional()
}).strict();
export const TaskAuditLogArgsObjectSchema = makeSchema();
export const TaskAuditLogArgsObjectZodSchema = makeSchema();
