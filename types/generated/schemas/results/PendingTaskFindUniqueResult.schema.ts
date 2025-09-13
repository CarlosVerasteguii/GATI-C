import { z } from 'zod';
export const PendingTaskFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  creatorId: z.string(),
  type: z.string(),
  status: z.string(),
  detailsJson: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  creator: z.unknown(),
  taskAudit: z.array(z.unknown())
}));