import { z } from 'zod';
export const LocationCreateManyResultSchema = z.object({
  count: z.number()
});