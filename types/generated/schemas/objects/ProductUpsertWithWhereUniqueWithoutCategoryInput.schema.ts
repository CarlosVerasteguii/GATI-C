import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutCategoryInputObjectSchema } from './ProductUpdateWithoutCategoryInput.schema';
import { ProductUncheckedUpdateWithoutCategoryInputObjectSchema } from './ProductUncheckedUpdateWithoutCategoryInput.schema';
import { ProductCreateWithoutCategoryInputObjectSchema } from './ProductCreateWithoutCategoryInput.schema';
import { ProductUncheckedCreateWithoutCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductUpdateWithoutCategoryInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutCategoryInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutCategoryInputObjectSchema)])
}).strict();
export const ProductUpsertWithWhereUniqueWithoutCategoryInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutCategoryInput>;
export const ProductUpsertWithWhereUniqueWithoutCategoryInputObjectZodSchema = makeSchema();
