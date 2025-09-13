import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ProductUncheckedUpdateManyWithoutBrandNestedInputObjectSchema } from './ProductUncheckedUpdateManyWithoutBrandNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutBrandNestedInputObjectSchema).optional()
}).strict();
export const BrandUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.BrandUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUncheckedUpdateInput>;
export const BrandUncheckedUpdateInputObjectZodSchema = makeSchema();
