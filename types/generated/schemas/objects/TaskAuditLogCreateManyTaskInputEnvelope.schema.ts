import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogCreateManyTaskInputObjectSchema } from './TaskAuditLogCreateManyTaskInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => TaskAuditLogCreateManyTaskInputObjectSchema), z.lazy(() => TaskAuditLogCreateManyTaskInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const TaskAuditLogCreateManyTaskInputEnvelopeObjectSchema: z.ZodType<Prisma.TaskAuditLogCreateManyTaskInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogCreateManyTaskInputEnvelope>;
export const TaskAuditLogCreateManyTaskInputEnvelopeObjectZodSchema = makeSchema();
