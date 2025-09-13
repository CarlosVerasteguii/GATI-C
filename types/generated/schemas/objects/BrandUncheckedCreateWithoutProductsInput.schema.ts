import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const BrandUncheckedCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.BrandUncheckedCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUncheckedCreateWithoutProductsInput>;
export const BrandUncheckedCreateWithoutProductsInputObjectZodSchema = makeSchema();
