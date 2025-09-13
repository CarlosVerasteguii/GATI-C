import { z } from 'zod';
import { TaskAuditLogUpdateManyMutationInputObjectSchema } from './objects/TaskAuditLogUpdateManyMutationInput.schema';
import { TaskAuditLogWhereInputObjectSchema } from './objects/TaskAuditLogWhereInput.schema';

export const TaskAuditLogUpdateManySchema = z.object({ data: TaskAuditLogUpdateManyMutationInputObjectSchema, where: TaskAuditLogWhereInputObjectSchema.optional()  })