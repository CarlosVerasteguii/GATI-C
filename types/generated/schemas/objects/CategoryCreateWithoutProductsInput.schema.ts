import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const CategoryCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.CategoryCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryCreateWithoutProductsInput>;
export const CategoryCreateWithoutProductsInputObjectZodSchema = makeSchema();
