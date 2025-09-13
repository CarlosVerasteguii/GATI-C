import { z } from 'zod';

export const PendingTaskScalarFieldEnumSchema = z.enum(['id', 'creatorId', 'type', 'status', 'detailsJson', 'createdAt', 'updatedAt'])

export type PendingTaskScalarFieldEnum = z.infer<typeof PendingTaskScalarFieldEnumSchema>;