import { z } from 'zod';
import { TaskAuditLogCreateManyInputObjectSchema } from './objects/TaskAuditLogCreateManyInput.schema';

export const TaskAuditLogCreateManySchema = z.object({ data: z.union([ TaskAuditLogCreateManyInputObjectSchema, z.array(TaskAuditLogCreateManyInputObjectSchema) ]),  })