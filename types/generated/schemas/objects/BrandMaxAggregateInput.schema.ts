import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const BrandMaxAggregateInputObjectSchema: z.ZodType<Prisma.BrandMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BrandMaxAggregateInputType>;
export const BrandMaxAggregateInputObjectZodSchema = makeSchema();
