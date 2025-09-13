import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const CategoryUncheckedCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryUncheckedCreateWithoutProductsInput>;
export const CategoryUncheckedCreateWithoutProductsInputObjectZodSchema = makeSchema();
