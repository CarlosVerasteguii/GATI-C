import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { CategoryWhereUniqueInputObjectSchema } from './CategoryWhereUniqueInput.schema';
import { CategoryCreateWithoutProductsInputObjectSchema } from './CategoryCreateWithoutProductsInput.schema';
import { CategoryUncheckedCreateWithoutProductsInputObjectSchema } from './CategoryUncheckedCreateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CategoryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => CategoryUncheckedCreateWithoutProductsInputObjectSchema)])
}).strict();
export const CategoryCreateOrConnectWithoutProductsInputObjectSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryCreateOrConnectWithoutProductsInput>;
export const CategoryCreateOrConnectWithoutProductsInputObjectZodSchema = makeSchema();
