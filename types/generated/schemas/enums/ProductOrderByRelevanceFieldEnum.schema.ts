import { z } from 'zod';

export const ProductOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name', 'serialNumber', 'description', 'condition', 'brandId', 'categoryId', 'locationId'])

export type ProductOrderByRelevanceFieldEnum = z.infer<typeof ProductOrderByRelevanceFieldEnumSchema>;