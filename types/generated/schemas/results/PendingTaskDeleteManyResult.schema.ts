import { z } from 'zod';
export const PendingTaskDeleteManyResultSchema = z.object({
  count: z.number()
});