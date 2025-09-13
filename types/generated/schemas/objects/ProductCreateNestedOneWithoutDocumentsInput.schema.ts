import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutDocumentsInputObjectSchema } from './ProductCreateWithoutDocumentsInput.schema';
import { ProductUncheckedCreateWithoutDocumentsInputObjectSchema } from './ProductUncheckedCreateWithoutDocumentsInput.schema';
import { ProductCreateOrConnectWithoutDocumentsInputObjectSchema } from './ProductCreateOrConnectWithoutDocumentsInput.schema';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutDocumentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutDocumentsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutDocumentsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutDocumentsInput>;
export const ProductCreateNestedOneWithoutDocumentsInputObjectZodSchema = makeSchema();
