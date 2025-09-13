import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutLocationInputObjectSchema } from './ProductUpdateWithoutLocationInput.schema';
import { ProductUncheckedUpdateWithoutLocationInputObjectSchema } from './ProductUncheckedUpdateWithoutLocationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateWithoutLocationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutLocationInputObjectSchema)])
}).strict();
export const ProductUpdateWithWhereUniqueWithoutLocationInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutLocationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutLocationInput>;
export const ProductUpdateWithWhereUniqueWithoutLocationInputObjectZodSchema = makeSchema();
