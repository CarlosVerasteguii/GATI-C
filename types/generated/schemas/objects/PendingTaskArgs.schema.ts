import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskSelectObjectSchema } from './PendingTaskSelect.schema';
import { PendingTaskIncludeObjectSchema } from './PendingTaskInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PendingTaskSelectObjectSchema).optional(),
  include: z.lazy(() => PendingTaskIncludeObjectSchema).optional()
}).strict();
export const PendingTaskArgsObjectSchema = makeSchema();
export const PendingTaskArgsObjectZodSchema = makeSchema();
