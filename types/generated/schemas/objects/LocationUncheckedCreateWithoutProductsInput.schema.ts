import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const LocationUncheckedCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.LocationUncheckedCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationUncheckedCreateWithoutProductsInput>;
export const LocationUncheckedCreateWithoutProductsInputObjectZodSchema = makeSchema();
