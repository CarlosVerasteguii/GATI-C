import { z } from 'zod';
import { TaskAuditLogSelectObjectSchema } from './objects/TaskAuditLogSelect.schema';
import { TaskAuditLogIncludeObjectSchema } from './objects/TaskAuditLogInclude.schema';
import { TaskAuditLogCreateInputObjectSchema } from './objects/TaskAuditLogCreateInput.schema';
import { TaskAuditLogUncheckedCreateInputObjectSchema } from './objects/TaskAuditLogUncheckedCreateInput.schema';

export const TaskAuditLogCreateOneSchema = z.object({ select: TaskAuditLogSelectObjectSchema.optional(), include: TaskAuditLogIncludeObjectSchema.optional(), data: z.union([TaskAuditLogCreateInputObjectSchema, TaskAuditLogUncheckedCreateInputObjectSchema])  })