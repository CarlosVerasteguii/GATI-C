import { z } from 'zod';
export const UserFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  role: z.unknown(),
  isActive: z.boolean(),
  lastLoginAt: z.date().optional(),
  trustedIp: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  auditLogs: z.array(z.unknown()),
  pendingTasks: z.array(z.unknown())
}));