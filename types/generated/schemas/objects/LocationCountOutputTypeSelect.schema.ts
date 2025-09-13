import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  products: z.boolean().optional()
}).strict();
export const LocationCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.LocationCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.LocationCountOutputTypeSelect>;
export const LocationCountOutputTypeSelectObjectZodSchema = makeSchema();
