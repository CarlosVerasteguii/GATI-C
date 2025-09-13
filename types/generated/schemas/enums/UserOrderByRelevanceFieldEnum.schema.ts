import { z } from 'zod';

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['id', 'name', 'email', 'passwordHash', 'trustedIp'])

export type UserOrderByRelevanceFieldEnum = z.infer<typeof UserOrderByRelevanceFieldEnumSchema>;