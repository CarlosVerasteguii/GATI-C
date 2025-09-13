import { z } from 'zod';
export const AuditLogGroupByResultSchema = z.array(z.object({
  id: z.string(),
  userId: z.string(),
  action: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  changesJson: z.unknown(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    userId: z.number(),
    action: z.number(),
    targetType: z.number(),
    targetId: z.number(),
    changesJson: z.number(),
    createdAt: z.number(),
    user: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    userId: z.string().nullable(),
    action: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    userId: z.string().nullable(),
    action: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));