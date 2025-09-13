import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { CategoryCreateWithoutProductsInputObjectSchema } from './CategoryCreateWithoutProductsInput.schema';
import { CategoryUncheckedCreateWithoutProductsInputObjectSchema } from './CategoryUncheckedCreateWithoutProductsInput.schema';
import { CategoryCreateOrConnectWithoutProductsInputObjectSchema } from './CategoryCreateOrConnectWithoutProductsInput.schema';
import { CategoryUpsertWithoutProductsInputObjectSchema } from './CategoryUpsertWithoutProductsInput.schema';
import { CategoryWhereInputObjectSchema } from './CategoryWhereInput.schema';
import { CategoryWhereUniqueInputObjectSchema } from './CategoryWhereUniqueInput.schema';
import { CategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema } from './CategoryUpdateToOneWithWhereWithoutProductsInput.schema';
import { CategoryUpdateWithoutProductsInputObjectSchema } from './CategoryUpdateWithoutProductsInput.schema';
import { CategoryUncheckedUpdateWithoutProductsInputObjectSchema } from './CategoryUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => CategoryUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutProductsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CategoryWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CategoryWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema), z.lazy(() => CategoryUpdateWithoutProductsInputObjectSchema), z.lazy(() => CategoryUncheckedUpdateWithoutProductsInputObjectSchema)]).optional()
}).strict();
export const CategoryUpdateOneWithoutProductsNestedInputObjectSchema: z.ZodType<Prisma.CategoryUpdateOneWithoutProductsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryUpdateOneWithoutProductsNestedInput>;
export const CategoryUpdateOneWithoutProductsNestedInputObjectZodSchema = makeSchema();
