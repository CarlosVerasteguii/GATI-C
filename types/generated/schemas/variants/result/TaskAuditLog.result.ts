import { z } from 'zod';

// prettier-ignore
export const TaskAuditLogResultSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    userId: z.string(),
    event: z.string(),
    details: z.string().nullable(),
    createdAt: z.date(),
    task: z.unknown()
}).strict();

export type TaskAuditLogResultType = z.infer<typeof TaskAuditLogResultSchema>;
