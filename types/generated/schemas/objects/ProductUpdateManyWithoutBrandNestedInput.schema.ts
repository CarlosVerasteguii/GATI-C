import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutBrandInputObjectSchema } from './ProductCreateWithoutBrandInput.schema';
import { ProductUncheckedCreateWithoutBrandInputObjectSchema } from './ProductUncheckedCreateWithoutBrandInput.schema';
import { ProductCreateOrConnectWithoutBrandInputObjectSchema } from './ProductCreateOrConnectWithoutBrandInput.schema';
import { ProductUpsertWithWhereUniqueWithoutBrandInputObjectSchema } from './ProductUpsertWithWhereUniqueWithoutBrandInput.schema';
import { ProductCreateManyBrandInputEnvelopeObjectSchema } from './ProductCreateManyBrandInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithWhereUniqueWithoutBrandInputObjectSchema } from './ProductUpdateWithWhereUniqueWithoutBrandInput.schema';
import { ProductUpdateManyWithWhereWithoutBrandInputObjectSchema } from './ProductUpdateManyWithWhereWithoutBrandInput.schema';
import { ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductCreateWithoutBrandInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBrandInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutBrandInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutBrandInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductUpsertWithWhereUniqueWithoutBrandInputObjectSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutBrandInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyBrandInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductUpdateWithWhereUniqueWithoutBrandInputObjectSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutBrandInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductUpdateManyWithWhereWithoutBrandInputObjectSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutBrandInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductUpdateManyWithoutBrandNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithoutBrandNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithoutBrandNestedInput>;
export const ProductUpdateManyWithoutBrandNestedInputObjectZodSchema = makeSchema();
