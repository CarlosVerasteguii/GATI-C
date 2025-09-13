import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const BrandCountAggregateInputObjectSchema: z.ZodType<Prisma.BrandCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BrandCountAggregateInputType>;
export const BrandCountAggregateInputObjectZodSchema = makeSchema();
