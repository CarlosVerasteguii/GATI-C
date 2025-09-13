import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const BrandCreateManyInputObjectSchema: z.ZodType<Prisma.BrandCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandCreateManyInput>;
export const BrandCreateManyInputObjectZodSchema = makeSchema();
