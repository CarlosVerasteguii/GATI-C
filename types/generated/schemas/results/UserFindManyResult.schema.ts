import { z } from 'zod';
export const UserFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});