import { z } from 'zod';

export const DocumentScalarFieldEnumSchema = z.enum(['id', 'originalFilename', 'storedUuidFilename', 'productId', 'deletedAt', 'createdAt'])

export type DocumentScalarFieldEnum = z.infer<typeof DocumentScalarFieldEnumSchema>;