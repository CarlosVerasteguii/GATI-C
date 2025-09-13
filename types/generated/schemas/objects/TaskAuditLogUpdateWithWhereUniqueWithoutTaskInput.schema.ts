import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './TaskAuditLogWhereUniqueInput.schema';
import { TaskAuditLogUpdateWithoutTaskInputObjectSchema } from './TaskAuditLogUpdateWithoutTaskInput.schema';
import { TaskAuditLogUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskAuditLogUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TaskAuditLogUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskAuditLogUpdateWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskAuditLogUpdateWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogUpdateWithWhereUniqueWithoutTaskInput>;
export const TaskAuditLogUpdateWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
