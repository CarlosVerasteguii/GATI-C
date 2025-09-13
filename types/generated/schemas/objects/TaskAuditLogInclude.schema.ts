import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskArgsObjectSchema } from './PendingTaskArgs.schema'

const makeSchema = () => z.object({
  task: z.union([z.boolean(), z.lazy(() => PendingTaskArgsObjectSchema)]).optional()
}).strict();
export const TaskAuditLogIncludeObjectSchema: z.ZodType<Prisma.TaskAuditLogInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogInclude>;
export const TaskAuditLogIncludeObjectZodSchema = makeSchema();
