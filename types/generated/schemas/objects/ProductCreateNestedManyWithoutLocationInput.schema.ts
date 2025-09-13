import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutLocationInputObjectSchema } from './ProductCreateWithoutLocationInput.schema';
import { ProductUncheckedCreateWithoutLocationInputObjectSchema } from './ProductUncheckedCreateWithoutLocationInput.schema';
import { ProductCreateOrConnectWithoutLocationInputObjectSchema } from './ProductCreateOrConnectWithoutLocationInput.schema';
import { ProductCreateManyLocationInputEnvelopeObjectSchema } from './ProductCreateManyLocationInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutLocationInputObjectSchema), z.lazy(() => ProductCreateWithoutLocationInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutLocationInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutLocationInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutLocationInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutLocationInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManyLocationInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductCreateNestedManyWithoutLocationInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutLocationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedManyWithoutLocationInput>;
export const ProductCreateNestedManyWithoutLocationInputObjectZodSchema = makeSchema();
