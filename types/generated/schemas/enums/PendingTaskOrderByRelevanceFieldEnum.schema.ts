import { z } from 'zod';

export const PendingTaskOrderByRelevanceFieldEnumSchema = z.enum(['id', 'creatorId', 'type', 'status'])

export type PendingTaskOrderByRelevanceFieldEnum = z.infer<typeof PendingTaskOrderByRelevanceFieldEnumSchema>;