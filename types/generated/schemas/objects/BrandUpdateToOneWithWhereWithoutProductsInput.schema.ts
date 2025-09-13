import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandWhereInputObjectSchema } from './BrandWhereInput.schema';
import { BrandUpdateWithoutProductsInputObjectSchema } from './BrandUpdateWithoutProductsInput.schema';
import { BrandUncheckedUpdateWithoutProductsInputObjectSchema } from './BrandUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BrandWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => BrandUpdateWithoutProductsInputObjectSchema), z.lazy(() => BrandUncheckedUpdateWithoutProductsInputObjectSchema)])
}).strict();
export const BrandUpdateToOneWithWhereWithoutProductsInputObjectSchema: z.ZodType<Prisma.BrandUpdateToOneWithWhereWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUpdateToOneWithWhereWithoutProductsInput>;
export const BrandUpdateToOneWithWhereWithoutProductsInputObjectZodSchema = makeSchema();
