import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductUpdateWithoutDocumentsInputObjectSchema } from './ProductUpdateWithoutDocumentsInput.schema';
import { ProductUncheckedUpdateWithoutDocumentsInputObjectSchema } from './ProductUncheckedUpdateWithoutDocumentsInput.schema';
import { ProductCreateWithoutDocumentsInputObjectSchema } from './ProductCreateWithoutDocumentsInput.schema';
import { ProductUncheckedCreateWithoutDocumentsInputObjectSchema } from './ProductUncheckedCreateWithoutDocumentsInput.schema';
import { ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutDocumentsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutDocumentsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutDocumentsInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutDocumentsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutDocumentsInput>;
export const ProductUpsertWithoutDocumentsInputObjectZodSchema = makeSchema();
