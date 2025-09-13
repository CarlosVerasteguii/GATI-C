import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutLocationInputObjectSchema } from './ProductCreateWithoutLocationInput.schema';
import { ProductUncheckedCreateWithoutLocationInputObjectSchema } from './ProductUncheckedCreateWithoutLocationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutLocationInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutLocationInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutLocationInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutLocationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutLocationInput>;
export const ProductCreateOrConnectWithoutLocationInputObjectZodSchema = makeSchema();
