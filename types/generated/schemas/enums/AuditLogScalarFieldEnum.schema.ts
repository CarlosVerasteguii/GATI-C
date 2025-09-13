import { z } from 'zod';

export const AuditLogScalarFieldEnumSchema = z.enum(['id', 'userId', 'action', 'targetType', 'targetId', 'changesJson', 'createdAt'])

export type AuditLogScalarFieldEnum = z.infer<typeof AuditLogScalarFieldEnumSchema>;