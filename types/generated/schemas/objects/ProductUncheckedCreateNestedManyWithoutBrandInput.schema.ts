import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutBrandInputObjectSchema } from './ProductCreateWithoutBrandInput.schema';
import { ProductUncheckedCreateWithoutBrandInputObjectSchema } from './ProductUncheckedCreateWithoutBrandInput.schema';
import { ProductCreateOrConnectWithoutBrandInputObjectSchema } from './ProductCreateOrConnectWithoutBrandInput.schema';
import { ProductCreateManyBrandInputEnvelopeObjectSchema } from './ProductCreateManyBrandInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductCreateWithoutBrandInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutBrandInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutBrandInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyBrandInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductUncheckedCreateNestedManyWithoutBrandInputObjectSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutBrandInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutBrandInput>;
export const ProductUncheckedCreateNestedManyWithoutBrandInputObjectZodSchema = makeSchema();
