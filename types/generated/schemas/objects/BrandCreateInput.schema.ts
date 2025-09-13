import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateNestedManyWithoutBrandInputObjectSchema } from './ProductCreateNestedManyWithoutBrandInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  products: z.lazy(() => ProductCreateNestedManyWithoutBrandInputObjectSchema)
}).strict();
export const BrandCreateInputObjectSchema: z.ZodType<Prisma.BrandCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandCreateInput>;
export const BrandCreateInputObjectZodSchema = makeSchema();
