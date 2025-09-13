import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  userId: z.string(),
  event: z.string(),
  details: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskAuditLogUncheckedCreateWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogUncheckedCreateWithoutTaskInput>;
export const TaskAuditLogUncheckedCreateWithoutTaskInputObjectZodSchema = makeSchema();
