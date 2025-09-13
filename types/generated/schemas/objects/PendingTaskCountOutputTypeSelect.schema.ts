import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  taskAudit: z.boolean().optional()
}).strict();
export const PendingTaskCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.PendingTaskCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCountOutputTypeSelect>;
export const PendingTaskCountOutputTypeSelectObjectZodSchema = makeSchema();
