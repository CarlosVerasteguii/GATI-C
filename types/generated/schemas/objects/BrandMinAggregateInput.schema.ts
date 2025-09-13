import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional()
}).strict();
export const BrandMinAggregateInputObjectSchema: z.ZodType<Prisma.BrandMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BrandMinAggregateInputType>;
export const BrandMinAggregateInputObjectZodSchema = makeSchema();
