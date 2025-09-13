import { z } from 'zod';

// prettier-ignore
export const PendingTaskInputSchema = z.object({
    id: z.string(),
    creatorId: z.string(),
    type: z.string(),
    status: z.string(),
    detailsJson: z.unknown(),
    createdAt: z.date(),
    updatedAt: z.date(),
    creator: z.unknown(),
    taskAudit: z.array(z.unknown())
}).strict();

export type PendingTaskInputType = z.infer<typeof PendingTaskInputSchema>;
