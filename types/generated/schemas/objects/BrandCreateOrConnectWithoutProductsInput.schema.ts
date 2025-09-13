import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { BrandWhereUniqueInputObjectSchema } from './BrandWhereUniqueInput.schema';
import { BrandCreateWithoutProductsInputObjectSchema } from './BrandCreateWithoutProductsInput.schema';
import { BrandUncheckedCreateWithoutProductsInputObjectSchema } from './BrandUncheckedCreateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BrandWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BrandCreateWithoutProductsInputObjectSchema), z.lazy(() => BrandUncheckedCreateWithoutProductsInputObjectSchema)])
}).strict();
export const BrandCreateOrConnectWithoutProductsInputObjectSchema: z.ZodType<Prisma.BrandCreateOrConnectWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandCreateOrConnectWithoutProductsInput>;
export const BrandCreateOrConnectWithoutProductsInputObjectZodSchema = makeSchema();
