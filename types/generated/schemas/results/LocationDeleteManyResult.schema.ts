import { z } from 'zod';
export const LocationDeleteManyResultSchema = z.object({
  count: z.number()
});