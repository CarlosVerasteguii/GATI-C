import { z } from 'zod';

import { UserRoleSchema } from '../../enums/UserRole.schema';
// prettier-ignore
export const UserInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    passwordHash: z.string(),
    role: UserRoleSchema,
    isActive: z.boolean(),
    lastLoginAt: z.date().optional().nullable(),
    trustedIp: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    auditLogs: z.array(z.unknown()),
    pendingTasks: z.array(z.unknown())
}).strict();

export type UserInputType = z.infer<typeof UserInputSchema>;
