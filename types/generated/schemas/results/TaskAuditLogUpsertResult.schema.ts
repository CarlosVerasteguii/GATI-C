import { z } from 'zod';
export const TaskAuditLogUpsertResultSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  userId: z.string(),
  event: z.string(),
  details: z.string().optional(),
  createdAt: z.date(),
  task: z.unknown()
});