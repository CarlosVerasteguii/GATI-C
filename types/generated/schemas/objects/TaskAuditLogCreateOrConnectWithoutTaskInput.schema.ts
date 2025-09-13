import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './TaskAuditLogWhereUniqueInput.schema';
import { TaskAuditLogCreateWithoutTaskInputObjectSchema } from './TaskAuditLogCreateWithoutTaskInput.schema';
import { TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema } from './TaskAuditLogUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TaskAuditLogCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const TaskAuditLogCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskAuditLogCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogCreateOrConnectWithoutTaskInput>;
export const TaskAuditLogCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
