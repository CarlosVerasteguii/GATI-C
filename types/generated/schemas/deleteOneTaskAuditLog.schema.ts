import { z } from 'zod';
import { TaskAuditLogSelectObjectSchema } from './objects/TaskAuditLogSelect.schema';
import { TaskAuditLogIncludeObjectSchema } from './objects/TaskAuditLogInclude.schema';
import { TaskAuditLogWhereUniqueInputObjectSchema } from './objects/TaskAuditLogWhereUniqueInput.schema';

export const TaskAuditLogDeleteOneSchema = z.object({ select: TaskAuditLogSelectObjectSchema.optional(), include: TaskAuditLogIncludeObjectSchema.optional(), where: TaskAuditLogWhereUniqueInputObjectSchema  })