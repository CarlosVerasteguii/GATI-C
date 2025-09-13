import { z } from 'zod';
import { TaskAuditLogSelectObjectSchema } from './objects/TaskAuditLogSelect.schema';
import { TaskAuditLogUpdateManyMutationInputObjectSchema } from './objects/TaskAuditLogUpdateManyMutationInput.schema';
import { TaskAuditLogWhereInputObjectSchema } from './objects/TaskAuditLogWhereInput.schema';

export const TaskAuditLogUpdateManyAndReturnSchema = z.object({ select: TaskAuditLogSelectObjectSchema.optional(), data: TaskAuditLogUpdateManyMutationInputObjectSchema, where: TaskAuditLogWhereInputObjectSchema.optional()  }).strict()