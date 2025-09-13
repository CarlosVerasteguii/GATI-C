import { z } from 'zod';

export const LocationScalarFieldEnumSchema = z.enum(['id', 'name'])

export type LocationScalarFieldEnum = z.infer<typeof LocationScalarFieldEnumSchema>;