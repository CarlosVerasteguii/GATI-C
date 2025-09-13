import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const LocationUpdateWithoutProductsInputObjectSchema: z.ZodType<Prisma.LocationUpdateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.LocationUpdateWithoutProductsInput>;
export const LocationUpdateWithoutProductsInputObjectZodSchema = makeSchema();
