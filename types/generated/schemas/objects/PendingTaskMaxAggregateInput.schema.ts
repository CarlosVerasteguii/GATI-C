import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  creatorId: z.literal(true).optional(),
  type: z.literal(true).optional(),
  status: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const PendingTaskMaxAggregateInputObjectSchema: z.ZodType<Prisma.PendingTaskMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskMaxAggregateInputType>;
export const PendingTaskMaxAggregateInputObjectZodSchema = makeSchema();
