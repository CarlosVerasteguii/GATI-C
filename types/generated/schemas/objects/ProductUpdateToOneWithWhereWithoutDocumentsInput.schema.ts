import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutDocumentsInputObjectSchema } from './ProductUpdateWithoutDocumentsInput.schema';
import { ProductUncheckedUpdateWithoutDocumentsInputObjectSchema } from './ProductUncheckedUpdateWithoutDocumentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutDocumentsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutDocumentsInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutDocumentsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutDocumentsInput>;
export const ProductUpdateToOneWithWhereWithoutDocumentsInputObjectZodSchema = makeSchema();
