import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  taskId: z.string(),
  userId: z.string(),
  event: z.string(),
  details: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const TaskAuditLogCreateManyInputObjectSchema: z.ZodType<Prisma.TaskAuditLogCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogCreateManyInput>;
export const TaskAuditLogCreateManyInputObjectZodSchema = makeSchema();
