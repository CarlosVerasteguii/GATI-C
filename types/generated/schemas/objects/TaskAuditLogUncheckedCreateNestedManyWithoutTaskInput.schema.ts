import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogCreateWithoutTaskInputObjectSchema } from './TaskAuditLogCreateWithoutTaskInput.schema';
import { TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema } from './TaskAuditLogUncheckedCreateWithoutTaskInput.schema';
import { TaskAuditLogCreateOrConnectWithoutTaskInputObjectSchema } from './TaskAuditLogCreateOrConnectWithoutTaskInput.schema';
import { TaskAuditLogCreateManyTaskInputEnvelopeObjectSchema } from './TaskAuditLogCreateManyTaskInputEnvelope.schema';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './TaskAuditLogWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskAuditLogCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskAuditLogCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskAuditLogCreateManyTaskInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema), z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TaskAuditLogUncheckedCreateNestedManyWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogUncheckedCreateNestedManyWithoutTaskInput>;
export const TaskAuditLogUncheckedCreateNestedManyWithoutTaskInputObjectZodSchema = makeSchema();
