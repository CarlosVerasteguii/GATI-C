import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutCategoryInputObjectSchema } from './ProductCreateWithoutCategoryInput.schema';
import { ProductUncheckedCreateWithoutCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutCategoryInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutCategoryInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutCategoryInput>;
export const ProductCreateOrConnectWithoutCategoryInputObjectZodSchema = makeSchema();
