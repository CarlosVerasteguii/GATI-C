import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  taskId: z.literal(true).optional(),
  userId: z.literal(true).optional(),
  event: z.literal(true).optional(),
  details: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const TaskAuditLogMinAggregateInputObjectSchema: z.ZodType<Prisma.TaskAuditLogMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskAuditLogMinAggregateInputType>;
export const TaskAuditLogMinAggregateInputObjectZodSchema = makeSchema();
