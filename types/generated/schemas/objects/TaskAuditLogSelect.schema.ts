import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskArgsObjectSchema } from './PendingTaskArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  taskId: z.boolean().optional(),
  userId: z.boolean().optional(),
  event: z.boolean().optional(),
  details: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  task: z.union([z.boolean(), z.lazy(() => PendingTaskArgsObjectSchema)]).optional()
}).strict();
export const TaskAuditLogSelectObjectSchema: z.ZodType<Prisma.TaskAuditLogSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogSelect>;
export const TaskAuditLogSelectObjectZodSchema = makeSchema();
