import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema } from './UserArgs.schema';
import { TaskAuditLogFindManySchema } from '../findManyTaskAuditLog.schema';
import { PendingTaskCountOutputTypeArgsObjectSchema } from './PendingTaskCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  creatorId: z.boolean().optional(),
  type: z.boolean().optional(),
  status: z.boolean().optional(),
  detailsJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  creator: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  taskAudit: z.union([z.boolean(), z.lazy(() => TaskAuditLogFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PendingTaskCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PendingTaskSelectObjectSchema: z.ZodType<Prisma.PendingTaskSelect> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskSelect>;
export const PendingTaskSelectObjectZodSchema = makeSchema();
