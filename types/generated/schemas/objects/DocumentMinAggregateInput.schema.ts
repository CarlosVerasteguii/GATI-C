import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  originalFilename: z.literal(true).optional(),
  storedUuidFilename: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  deletedAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const DocumentMinAggregateInputObjectSchema: z.ZodType<Prisma.DocumentMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.DocumentMinAggregateInputType>;
export const DocumentMinAggregateInputObjectZodSchema = makeSchema();
