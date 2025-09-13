import { z } from 'zod';
export const AuditLogDeleteManyResultSchema = z.object({
  count: z.number()
});