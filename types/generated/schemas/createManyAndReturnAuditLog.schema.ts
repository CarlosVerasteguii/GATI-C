import { z } from 'zod';
import { AuditLogSelectObjectSchema } from './objects/AuditLogSelect.schema';
import { AuditLogCreateManyInputObjectSchema } from './objects/AuditLogCreateManyInput.schema';

export const AuditLogCreateManyAndReturnSchema = z.object({ select: AuditLogSelectObjectSchema.optional(), data: z.union([ AuditLogCreateManyInputObjectSchema, z.array(AuditLogCreateManyInputObjectSchema) ]),  }).strict()