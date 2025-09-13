import { z } from 'zod';
import { TaskAuditLogSelectObjectSchema } from './objects/TaskAuditLogSelect.schema';
import { TaskAuditLogIncludeObjectSchema } from './objects/TaskAuditLogInclude.schema';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './objects/TaskAuditLogWhereUniqueInput.schema';
import { TaskAuditLogCreateInputObjectSchema } from './objects/TaskAuditLogCreateInput.schema';
import { TaskAuditLogUncheckedCreateInputObjectSchema } from './objects/TaskAuditLogUncheckedCreateInput.schema';
import { TaskAuditLogUpdateInputObjectSchema } from './objects/TaskAuditLogUpdateInput.schema';
import { TaskAuditLogUncheckedUpdateInputObjectSchema } from './objects/TaskAuditLogUncheckedUpdateInput.schema';

export const TaskAuditLogUpsertSchema = z.object({ select: TaskAuditLogSelectObjectSchema.optional(), include: TaskAuditLogIncludeObjectSchema.optional(), where: TaskAuditLogWhereUniqueInputObjectSchema, create: z.union([ TaskAuditLogCreateInputObjectSchema, TaskAuditLogUncheckedCreateInputObjectSchema ]), update: z.union([ TaskAuditLogUpdateInputObjectSchema, TaskAuditLogUncheckedUpdateInputObjectSchema ])  })