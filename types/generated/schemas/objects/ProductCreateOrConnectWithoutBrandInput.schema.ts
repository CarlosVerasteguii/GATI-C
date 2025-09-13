import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutBrandInputObjectSchema } from './ProductCreateWithoutBrandInput.schema';
import { ProductUncheckedCreateWithoutBrandInputObjectSchema } from './ProductUncheckedCreateWithoutBrandInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutBrandInput>;
export const ProductCreateOrConnectWithoutBrandInputObjectZodSchema = makeSchema();
