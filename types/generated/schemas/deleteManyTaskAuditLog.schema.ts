import { z } from 'zod';
import { TaskAuditLogWhereInputObjectSchema } from './objects/TaskAuditLogWhereInput.schema';

export const TaskAuditLogDeleteManySchema = z.object({ where: TaskAuditLogWhereInputObjectSchema.optional()  })