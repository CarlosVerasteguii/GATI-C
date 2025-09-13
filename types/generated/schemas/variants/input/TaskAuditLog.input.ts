import { z } from 'zod';

// prettier-ignore
export const TaskAuditLogInputSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    userId: z.string(),
    event: z.string(),
    details: z.string().optional().nullable(),
    createdAt: z.date(),
    task: z.unknown()
}).strict();

export type TaskAuditLogInputType = z.infer<typeof TaskAuditLogInputSchema>;
