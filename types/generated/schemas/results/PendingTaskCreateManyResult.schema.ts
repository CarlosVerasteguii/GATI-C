import { z } from 'zod';
export const PendingTaskCreateManyResultSchema = z.object({
  count: z.number()
});