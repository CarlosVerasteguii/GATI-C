import { z } from 'zod';

export const DocumentOrderByRelevanceFieldEnumSchema = z.enum(['id', 'originalFilename', 'storedUuidFilename', 'productId'])

export type DocumentOrderByRelevanceFieldEnum = z.infer<typeof DocumentOrderByRelevanceFieldEnumSchema>;