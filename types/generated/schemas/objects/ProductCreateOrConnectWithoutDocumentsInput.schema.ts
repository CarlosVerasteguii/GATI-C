import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutDocumentsInputObjectSchema } from './ProductCreateWithoutDocumentsInput.schema';
import { ProductUncheckedCreateWithoutDocumentsInputObjectSchema } from './ProductUncheckedCreateWithoutDocumentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutDocumentsInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutDocumentsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutDocumentsInput>;
export const ProductCreateOrConnectWithoutDocumentsInputObjectZodSchema = makeSchema();
