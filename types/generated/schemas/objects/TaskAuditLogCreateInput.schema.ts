import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskCreateNestedOneWithoutTaskAuditInputObjectSchema } from './PendingTaskCreateNestedOneWithoutTaskAuditInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  userId: z.string(),
  event: z.string(),
  details: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  task: z.lazy(() => PendingTaskCreateNestedOneWithoutTaskAuditInputObjectSchema)
}).strict();
export const TaskAuditLogCreateInputObjectSchema: z.ZodType<Prisma.TaskAuditLogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogCreateInput>;
export const TaskAuditLogCreateInputObjectZodSchema = makeSchema();
