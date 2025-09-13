import { z } from 'zod';
export const PendingTaskAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    creatorId: z.number(),
    type: z.number(),
    status: z.number(),
    detailsJson: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    creator: z.number(),
    taskAudit: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    creatorId: z.string().nullable(),
    type: z.string().nullable(),
    status: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    creatorId: z.string().nullable(),
    type: z.string().nullable(),
    status: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});