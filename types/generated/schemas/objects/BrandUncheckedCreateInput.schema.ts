import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUncheckedCreateNestedManyWithoutBrandInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutBrandInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutBrandInputObjectSchema)
}).strict();
export const BrandUncheckedCreateInputObjectSchema: z.ZodType<Prisma.BrandUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUncheckedCreateInput>;
export const BrandUncheckedCreateInputObjectZodSchema = makeSchema();
