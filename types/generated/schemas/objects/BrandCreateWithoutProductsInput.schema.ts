import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const BrandCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.BrandCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandCreateWithoutProductsInput>;
export const BrandCreateWithoutProductsInputObjectZodSchema = makeSchema();
