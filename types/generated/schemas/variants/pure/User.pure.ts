import { z } from 'zod';

import { UserRoleSchema } from '../../enums/UserRole.schema';
// prettier-ignore
export const UserModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    passwordHash: z.string(),
    role: UserRoleSchema,
    isActive: z.boolean(),
    lastLoginAt: z.date().nullable(),
    trustedIp: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    auditLogs: z.array(z.unknown()),
    pendingTasks: z.array(z.unknown())
}).strict();

export type UserModelType = z.infer<typeof UserModelSchema>;
