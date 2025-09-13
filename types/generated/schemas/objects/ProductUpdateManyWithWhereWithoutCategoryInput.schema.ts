import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema';
import { ProductUpdateManyMutationInputObjectSchema } from './ProductUpdateManyMutationInput.schema';
import { ProductUncheckedUpdateManyWithoutCategoryInputObjectSchema } from './ProductUncheckedUpdateManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateManyMutationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutCategoryInputObjectSchema)])
}).strict();
export const ProductUpdateManyWithWhereWithoutCategoryInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutCategoryInput>;
export const ProductUpdateManyWithWhereWithoutCategoryInputObjectZodSchema = makeSchema();
