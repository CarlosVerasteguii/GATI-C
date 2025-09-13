import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateWithoutDocumentsInputObjectSchema } from './ProductCreateWithoutDocumentsInput.schema';
import { ProductUncheckedCreateWithoutDocumentsInputObjectSchema } from './ProductUncheckedCreateWithoutDocumentsInput.schema';
import { ProductCreateOrConnectWithoutDocumentsInputObjectSchema } from './ProductCreateOrConnectWithoutDocumentsInput.schema';
import { ProductUpsertWithoutDocumentsInputObjectSchema } from './ProductUpsertWithoutDocumentsInput.schema';
import { ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutDocumentsInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutDocumentsInput.schema';
import { ProductUpdateWithoutDocumentsInputObjectSchema } from './ProductUpdateWithoutDocumentsInput.schema';
import { ProductUncheckedUpdateWithoutDocumentsInputObjectSchema } from './ProductUncheckedUpdateWithoutDocumentsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutDocumentsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutDocumentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutDocumentsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutDocumentsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutDocumentsInputObjectSchema), z.lazy(() => ProductUpdateWithoutDocumentsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutDocumentsInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutDocumentsNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutDocumentsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutDocumentsNestedInput>;
export const ProductUpdateOneRequiredWithoutDocumentsNestedInputObjectZodSchema = makeSchema();
