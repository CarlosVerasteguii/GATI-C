import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutLocationInputObjectSchema } from './ProductUpdateWithoutLocationInput.schema';
import { ProductUncheckedUpdateWithoutLocationInputObjectSchema } from './ProductUncheckedUpdateWithoutLocationInput.schema';
import { ProductCreateWithoutLocationInputObjectSchema } from './ProductCreateWithoutLocationInput.schema';
import { ProductUncheckedCreateWithoutLocationInputObjectSchema } from './ProductUncheckedCreateWithoutLocationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductUpdateWithoutLocationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutLocationInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutLocationInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutLocationInputObjectSchema)])
}).strict();
export const ProductUpsertWithWhereUniqueWithoutLocationInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutLocationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutLocationInput>;
export const ProductUpsertWithWhereUniqueWithoutLocationInputObjectZodSchema = makeSchema();
