import { z } from 'zod';

// prettier-ignore
export const AuditLogInputSchema = z.object({
    id: z.string(),
    userId: z.string(),
    action: z.string(),
    targetType: z.string(),
    targetId: z.string(),
    changesJson: z.unknown(),
    createdAt: z.date(),
    user: z.unknown()
}).strict();

export type AuditLogInputType = z.infer<typeof AuditLogInputSchema>;
