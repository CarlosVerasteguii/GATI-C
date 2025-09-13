import { z } from 'zod';

export const CategoryOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name'])

export type CategoryOrderByRelevanceFieldEnum = z.infer<typeof CategoryOrderByRelevanceFieldEnumSchema>;