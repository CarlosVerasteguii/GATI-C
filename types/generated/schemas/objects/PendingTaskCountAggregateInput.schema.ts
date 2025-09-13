import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  creatorId: z.literal(true).optional(),
  type: z.literal(true).optional(),
  status: z.literal(true).optional(),
  detailsJson: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const PendingTaskCountAggregateInputObjectSchema: z.ZodType<Prisma.PendingTaskCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.PendingTaskCountAggregateInputType>;
export const PendingTaskCountAggregateInputObjectZodSchema = makeSchema();
