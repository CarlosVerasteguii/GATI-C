import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandCreateWithoutProductsInputObjectSchema } from './BrandCreateWithoutProductsInput.schema';
import { BrandUncheckedCreateWithoutProductsInputObjectSchema } from './BrandUncheckedCreateWithoutProductsInput.schema';
import { BrandCreateOrConnectWithoutProductsInputObjectSchema } from './BrandCreateOrConnectWithoutProductsInput.schema';
import { BrandWhereUniqueInputObjectSchema } from './BrandWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BrandCreateWithoutProductsInputObjectSchema), z.lazy(() => BrandUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BrandCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  connect: z.lazy(() => BrandWhereUniqueInputObjectSchema).optional()
}).strict();
export const BrandCreateNestedOneWithoutProductsInputObjectSchema: z.ZodType<Prisma.BrandCreateNestedOneWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandCreateNestedOneWithoutProductsInput>;
export const BrandCreateNestedOneWithoutProductsInputObjectZodSchema = makeSchema();
