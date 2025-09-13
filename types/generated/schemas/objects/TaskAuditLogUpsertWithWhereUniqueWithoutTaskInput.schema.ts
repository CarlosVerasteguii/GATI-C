import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './TaskAuditLogWhereUniqueInput.schema';
import { TaskAuditLogUpdateWithoutTaskInputObjectSchema } from './TaskAuditLogUpdateWithoutTaskInput.schema';
import { TaskAuditLogUncheckedUpdateWithoutTaskInputObjectSchema } from './TaskAuditLogUncheckedUpdateWithoutTaskInput.schema';
import { TaskAuditLogCreateWithoutTaskInputObjectSchema } from './TaskAuditLogCreateWithoutTaskInput.schema';
import { TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema } from './TaskAuditLogUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TaskAuditLogUpdateWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => TaskAuditLogCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskAuditLogUpsertWithWhereUniqueWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskAuditLogUpsertWithWhereUniqueWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogUpsertWithWhereUniqueWithoutTaskInput>;
export const TaskAuditLogUpsertWithWhereUniqueWithoutTaskInputObjectZodSchema = makeSchema();
