import { z } from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string()
}).strict();
export const LocationCreateManyInputObjectSchema: z.ZodType<Prisma.LocationCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationCreateManyInput>;
export const LocationCreateManyInputObjectZodSchema = makeSchema();
