import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskCountOutputTypeSelectObjectSchema } from './PendingTaskCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => PendingTaskCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const PendingTaskCountOutputTypeArgsObjectSchema = makeSchema();
export const PendingTaskCountOutputTypeArgsObjectZodSchema = makeSchema();
