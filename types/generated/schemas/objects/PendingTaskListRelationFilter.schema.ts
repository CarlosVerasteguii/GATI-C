import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskWhereInputObjectSchema } from './PendingTaskWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => PendingTaskWhereInputObjectSchema).optional(),
  some: z.lazy(() => PendingTaskWhereInputObjectSchema).optional(),
  none: z.lazy(() => PendingTaskWhereInputObjectSchema).optional()
}).strict();
export const PendingTaskListRelationFilterObjectSchema: z.ZodType<Prisma.PendingTaskListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskListRelationFilter>;
export const PendingTaskListRelationFilterObjectZodSchema = makeSchema();
