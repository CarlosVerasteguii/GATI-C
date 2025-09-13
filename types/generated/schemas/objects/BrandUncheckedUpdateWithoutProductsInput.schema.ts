import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const BrandUncheckedUpdateWithoutProductsInputObjectSchema: z.ZodType<Prisma.BrandUncheckedUpdateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.BrandUncheckedUpdateWithoutProductsInput>;
export const BrandUncheckedUpdateWithoutProductsInputObjectZodSchema = makeSchema();
