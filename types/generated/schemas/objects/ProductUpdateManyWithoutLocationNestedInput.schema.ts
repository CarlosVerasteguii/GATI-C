import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutLocationInputObjectSchema } from './ProductCreateWithoutLocationInput.schema';
import { ProductUncheckedCreateWithoutLocationInputObjectSchema } from './ProductUncheckedCreateWithoutLocationInput.schema';
import { ProductCreateOrConnectWithoutLocationInputObjectSchema } from './ProductCreateOrConnectWithoutLocationInput.schema';
import { ProductUpsertWithWhereUniqueWithoutLocationInputObjectSchema } from './ProductUpsertWithWhereUniqueWithoutLocationInput.schema';
import { ProductCreateManyLocationInputEnvelopeObjectSchema } from './ProductCreateManyLocationInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithWhereUniqueWithoutLocationInputObjectSchema } from './ProductUpdateWithWhereUniqueWithoutLocationInput.schema';
import { ProductUpdateManyWithWhereWithoutLocationInputObjectSchema } from './ProductUpdateManyWithWhereWithoutLocationInput.schema';
import { ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutLocationInputObjectSchema), z.lazy(() => ProductCreateWithoutLocationInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutLocationInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutLocationInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutLocationInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutLocationInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductUpsertWithWhereUniqueWithoutLocationInputObjectSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutLocationInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyLocationInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductUpdateWithWhereUniqueWithoutLocationInputObjectSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutLocationInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductUpdateManyWithWhereWithoutLocationInputObjectSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutLocationInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductUpdateManyWithoutLocationNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithoutLocationNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithoutLocationNestedInput>;
export const ProductUpdateManyWithoutLocationNestedInputObjectZodSchema = makeSchema();
