import { z } from 'zod';
export const TaskAuditLogCreateManyResultSchema = z.object({
  count: z.number()
});