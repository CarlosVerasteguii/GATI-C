import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ProductUncheckedUpdateManyWithoutLocationNestedInputObjectSchema } from './ProductUncheckedUpdateManyWithoutLocationNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutLocationNestedInputObjectSchema).optional()
}).strict();
export const LocationUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.LocationUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationUncheckedUpdateInput>;
export const LocationUncheckedUpdateInputObjectZodSchema = makeSchema();
