import { z } from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id', 'name', 'serialNumber', 'description', 'cost', 'purchaseDate', 'condition', 'brandId', 'categoryId', 'locationId', 'createdAt', 'updatedAt'])

export type ProductScalarFieldEnum = z.infer<typeof ProductScalarFieldEnumSchema>;