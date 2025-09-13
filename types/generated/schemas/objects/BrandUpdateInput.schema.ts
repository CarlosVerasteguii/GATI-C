import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ProductUpdateManyWithoutBrandNestedInputObjectSchema } from './ProductUpdateManyWithoutBrandNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutBrandNestedInputObjectSchema).optional()
}).strict();
export const BrandUpdateInputObjectSchema: z.ZodType<Prisma.BrandUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUpdateInput>;
export const BrandUpdateInputObjectZodSchema = makeSchema();
