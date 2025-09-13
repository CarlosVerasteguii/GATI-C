import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const LocationCountAggregateInputObjectSchema: z.ZodType<Prisma.LocationCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.LocationCountAggregateInputType>;
export const LocationCountAggregateInputObjectZodSchema = makeSchema();
