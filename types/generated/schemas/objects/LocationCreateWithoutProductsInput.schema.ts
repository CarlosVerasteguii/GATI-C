import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const LocationCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.LocationCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationCreateWithoutProductsInput>;
export const LocationCreateWithoutProductsInputObjectZodSchema = makeSchema();
