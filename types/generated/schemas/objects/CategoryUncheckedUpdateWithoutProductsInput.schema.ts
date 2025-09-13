import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional()
}).strict();
export const CategoryUncheckedUpdateWithoutProductsInputObjectSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CategoryUncheckedUpdateWithoutProductsInput>;
export const CategoryUncheckedUpdateWithoutProductsInputObjectZodSchema = makeSchema();
