import { z } from 'zod';

// prettier-ignore
export const AuditLogResultSchema = z.object({
    id: z.string(),
    userId: z.string(),
    action: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    changesJson: z.unknown(),
    createdAt: z.date(),
    user: z.unknown()
}).strict();

export type AuditLogResultType = z.infer<typeof AuditLogResultSchema>;
