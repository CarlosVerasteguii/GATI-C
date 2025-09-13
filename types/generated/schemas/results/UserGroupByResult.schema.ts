import { z } from 'zod';
export const UserGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  isActive: z.boolean(),
  lastLoginAt: z.date(),
  trustedIp: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    name: z.number(),
    email: z.number(),
    passwordHash: z.number(),
    role: z.number(),
    isActive: z.number(),
    lastLoginAt: z.number(),
    trustedIp: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    auditLogs: z.number(),
    pendingTasks: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    passwordHash: z.string().nullable(),
    lastLoginAt: z.date().nullable(),
    trustedIp: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    passwordHash: z.string().nullable(),
    lastLoginAt: z.date().nullable(),
    trustedIp: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));