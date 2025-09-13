import { z } from 'zod';
import { TaskAuditLogSelectObjectSchema } from './objects/TaskAuditLogSelect.schema';
import { TaskAuditLogCreateManyInputObjectSchema } from './objects/TaskAuditLogCreateManyInput.schema';

export const TaskAuditLogCreateManyAndReturnSchema = z.object({ select: TaskAuditLogSelectObjectSchema.optional(), data: z.union([ TaskAuditLogCreateManyInputObjectSchema, z.array(TaskAuditLogCreateManyInputObjectSchema) ]),  }).strict()