import { z } from 'zod';

export const LocationOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name'])

export type LocationOrderByRelevanceFieldEnum = z.infer<typeof LocationOrderByRelevanceFieldEnumSchema>;