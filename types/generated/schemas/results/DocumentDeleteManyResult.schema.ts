import { z } from 'zod';
export const DocumentDeleteManyResultSchema = z.object({
  count: z.number()
});