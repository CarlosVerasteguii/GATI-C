import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema';
import { ProductUpdateManyMutationInputObjectSchema } from './ProductUpdateManyMutationInput.schema';
import { ProductUncheckedUpdateManyWithoutLocationInputObjectSchema } from './ProductUncheckedUpdateManyWithoutLocationInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateManyMutationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutLocationInputObjectSchema)])
}).strict();
export const ProductUpdateManyWithWhereWithoutLocationInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutLocationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutLocationInput>;
export const ProductUpdateManyWithWhereWithoutLocationInputObjectZodSchema = makeSchema();
