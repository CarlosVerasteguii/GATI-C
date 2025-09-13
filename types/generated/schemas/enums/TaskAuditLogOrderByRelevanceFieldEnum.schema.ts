import { z } from 'zod';

export const TaskAuditLogOrderByRelevanceFieldEnumSchema = z.enum(['id', 'taskId', 'userId', 'event', 'details'])

export type TaskAuditLogOrderByRelevanceFieldEnum = z.infer<typeof TaskAuditLogOrderByRelevanceFieldEnumSchema>;