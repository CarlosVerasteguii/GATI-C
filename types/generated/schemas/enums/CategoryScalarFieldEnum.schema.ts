import { z } from 'zod';

export const CategoryScalarFieldEnumSchema = z.enum(['id', 'name'])

export type CategoryScalarFieldEnum = z.infer<typeof CategoryScalarFieldEnumSchema>;