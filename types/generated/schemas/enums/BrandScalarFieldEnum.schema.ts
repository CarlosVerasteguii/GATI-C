import { z } from 'zod';

export const BrandScalarFieldEnumSchema = z.enum(['id', 'name'])

export type BrandScalarFieldEnum = z.infer<typeof BrandScalarFieldEnumSchema>;