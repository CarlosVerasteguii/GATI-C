import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateNestedManyWithoutLocationInputObjectSchema } from './ProductCreateNestedManyWithoutLocationInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  products: z.lazy(() => ProductCreateNestedManyWithoutLocationInputObjectSchema)
}).strict();
export const LocationCreateInputObjectSchema: z.ZodType<Prisma.LocationCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationCreateInput>;
export const LocationCreateInputObjectZodSchema = makeSchema();
