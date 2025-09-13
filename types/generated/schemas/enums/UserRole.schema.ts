import { z } from 'zod';

export const UserRoleSchema = z.enum(['ADMINISTRATOR', 'EDITOR', 'READER'])

export type UserRole = z.infer<typeof UserRoleSchema>;