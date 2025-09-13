import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  products: z.boolean().optional()
}).strict();
export const BrandCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.BrandCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.BrandCountOutputTypeSelect>;
export const BrandCountOutputTypeSelectObjectZodSchema = makeSchema();
