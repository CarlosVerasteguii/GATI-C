import { z } from 'zod';
export const PendingTaskFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  creatorId: z.string(),
  type: z.string(),
  status: z.string(),
  detailsJson: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  creator: z.unknown(),
  taskAudit: z.array(z.unknown())
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});