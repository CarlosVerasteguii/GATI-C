import { z } from 'zod';

export const BrandOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name'])

export type BrandOrderByRelevanceFieldEnum = z.infer<typeof BrandOrderByRelevanceFieldEnumSchema>;