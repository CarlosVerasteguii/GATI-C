import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { PendingTaskWhereInputObjectSchema } from './PendingTaskWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => PendingTaskWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => PendingTaskWhereInputObjectSchema).optional()
}).strict();
export const PendingTaskScalarRelationFilterObjectSchema: z.ZodType<Prisma.PendingTaskScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskScalarRelationFilter>;
export const PendingTaskScalarRelationFilterObjectZodSchema = makeSchema();
