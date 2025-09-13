import { z } from 'zod';

export const TaskAuditLogScalarFieldEnumSchema = z.enum(['id', 'taskId', 'userId', 'event', 'details', 'createdAt'])

export type TaskAuditLogScalarFieldEnum = z.infer<typeof TaskAuditLogScalarFieldEnumSchema>;