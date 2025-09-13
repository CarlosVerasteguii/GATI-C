import { z } from 'zod';
export const AuditLogDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  userId: z.string(),
  action: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  changesJson: z.unknown(),
  createdAt: z.date(),
  user: z.unknown()
}));