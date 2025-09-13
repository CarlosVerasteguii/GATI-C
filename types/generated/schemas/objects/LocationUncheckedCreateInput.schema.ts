import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUncheckedCreateNestedManyWithoutLocationInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutLocationInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutLocationInputObjectSchema)
}).strict();
export const LocationUncheckedCreateInputObjectSchema: z.ZodType<Prisma.LocationUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationUncheckedCreateInput>;
export const LocationUncheckedCreateInputObjectZodSchema = makeSchema();
