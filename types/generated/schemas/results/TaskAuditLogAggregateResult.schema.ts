import { z } from 'zod';
export const TaskAuditLogAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    taskId: z.number(),
    userId: z.number(),
    event: z.number(),
    details: z.number(),
    createdAt: z.number(),
    task: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    taskId: z.string().nullable(),
    userId: z.string().nullable(),
    event: z.string().nullable(),
    details: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    taskId: z.string().nullable(),
    userId: z.string().nullable(),
    event: z.string().nullable(),
    details: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});