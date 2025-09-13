import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogCreateWithoutTaskInputObjectSchema } from './TaskAuditLogCreateWithoutTaskInput.schema';
import { TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema } from './TaskAuditLogUncheckedCreateWithoutTaskInput.schema';
import { TaskAuditLogCreateOrConnectWithoutTaskInputObjectSchema } from './TaskAuditLogCreateOrConnectWithoutTaskInput.schema';
import { TaskAuditLogUpsertWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskAuditLogUpsertWithWhereUniqueWithoutTaskInput.schema';
import { TaskAuditLogCreateManyTaskInputEnvelopeObjectSchema } from './TaskAuditLogCreateManyTaskInputEnvelope.schema';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './TaskAuditLogWhereUniqueInput.schema';
import { TaskAuditLogUpdateWithWhereUniqueWithoutTaskInputObjectSchema } from './TaskAuditLogUpdateWithWhereUniqueWithoutTaskInput.schema';
import { TaskAuditLogUpdateManyWithWhereWithoutTaskInputObjectSchema } from './TaskAuditLogUpdateManyWithWhereWithoutTaskInput.schema';
import { TaskAuditLogScalarWhereInputObjectSchema } from './TaskAuditLogScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TaskAuditLogCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogCreateWithoutTaskInputObjectSchema).array(), z.lazy(() => TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogUncheckedCreateWithoutTaskInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskAuditLogCreateOrConnectWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogCreateOrConnectWithoutTaskInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskAuditLogUpsertWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogUpsertWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TaskAuditLogCreateManyTaskInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema), z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema), z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema), z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema), z.lazy(() => TaskAuditLogWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskAuditLogUpdateWithWhereUniqueWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogUpdateWithWhereUniqueWithoutTaskInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskAuditLogUpdateManyWithWhereWithoutTaskInputObjectSchema), z.lazy(() => TaskAuditLogUpdateManyWithWhereWithoutTaskInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskAuditLogScalarWhereInputObjectSchema), z.lazy(() => TaskAuditLogScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInput>;
export const TaskAuditLogUncheckedUpdateManyWithoutTaskNestedInputObjectZodSchema = makeSchema();
