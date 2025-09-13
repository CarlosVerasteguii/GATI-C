import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandCreateWithoutProductsInputObjectSchema } from './BrandCreateWithoutProductsInput.schema';
import { BrandUncheckedCreateWithoutProductsInputObjectSchema } from './BrandUncheckedCreateWithoutProductsInput.schema';
import { BrandCreateOrConnectWithoutProductsInputObjectSchema } from './BrandCreateOrConnectWithoutProductsInput.schema';
import { BrandUpsertWithoutProductsInputObjectSchema } from './BrandUpsertWithoutProductsInput.schema';
import { BrandWhereInputObjectSchema } from './BrandWhereInput.schema';
import { BrandWhereUniqueInputObjectSchema } from './BrandWhereUniqueInput.schema';
import { BrandUpdateToOneWithWhereWithoutProductsInputObjectSchema } from './BrandUpdateToOneWithWhereWithoutProductsInput.schema';
import { BrandUpdateWithoutProductsInputObjectSchema } from './BrandUpdateWithoutProductsInput.schema';
import { BrandUncheckedUpdateWithoutProductsInputObjectSchema } from './BrandUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BrandCreateWithoutProductsInputObjectSchema), z.lazy(() => BrandUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BrandCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  upsert: z.lazy(() => BrandUpsertWithoutProductsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => BrandWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => BrandWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => BrandWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BrandUpdateToOneWithWhereWithoutProductsInputObjectSchema), z.lazy(() => BrandUpdateWithoutProductsInputObjectSchema), z.lazy(() => BrandUncheckedUpdateWithoutProductsInputObjectSchema)]).optional()
}).strict();
export const BrandUpdateOneWithoutProductsNestedInputObjectSchema: z.ZodType<Prisma.BrandUpdateOneWithoutProductsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUpdateOneWithoutProductsNestedInput>;
export const BrandUpdateOneWithoutProductsNestedInputObjectZodSchema = makeSchema();
