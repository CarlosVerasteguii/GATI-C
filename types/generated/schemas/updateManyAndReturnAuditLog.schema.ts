import { z } from 'zod';
import { AuditLogSelectObjectSchema } from './objects/AuditLogSelect.schema';
import { AuditLogUpdateManyMutationInputObjectSchema } from './objects/AuditLogUpdateManyMutationInput.schema';
import { AuditLogWhereInputObjectSchema } from './objects/AuditLogWhereInput.schema';

export const AuditLogUpdateManyAndReturnSchema = z.object({ select: AuditLogSelectObjectSchema.optional(), data: AuditLogUpdateManyMutationInputObjectSchema, where: AuditLogWhereInputObjectSchema.optional()  }).strict()