import { z } from 'zod';
import { TaskAuditLogSelectObjectSchema } from './objects/TaskAuditLogSelect.schema';
import { TaskAuditLogIncludeObjectSchema } from './objects/TaskAuditLogInclude.schema';
import { TaskAuditLogUpdateInputObjectSchema } from './objects/TaskAuditLogUpdateInput.schema';
import { TaskAuditLogUncheckedUpdateInputObjectSchema } from './objects/TaskAuditLogUncheckedUpdateInput.schema';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './objects/TaskAuditLogWhereUniqueInput.schema';

export const TaskAuditLogUpdateOneSchema = z.object({ select: TaskAuditLogSelectObjectSchema.optional(), include: TaskAuditLogIncludeObjectSchema.optional(), data: z.union([TaskAuditLogUpdateInputObjectSchema, TaskAuditLogUncheckedUpdateInputObjectSchema]), where: TaskAuditLogWhereUniqueInputObjectSchema  })