import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { UserArgsObjectSchema } from './UserArgs.schema';
import { TaskAuditLogFindManySchema } from '../findManyTaskAuditLog.schema';
import { PendingTaskCountOutputTypeArgsObjectSchema } from './PendingTaskCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  creator: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  taskAudit: z.union([z.boolean(), z.lazy(() => TaskAuditLogFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PendingTaskCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PendingTaskIncludeObjectSchema: z.ZodType<Prisma.PendingTaskInclude> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskInclude>;
export const PendingTaskIncludeObjectZodSchema = makeSchema();
