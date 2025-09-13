import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandUpdateWithoutProductsInputObjectSchema } from './BrandUpdateWithoutProductsInput.schema';
import { BrandUncheckedUpdateWithoutProductsInputObjectSchema } from './BrandUncheckedUpdateWithoutProductsInput.schema';
import { BrandCreateWithoutProductsInputObjectSchema } from './BrandCreateWithoutProductsInput.schema';
import { BrandUncheckedCreateWithoutProductsInputObjectSchema } from './BrandUncheckedCreateWithoutProductsInput.schema';
import { BrandWhereInputObjectSchema } from './BrandWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => BrandUpdateWithoutProductsInputObjectSchema), z.lazy(() => BrandUncheckedUpdateWithoutProductsInputObjectSchema)]),
  create: z.union([z.lazy(() => BrandCreateWithoutProductsInputObjectSchema), z.lazy(() => BrandUncheckedCreateWithoutProductsInputObjectSchema)]),
  where: z.lazy(() => BrandWhereInputObjectSchema).optional()
}).strict();
export const BrandUpsertWithoutProductsInputObjectSchema: z.ZodType<Prisma.BrandUpsertWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUpsertWithoutProductsInput>;
export const BrandUpsertWithoutProductsInputObjectZodSchema = makeSchema();
