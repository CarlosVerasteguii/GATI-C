import { z } from 'zod';

export const AuditLogOrderByRelevanceFieldEnumSchema = z.enum(['id', 'userId', 'action', 'targetType', 'targetId'])

export type AuditLogOrderByRelevanceFieldEnum = z.infer<typeof AuditLogOrderByRelevanceFieldEnumSchema>;