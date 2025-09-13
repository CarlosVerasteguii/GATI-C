import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutBrandInputObjectSchema } from './ProductUpdateWithoutBrandInput.schema';
import { ProductUncheckedUpdateWithoutBrandInputObjectSchema } from './ProductUncheckedUpdateWithoutBrandInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateWithoutBrandInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutBrandInputObjectSchema)])
}).strict();
export const ProductUpdateWithWhereUniqueWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutBrandInput>;
export const ProductUpdateWithWhereUniqueWithoutBrandInputObjectZodSchema = makeSchema();
