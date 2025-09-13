import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskAuditLogScalarWhereInputObjectSchema } from './TaskAuditLogScalarWhereInput.schema';
import { TaskAuditLogUpdateManyMutationInputObjectSchema } from './TaskAuditLogUpdateManyMutationInput.schema';
import { TaskAuditLogUncheckedUpdateManyWithoutTaskInputObjectSchema } from './TaskAuditLogUncheckedUpdateManyWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TaskAuditLogScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => TaskAuditLogUpdateManyMutationInputObjectSchema), z.lazy(() => TaskAuditLogUncheckedUpdateManyWithoutTaskInputObjectSchema)])
}).strict();
export const TaskAuditLogUpdateManyWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskAuditLogUpdateManyWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogUpdateManyWithWhereWithoutTaskInput>;
export const TaskAuditLogUpdateManyWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
