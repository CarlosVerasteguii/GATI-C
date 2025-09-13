import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { ProductUpdateManyWithoutLocationNestedInputObjectSchema } from './ProductUpdateManyWithoutLocationNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutLocationNestedInputObjectSchema).optional()
}).strict();
export const LocationUpdateInputObjectSchema: z.ZodType<Prisma.LocationUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationUpdateInput>;
export const LocationUpdateInputObjectZodSchema = makeSchema();
