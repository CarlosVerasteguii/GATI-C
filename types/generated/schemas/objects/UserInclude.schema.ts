import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { AuditLogFindManySchema } from '../findManyAuditLog.schema';
import { PendingTaskFindManySchema } from '../findManyPendingTask.schema';
import { UserCountOutputTypeArgsObjectSchema } from './UserCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  auditLogs: z.union([z.boolean(), z.lazy(() => AuditLogFindManySchema)]).optional(),
  pendingTasks: z.union([z.boolean(), z.lazy(() => PendingTaskFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const UserIncludeObjectSchema: z.ZodType<Prisma.UserInclude> = makeSchema() as unknown as z.ZodType<Prisma.UserInclude>;
export const UserIncludeObjectZodSchema = makeSchema();
